import { Controller } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'

class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async execute (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.execute(httpRequest)
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decotatee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeEach(() => {
    db = mock()
    decotatee = mock()
    sut = new DbTransactionController(decotatee, db)
  })

  it('should open transaction', async () => {
    await sut.execute({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should execute decotatee', async () => {
    await sut.execute({ any: 'any' })

    expect(decotatee.execute).toHaveBeenCalledWith({ any: 'any' })
    expect(decotatee.execute).toHaveBeenCalledTimes(1)
  })
})
