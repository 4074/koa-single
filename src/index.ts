import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'

const indexPaths = ['/', '/index.html']
let indexBuffer: Buffer

export default (dir: string, test: RegExp | null = /^(?!\/api)/): (
  (ctx: Koa.Context, next: () => Promise<any>) => void
) => {
  return async (ctx, next) => {
    if (test && !test.test(ctx.path)) return next()

    // Try to find the static files.
    if (!indexPaths.includes(ctx.path)) {
      await koaStatic(path.resolve(dir), {
        maxage: 31536000000
      })(ctx, next)
    }

    // Found static file
    if (ctx.status === 200) return

    // Set buffer cache.
    // Restart to server to refresh the cache.
    if (!indexBuffer) {
      const indexFilePath = path.resolve(dir, 'index.html')
      if (fs.existsSync(indexFilePath)) indexBuffer = fs.readFileSync(indexFilePath)
    }

    if (!indexBuffer) return next()
    ctx.type = 'html'
    ctx.body = indexBuffer
  }
}
