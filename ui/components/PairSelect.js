import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"

export default class PairSelect extends React.Component {
  constructor(props) {
    super(props)

    this.handleBaseChange = this.handleBaseChange.bind(this)
    this.handleTargetChange = this.handleTargetChange.bind(this)
    this.fetchTargets = this.fetchTargets.bind(this)

    const { currentBase, bases, currentTarget, targets, exchange } = this.props

    this.state = {
      currentBase,
      bases,
      currentTarget,
      targets,
      exchange,
    }
  }

  async fetchTargets(currentBase) {
    const { exchange } = this.state
    let targetsApiUrl = ""
    if (exchange) {
      targetsApiUrl = `/api/exchange/${exchange}/${currentBase}/targets`
    } else {
      targetsApiUrl = `/api/pairs/${currentBase}`
    }

    const targets = []
    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      const targetsJson = await targetsDataRes.json()
      for (let i = 0; i < targetsJson.length; i += 1) {
        targets.push(targetsJson[i])
      }
    }

    this.setState({ targets, currentTarget: targets[0] })
  }

  async handleBaseChange(event) {
    const currentBase = event.target.value
    this.setState({ currentBase, targets: ["Loading..."] })
    await this.fetchTargets(currentBase)
  }

  async handleTargetChange(event) {
    const { url } = this.props

    const { currentBase } = this.state
    const currentTarget = event.target.value
    await this.setState({ currentTarget })
    window.location = `${url}${currentBase}/${currentTarget}`
  }

  render() {
    const { currentBase, bases, currentTarget, targets } = this.state
    const { showLabel } = this.props

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
        {(showLabel && <label>Pair:</label>)}
        <select value={currentBase} onChange={this.handleBaseChange} className={"select-css"}>
          {baseOptions}
        </select>
        {" / "}
        <select value={currentTarget} onChange={this.handleTargetChange} className={"select-css"}>
          <option key={`t_select_default`} value={targets[0]}>
            Select...
          </option>
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
  exchange: PropTypes.string,
  showLabel: PropTypes.bool,
}
