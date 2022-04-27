import { AccessToken } from '@/domain/models'
import { FacebookAuthentication } from '@/domain/usecases'
import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'

type httpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: httpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: httpRequest): Error | undefined {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return new RequiredFieldError('token')
    }
  }
}
