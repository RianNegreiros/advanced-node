import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/usecases'
import { LoadFacebookUserApi } from '../contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountREpo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      await this.userAccountREpo.load({ email: fbData.email })
      await this.userAccountREpo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
