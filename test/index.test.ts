import fs from 'fs'
import path from 'path'
import axios from 'axios'
import server from './server'

const port = 3040
const host = `http://localhost:${port}`
let close: (() => void) | undefined

beforeAll(async () => {
  close = await server(3040)
})

describe('Run single server', () => {
  test('Get index.html', async () => {
    const { data } = await axios.get(host)
    expect(data).toBe(
      fs.readFileSync(
        path.join(__dirname, 'server/static/index.html')
      ).toString()
    )
  })

  test('Get test.txt', async () => {
    const { data } = await axios.get(`${host}/test.txt`)
    expect(data).toBe(
      fs.readFileSync(
        path.join(__dirname, 'server/static/test.txt')
      ).toString()
    )
  })

  test('Get /api/get', async () => {
    const { data } = await axios.get(`${host}/api/get`)
    expect(data).toBe('get')
  })

  test('Get /api/some', async () => {
    expect.assertions(1)
    try {
      await axios.get(`${host}/api/some`)
    } catch (error) {
      expect(error.response.status).toBe(404)
    }
  })

  test('Get /api/403', async () => {
    expect.assertions(1)
    try {
      await axios.get(`${host}/api/403`)
    } catch (error) {
      expect(error.response.status).toBe(403)
    }
  })
})

afterAll(() => close?.())