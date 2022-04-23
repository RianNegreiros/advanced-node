import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/usecases'
import { LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '../contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      await this.crypto.generateToken({ key: id })
    }
    return new AuthenticationError()
  }
}
