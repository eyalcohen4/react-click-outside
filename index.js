import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ClickOutside extends Component {
  static propTypes = {
    onClickOutside: PropTypes.func.isRequired,
    ignored: PropTypes.array
  }

  static defaultProps = {
    ignored: []
  }

  constructor(props) {
    super(props)
    this.getContainer = this.getContainer.bind(this)
    this.isTouch = false
  }

  getContainer(ref) {
    this.container = ref
  }

  render() {
    const { children, onClickOutside, ...props } = this.props
    return <div {...props} ref={this.getContainer}>{children}</div>
  }

  componentDidMount() {
    document.addEventListener('touchend', this.handle, true)
    document.addEventListener('click', this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handle, true)
    document.removeEventListener('click', this.handle, true)
  }

  handle = e => {
    if (e.type === 'touchend') this.isTouch = true
    if (e.type === 'click' && this.isTouch) return
    const { onClickOutside } = this.props
    const el = this.container
    if (el && !el.contains(e.target) && !this.isClickedIgnoredElements(e.target)) onClickOutside(e)
  }

  isClickedIgnoredElements = clicked => {
    const { ignore } = this.props;

    if (!ignore || (ignore && !ignore.length)) {
      return;
    }

    return ignore
      .map(el => clicked.isEqualNode(document.querySelector(el)))
      .some(boolean => boolean === true);
  };
}
