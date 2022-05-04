import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from './controller'
import { FacebookAuthentication } from '@/domain/use-cases'

type httpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async execute ({ token }: httpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({ token })
      return ok(accessToken)
    } catch {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: httpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
