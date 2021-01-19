require("dotenv").config()

const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env

const config = {
  development: {
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    username: DB_USER,
    password: DB_PASS,
  },
  test: {
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
  },
  production: {
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
  },
}

module.exports = config
