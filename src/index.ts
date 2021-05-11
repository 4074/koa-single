import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'

const indexPaths = ['/', '/index.html']
let indexBuffer: Buffer

const isProd = process.env.NODE_ENV === 'production'

export interface KoaSingleOptions { dir: string, test?: RegExp | null }

export default ({ dir, test = /^(?!\/api)/ }: KoaSingleOptions): Koa.Middleware => {
  return async (ctx: any, next) => {
    if (test && !test.test(ctx.path)) return next()

    // Try to find the static files.
    if (!indexPaths.includes(ctx.path)) {
      await koaStatic(path.resolve(dir), {
        maxage: 31536000000
      })(ctx, next)
    }

    // Found static file
    if (ctx.status === 200) return

    // In production, using buffer cache for `index.html`.
    // And must restart server to refresh the cache.
    if (!indexBuffer || !isProd) {
      const indexFilePath = path.resolve(dir, 'index.html')
      if (fs.existsSync(indexFilePath)) indexBuffer = fs.readFileSync(indexFilePath)
    }

    if (!indexBuffer) return next()
    ctx.type = 'html'
    ctx.body = indexBuffer
  }
}
