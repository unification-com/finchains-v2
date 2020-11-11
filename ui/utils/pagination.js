const getPagination = (page, size) => {
  const limit = size ? +size : 20
  const offset = page > 0 ? (page - 1) * limit : 0

  return { limit, offset }
}

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: results } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, results, totalPages, currentPage }
}

module.exports = {
  getPagination,
  getPagingData,
}
