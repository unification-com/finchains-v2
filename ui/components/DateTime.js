import React from "react"
import PropTypes from "prop-types"

export default function DateTime({ datetime, withTime }) {
  let formatted = ""
  if (datetime) {
    if (withTime) {
      formatted = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(datetime * 1000))
    } else {
      formatted = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(datetime * 1000))
    }
  }
  return <span>{formatted}</span>
}

DateTime.propTypes = {
  datetime: PropTypes.number.isRequired,
  withTime: PropTypes.bool,
}
