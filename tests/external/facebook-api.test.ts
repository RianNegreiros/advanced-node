import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('Facebook Api  Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeAll(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    //  Token expires in 30/7
    const fbUser = await sut.loadUser({ token: 'EAAKCXzYTLq4BAItpFFd55vAURO6uYY2NaTkkWT4nLZCZCpXF2qaCccGSh4xZBYWTh5JT2y6VZBI5EfUZBINUJboskFVjGSPbzVcNFjN12ZCBP1P3wVGvzJxAGPdaPt21srR0ReI3lYw0fQiEjLfmHWyvKz3eBOEU8UeCcMIOr4DI9fcstr6E8ho2OFMlOyRIRgZBq1KPh9ZAfQZDZD' })

    expect(fbUser).toEqual({
      facebookId: '104629542244281',
      email: 'test_vjchyuu_user@tfbnw.net',
      name: 'Test User'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
