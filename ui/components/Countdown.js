import React from "react"

export default class Countdown extends React.Component {
  constructor(props) {
    super(props)
    this.getCountdown = this.getCountdown.bind(this)
    this.state = {
      counter: this.getCountdown(),
    }
  }

  componentDidMount() {
    this.handleStart()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleStart() {
    this.timer = setInterval(() => {
      this.setState({ counter: this.getCountdown() })
    }, 1000)
  }

  getCountdown() {
    const now = new Date()
    const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
    const diffInSeconds = Math.round((midnight - now.getTime()) / 1000)

    return new Date((diffInSeconds + 120) * 1000).toISOString().substr(11, 8)
  }

  render() {
    const { counter } = this.state
    return <span>{counter}</span>
  }
}
