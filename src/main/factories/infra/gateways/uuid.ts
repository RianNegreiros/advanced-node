import { UUIDHandler } from '@/infra/gateways'

export const makeUUIDHandler = (): UUIDHandler => {
  return new UUIDHandler()
}
