require("dotenv").config()
const fs = require("fs")
const path = require("path")

const subdirs = ["cex", "dex"]
const exclude = ["dexsubgraph.js", path.basename(__filename), "config.js"]

const exchangeApis = {}

for (let i = 0; i < subdirs.length; i += 1) {
  fs.readdirSync(`${__dirname}/${subdirs[i]}`)
    .filter((file) => {
      return file.indexOf(".") !== 0 && !exclude.includes(file) && file.slice(-3) === ".js"
    })
    .forEach((file) => {
      const api = require(path.join(__dirname, subdirs[i], file))
      const name = file.replace(file.slice(-3), "")
      exchangeApis[name] = api
    })
}

module.exports = {
  exchangeApis,
}
