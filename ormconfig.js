module.exports = {
  type: 'postgres',
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  username: process.env.BD_USERNAME,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  entities: [
    `${process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'}/infra/repos/postgres/entities/index.{js,ts}`
  ]
}
