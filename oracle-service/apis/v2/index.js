require("dotenv").config()
const fs = require("fs")
const path = require("path")

const basename = path.basename(__filename)

const exchangeApis = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  })
  .forEach((file) => {
    const api = require(path.join(__dirname, file))
    const name = file.replace(file.slice(-3), "")
    exchangeApis[name] = api
  })

module.exports = {
  exchangeApis,
}
