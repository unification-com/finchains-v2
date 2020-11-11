import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"

export default class PairSelect extends React.Component {
  constructor(props) {
    super(props)

    this.handleBaseChange = this.handleBaseChange.bind(this)
    this.handleTargetChange = this.handleTargetChange.bind(this)
    this.fetchTargets = this.fetchTargets.bind(this)

    const { currentBase, bases, currentTarget, targets } = this.props

    this.state = {
      currentBase,
      bases,
      currentTarget,
      targets,
    }
  }

  async fetchTargets() {
    const { currentBase } = this.state
    const targetsApiUrl = `/api/pairs/${currentBase}`
    const targets = ["Select..."]
    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      const targetsJson = await targetsDataRes.json()
      for (let i = 0; i < targetsJson.results.length; i += 1) {
        targets.push(targetsJson.results[i])
      }
    }

    this.setState({ targets, currentTarget: targets[0] })
  }

  handleBaseChange(event) {
    const currentBase = event.target.value
    this.setState({ currentBase, currentTarget: ["Loading..."] })
    this.fetchTargets()
  }

  handleTargetChange(event) {
    const { url } = this.props

    const { currentBase } = this.state
    const currentTarget = event.target.value
    this.setState({ currentTarget })
    window.location = `${url}${currentBase}/${currentTarget}`
  }

  render() {
    const { currentBase, bases, currentTarget, targets } = this.state

    const baseOptions = bases.map((v) => (
      <option key={`B_${v}`} value={v}>
        {v}
      </option>
    ))

    const targetOptions = targets.map((v) => (
      <option key={`T_${v}`} value={v}>
        {v}
      </option>
    ))

    return (
      <>
        <label>Pair:</label>
        <select value={currentBase} onChange={this.handleBaseChange}>
          {baseOptions}
        </select>
        {" / "}
        <select value={currentTarget} onChange={this.handleTargetChange}>
          {targetOptions}
        </select>
      </>
    )
  }
}

PairSelect.propTypes = {
  currentBase: PropTypes.string,
  bases: PropTypes.array,
  currentTarget: PropTypes.string,
  targets: PropTypes.array,
  url: PropTypes.string,
}
