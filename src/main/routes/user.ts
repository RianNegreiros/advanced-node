import { auth } from '@/main/middlewares'
import { adaptExpressRoute, adaptMulter } from '@/main/adapters'
import { makeSavePictureController } from '@/main/factories/application/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adaptExpressRoute(makeSavePictureController()))
  router.put('/users/picture', auth, adaptMulter, adaptExpressRoute(makeSavePictureController()))
}
