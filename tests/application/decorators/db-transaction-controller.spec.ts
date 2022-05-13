import { mock } from 'jest-mock-extended'

class DbTransactionController {
  constructor (private readonly db: DbTransaction) {}

  async execute (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
}

describe('DbTransactionController', () => {
  it('should open transaction', async () => {
    const db = mock<DbTransaction>()
    const sut = new DbTransactionController(db)

    await sut.execute({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
