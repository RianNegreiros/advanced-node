import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const { statusCode, data } = await middleware.handle({ ...req.headers })
  if (statusCode === 200) {
    req.locals = { ...req.locals, ...data }
    next()
  } else {
    res.status(statusCode).json(data)
  }
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeEach(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with correct error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: { error: 'any_error' }
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should add data to req.locals', async () => {
    await sut(req, res, next)

    expect(req.locals).toEqual({ data: 'any_data' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})