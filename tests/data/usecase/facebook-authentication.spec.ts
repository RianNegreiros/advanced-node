import { LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import { TokenGenerator } from '@/domain/data/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/data/contracts/repos'
import { FacebookAuthenticationService } from '@/domain/data/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({ id: 'any_account_id' })
    crypto = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    )
  })

  it('Should call facebookApi with correct params', async () => {
    await sut.execute({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when facebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should calls LoadUserAccountRepo when LoadfacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should calls SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({}))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.execute({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({})
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should calls TokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
