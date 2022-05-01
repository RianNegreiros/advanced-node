export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '706295394152110',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '848b8f621f9a558089196fa023324079'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'a0d0elj8kp'
}
