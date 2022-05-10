import { PgUserAccountRepository } from '@/infra/repos'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
