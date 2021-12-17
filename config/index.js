module.exports = {
  app: {
    host: 'localhost',
    websocketPort: 3101,
    url: process.env.APP_URL,
    port: process.env.APP_PORT,
    environment: process.env.NODE_ENV,
  },

  mongodbConf: {
    url: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`,
    options: {
      connectTimeoutMS: 30000,
    },
  },

  redisConf: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },

  tradingHelperConf: {
    url: 'trading-helper.ru',
    websocketPort: 3001,
    token: process.env.TRADING_HELPER_AUTH_TOKEN,
  },
};
