import React from "react"
import PropTypes from "prop-types"
import Pagination from "react-bootstrap/Pagination"
import styles from "./Pagination.module.css"

export default function PaginationWrapper({ currentPage, totalPages, page }) {
  const items = []
  let prevPage = 1
  let nextPage = totalPages
  let pagesStart = 1
  let pagesEnd = 10

  if (currentPage > 1) {
    prevPage = currentPage - 1
  }
  if (currentPage < totalPages) {
    nextPage = currentPage + 1
  }

  if (currentPage > 5) {
    pagesStart = currentPage - 4
    pagesEnd = currentPage + 5
  }
  if (pagesEnd > totalPages) {
    pagesEnd = totalPages
  }

  for (let number = pagesStart; number <= pagesEnd; number += 1) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage} href={`${page}?page=${number}`}>
        {number}
      </Pagination.Item>,
    )
  }

  return (
    <div className={styles.pagination_wrapper}>
      <Pagination>
        <Pagination.First href={`${page}?page=1`} />
        <Pagination.Prev href={`${page}?page=${prevPage}`} />
        <Pagination.Ellipsis />
        {items}
        <Pagination.Ellipsis />
        <Pagination.Next href={`${page}?page=${nextPage}`} />
        <Pagination.Last href={`${page}?page=${totalPages}`} />
      </Pagination>
    </div>
  )
}

PaginationWrapper.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  page: PropTypes.string,
}
