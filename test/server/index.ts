import path from 'path'
import Koa from 'koa'
import single from '../../src'

export default (port: number): Promise<() => void> => {
  const app = new Koa()

  app.use(single({ dir: path.join(__dirname, 'static') }))
  app.use(async (ctx: Koa.Context) => {
    if (ctx.path === '/api/get') ctx.body = 'get'
    if (ctx.path === '/api/403') ctx.throw(403)
  })
  return new Promise((reslove, reject) => {
    try {
      const server = app.listen(port, () => {
        reslove(() => server.close())
      })
    } catch (error) {
      reject(error)
    }
  })
}