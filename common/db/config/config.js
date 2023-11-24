require("dotenv").config()

const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT } = process.env

const config = {
  development: {
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT || 5432,
    dialect: "postgres",
    username: DB_USER,
    password: DB_PASS,
  },
  test: {
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT || 5432,
    dialect: "postgres",
    username: DB_USER,
    password: DB_PASS,
  },
  production: {
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT || 5432,
    dialect: "postgres",
    username: DB_USER,
    password: DB_PASS,
  },
}

module.exports = config
