import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'

const indexPaths = ['/', '/index.html']
let indexBuffer: Buffer

export default function (options: {
  path: string
  test?: RegExp
}): (ctx: Koa.Context, next: () => Promise<any>) => void {
  return async (ctx, next) => {
    if (options.test && !options.test.test(ctx.path)) return next()

    if (!indexPaths.includes(ctx.path)) {
      await koaStatic(path.resolve(options.path), {
        maxage: 31536000000
      })(ctx, next)
    }

    if (ctx.status === 200) return
    if (!indexBuffer) {
      const indexFilePath = path.resolve(options.path, 'index.html')
      if (fs.existsSync(indexFilePath)) indexBuffer = fs.readFileSync(indexFilePath)
    }

    if (!indexBuffer) return next()
    ctx.type = 'html'
    ctx.body = indexBuffer
  }
}
