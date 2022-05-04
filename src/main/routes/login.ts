import { adaptExpressRoute } from '@/main/adapters'
import { makeFacebookLoginController } from '@/main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/login/facebook', adaptExpressRoute(makeFacebookLoginController()))
}
