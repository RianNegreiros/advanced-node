import './config/module-alias'
import 'reflect-metadata'

import { env } from './config/env'
import { createConnection, getConnectionOptions } from 'typeorm'

getConnectionOptions()
  .then(async options => {
    const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
    const entities = [`${root}/infra/repos/postgres/entities/index.{js,ts}`]
    await createConnection({ ...options, entities })
    const { app } = await import('@/main/config/app')
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  }).catch(console.error)
