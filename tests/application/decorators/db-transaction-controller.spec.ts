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
    await this.db.commitTransaction()
    await this.db.closeTransaction()
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commitTransaction: () => Promise<void>
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

  it('should call commit and close transaction on success', async () => {
    await sut.execute({ any: 'any' })

    expect(db.commitTransaction).toHaveBeenCalledWith()
    expect(db.commitTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
})
