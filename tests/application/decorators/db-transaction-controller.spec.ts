import { Controller } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'

class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async execute (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    try {
      await this.decoratee.execute(httpRequest)
      await this.db.commitTransaction()
      await this.db.closeTransaction()
    } catch {
      await this.db.rollbackTransaction()
      await this.db.closeTransaction()
    }
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  rollbackTransaction: () => Promise<void>
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

  it('should call rollback and close transaction on failure', async () => {
    decotatee.execute.mockRejectedValueOnce(new Error('decoratee_error'))
    await sut.execute({ any: 'any' })

    expect(db.rollbackTransaction).toHaveBeenCalledWith()
    expect(db.rollbackTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
})
