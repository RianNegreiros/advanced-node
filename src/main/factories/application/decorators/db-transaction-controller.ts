import { DbTransactionController } from '@/application/contracts'
import { Controller } from '@/application/controllers'
import { PgConnection } from '@/infra/repos/postgres/helpers'

export const makePgTransactionController = (controller: Controller): DbTransactionController => {
  return new DbTransactionController(controller, PgConnection.getInstance())
}
