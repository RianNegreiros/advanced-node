import { DeletePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '../use-cases'

export const makeDeletePictureController = (): DeletePictureController => {
  return new DeletePictureController(makeChangeProfilePicture())
}
