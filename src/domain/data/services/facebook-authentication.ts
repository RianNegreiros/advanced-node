import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/usecases'
import { LoadFacebookUserApi } from '../contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}
