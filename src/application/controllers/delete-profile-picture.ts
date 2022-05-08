import { HttpResponse, noContent } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

export class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async execute ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId })
    return noContent()
  }
}
