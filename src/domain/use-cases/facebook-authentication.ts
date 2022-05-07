import { AuthenticationError, AccessToken, FacebookAccount } from '@/domain/entities'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repos'

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, token) => async params => {
  const fbData = await facebook.loadUser(params)
  if (fbData === undefined) throw new AuthenticationError()
  const accountData = await userAccountRepo.load({ email: fbData.email })
  const fbAccount = new FacebookAccount(fbData, accountData)
  const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
  const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
