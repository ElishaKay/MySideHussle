import React, { Component } from "react";
import { Head, Content, getElapsedTime, callFn, getNewStyles, setStylesToElement, pickFromRect, findChildren, findChildrenOrIdentity, getLastPositionStyles, states, isActiveState, isClosingState, isOpenedState } from "../../helpers/modalStyling";


export default class Modal extends Component {
  static Head = Head
  static Content = Content

  static defaultProps = {
    timingfunction: 'easeInOutCubic'
  }

  state = {
    styles: {},
    state: states.IDLE
  }

  constructor(props) {
    super(props)

    this._open = this._open.bind(this)
    this._close = this._close.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createProps = this.createProps.bind(this)
    this.processCallback = this.processCallback.bind(this)
    this.closeDoneCallback = this.closeDoneCallback.bind(this)
    this.openDoneCallback = this.openDoneCallback.bind(this)

    this.clone = React.createRef()
    this.content = React.createRef()
  }
  _isMounted = false
  componentDidMount(){
    this._isMounted = true
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  animate({ from, to, loop, processCallback, doneCallBack }) {
    const elapsed = getElapsedTime(this.state.startDate)
    const progress = Math.min(elapsed / this.props.ms, 1)
    const styles = this.contentStyles
    
    const newStyles = getNewStyles({
      el: [ from, to ],
      progress,
      timingfunction: this.props.timingfunction
    })

    if (progress < 1) {
      callFn(processCallback, {
        styles,
        newStyles
      })

      requestAnimationFrame(loop)
    } else {
      callFn(doneCallBack, {
        styles,
        newStyles
      })
    }
  }

  processCallback({ styles, newStyles }) {
    setStylesToElement({
      ...newStyles,
      'max-width': `${newStyles.maxwidth}px`,
      height: `${newStyles.height}px`
    }, this.content.current)

    this.contentStyles = {
      ...styles,
      ...newStyles
    }
  }

  openDoneCallback({ styles, newStyles }) {
    if (this._isMounted){
      this.setState({
        state: states.OPENED,
        styles: {
          ...styles,
          ...newStyles,
          left: '50%',
          top: '50%',
          transform: 'translate3d(-50%, -50%, 0)'
        }
      })
    }
  }

  closeDoneCallback() {
    if (this._isMounted){
      this.setState({
        state: states.IDLE,
        styles: {},
        bodyStyles: {}
      })
    }
  }

  _open() {
    const { rect, state } = this.state

    if (state !== states.OPEN) return

    this.animate({
      from: rect,
      to: getLastPositionStyles(this.props),
      loop: this._open,
      processCallback: this.processCallback,
      doneCallBack: this.openDoneCallback
    })
  }

  _close() {
    const { cloneRect, rect } = this.state

    this.animate({
      from: rect,
      to: cloneRect,
      loop: this._close,
      processCallback: this.processCallback,
      doneCallBack: this.closeDoneCallback
    })
  }

  setStartData(state) {
    const startDate = performance.now()
    const cloneRect = pickFromRect(this.clone.current.getBoundingClientRect())
    const rect = pickFromRect(this.content.current.getBoundingClientRect())

    const styles = {
      maxwidth: rect.width,
      height: rect.height,
      top: 0,
      left: 0,
      transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`
    }

    this.contentStyles = styles
    this.setState({
      ...state,
      cloneRect,
      startDate,
      rect,
      styles
    })
  }

  open() {    
    if (this.state.state !== states.IDLE) return

    this.setStartData({ state: states.OPEN })

    requestAnimationFrame(this._open)
  }

  close() {
    if (this.state.state === states.IDLE) return

    this.setStartData({
      state: this.state.state === states.OPEN
        ? states.IMMEDIATELY_CLOSE
        : states.CLOSE
    })

    requestAnimationFrame(this._close)
  }

  createProps(Component, props) {
    return {
      ...Component.props,
      modal: {
        ...props,
        isOpen: isActiveState(this.state.state),
        close: this.close
      }
    }
  }

  renderClone() {
    const Head = findChildrenOrIdentity(Modal.Head, this.props.children)

    return Head && isActiveState(this.state.state)
      ? <Head.type {...this.createProps(Head)}/>
      : null
  }

  renderHead() {
    const Head = findChildrenOrIdentity(Modal.Head, this.props.children)

    return Head
      ? <Head.type {...this.createProps(Head, { original: true })}/>
      : null
  }

  renderContent() {
    const Content = findChildren(Modal.Content, this.props.children)

    return Content && isOpenedState(this.state.state)
      ? <Content.type {...this.createProps(Content)}/>
      : null
  }

  getBackgroundStyle() {
    return {
      transition: `opacity ${this.props.ms / 4}ms ease-in-out`
    }
  }

  getContentStyle() {
    return {
      ...this.state.styles,
      transition: `box-shadow ${this.props.ms}ms ease-in-out`
    }
  }

  getContaninerClassNames() {
    const { state } = this.state
    return [
      'transform-modal__container',
      isActiveState(state) ? 'transform-modal__container--open' : '',
      isClosingState(state) ? 'transform-modal__container--closing' : '' 
    ].join(' ')
  }

  render() {
    return (
      <div className='transform-modal' {...this.props}>
        <div ref={this.clone}>
          {this.renderClone()}
        </div>
        <div className={this.getContaninerClassNames()}>
          <div
            className='transform-modal__background'
            onClick={this.close}
            style={this.getBackgroundStyle()}
          />
          <div
            className='transform-modal__content'
            style={this.getContentStyle()}
            onClick={this.open}
            ref={this.content}
          >
            {this.renderHead()}      
            {this.renderContent()}
          </div>
        </div>
      </div>
    )
  }
}
