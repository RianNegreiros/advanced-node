import { SavePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
