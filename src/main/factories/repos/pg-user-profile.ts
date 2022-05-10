import { PgUserProfileRepository } from '@/infra/repos'

export const makePgUserProfileRepo = (): PgUserProfileRepository => {
  return new PgUserProfileRepository()
}
