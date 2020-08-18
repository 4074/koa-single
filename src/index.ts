import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'

let indexBuffer: Buffer

export default function(options: {path: string, test?: RegExp}): (ctx: Koa.Context, next: () => Promise<any>) => void {
  return async (ctx, next) => {
    if (options.test && !options.test.test(ctx.path)) {
      await next()
    } else {
      await koaStatic(path.resolve(options.path), {
        maxage: 31536000000
      })(ctx, next)
      if (ctx.status !== 200) {
        if (!indexBuffer) {
          const indexPath = path.resolve(options.path, 'index.html')
          indexBuffer = fs.readFileSync(indexPath)
        }
        ctx.type = 'html'
        ctx.body = indexBuffer
      }
    }
  }
}