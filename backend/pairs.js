const { Pairs } = require("../common/db/models")

const getOrAddPair = async (name) => {
  const baseTarget = name.split("/")
  return Pairs.findOrCreate({
    where: {
      name,
      base: baseTarget[0],
      target: baseTarget[1],
    },
  })
}

module.exports = {
  getOrAddPair,
}
