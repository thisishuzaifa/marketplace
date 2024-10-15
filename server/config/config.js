require('dotenv').config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      seederStorage: 'sequelize',
  },
  test: {
      username: 'root',
      password: null,
      database: 'database_test',
      host: '127.0.0.1',
      dialect: 'mysql',
  },
  production: {
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASEE,
      host: process.env.POSTGRES_HOST,

      dialect: 'postgres',
  },
};