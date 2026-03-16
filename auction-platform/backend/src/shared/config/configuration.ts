export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'auction-platform-backend',
    env: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3002),
    corsOrigin:
      process.env.CORS_ORIGIN ??
      'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-prod',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  },
  database: {
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
    mongodbDbName: process.env.MONGODB_DB_NAME ?? 'auction_platform',
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  agora: {
    appId: process.env.AGORA_APP_ID ?? '',
    appCertificate: process.env.AGORA_APP_CERTIFICATE ?? '',
  },
  payments: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
    iyzicoApiKey: process.env.IYZICO_API_KEY ?? '',
  },
});
