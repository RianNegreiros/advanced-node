import 'dotenv/config'

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY ?? '',
    secret: process.env.S3_SECRET ?? '',
    bucket: process.env.S3_BUCKET ?? ''
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'a0d0elj8kp'
}
