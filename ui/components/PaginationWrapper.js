import React from "react"
import PropTypes from "prop-types"
import Pagination from "react-bootstrap/Pagination"
import styles from "./Pagination.module.css"

export default function PaginationWrapper({ currentPage, totalPages, cbFunc }) {
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
      <span
        onClick={() => {
          cbFunc(number)
        }}
      >
        <Pagination.Item key={number} active={number === currentPage} href="#">
          {number}
        </Pagination.Item>
      </span>,
    )
  }

  return (
    <div className={styles.pagination_wrapper}>
      <Pagination>
        <span
          onClick={() => {
            cbFunc(1)
          }}
        >
          <Pagination.First href="#" key="p_first" />
        </span>
        <span
          onClick={() => {
            cbFunc(prevPage)
          }}
        >
          <Pagination.Prev href="#" key="p_prev" />
        </span>
        <Pagination.Ellipsis />
        {items}
        <Pagination.Ellipsis />

        <span
          onClick={() => {
            cbFunc(nextPage)
          }}
        >
          <Pagination.Next href="#" key="p_next" />
        </span>

        <span
          onClick={() => {
            cbFunc(totalPages)
          }}
        >
          <Pagination.Last href="#" key="p_last" />
        </span>
      </Pagination>
    </div>
  )
}

PaginationWrapper.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  cbFunc: PropTypes.func,
}
