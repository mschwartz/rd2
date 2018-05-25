import React, {Component} from 'react';
import PropTypes from 'prop-types';

const style = {
  frame: {
    width:          100,
    height:         100,
    border:         '3px outset',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       30,
  },
  pressed: {
    border:   '3px inset',
    fontSize: 40,
  },
  on: {
    backgroundColor: 'yellow',
    color:           'black'
  },
  title: {
    fontSize: 14,
    flex:     .5
  },
  value: {
    margin:  0,
    padding: 0,
    flex:    1
  },
};

export default class Toggle extends Component {
  constructor(props) {
    super();
    this.title = props.title || '';

    this.mouseDown = false;
    this.eventHandlerInstalled = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.state = {
      pressed: false,
      value:   props.value || false
    };
  }

  /**
   * cleanup()
   *
   * Remove any event handlers and clear any timers that have been set.
   *
   * @private
   */
  cleanup() {
    this.eventListenerHandler(false);
  }

  /**
   * eventListenerHandler(add);
   *
   * Add (if add is true) or remove (otherwise) handleMouseUp handler for
   * mouseup event.
   *
   * Event handler will not be removed if it wasn't already installed.
   *
   * @private
   */
  eventListenerHandler(add) {
    if (add) {
      document.addEventListener('mouseup', this.handleMouseUp, false);
      this.eventHandlerInstalled = true;
    }
    else if (this.eventHandlerInstalled) {
      document.removeEventListener('mouseup', this.handleMouseUp, false);
      this.eventHandlerInstalled = false;
    }
  }

  render() {
    /*
     *    return (
     *      <div 
     *        style={state.pressed ? {...style.frame, ...style.pressed}: style.frame}
     *        onMouseDown={this.handleMouseDown}
     *        onMouseUp={this.handleMouseUp}
     *        onTouchStart ={this.handleTouchStart}
     *        onTouchEnd ={this.handleTouchEnd}
     *        onTouchCancel ={this.handleTouchEnd}
     *      >
     *        <div style={style.title}>{this.title}</div>
     *        {state.value ? 'ON' : 'OFF'}
     *        <div style={style.title} />
     *      </div>
     *    );
     */
    const state = this.state,
          value = state.value,
          cstyle = Object.assign({}, style.frame, (state.pressed ? style.pressed : {}), (value ? style.on : {}));

    /*
     *    if (value) {
     *      Object.assign(cstyle, state.on);
     *    }
     */
    console.log(value, cstyle);
    return (
      <div 
        style={cstyle}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart ={this.handleMouseDown}
        onTouchEnd ={this.handleMouseUp}
        onTouchCancel ={this.handleMouseUp}
      >
        <div style={style.title}>{this.title}</div>
        {value ? 'ON' : 'OFF'}
        <div style={style.title} />
      </div>
    );
  }

  /**
   * handleMouseDown()
   *
   * Event handler for mousedown event.
   */
  handleMouseDown(e) {
    this.mouseDown = true;
    this.eventListenerHandler(true);
    this.setState({ pressed: true, value: !this.state.value});
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * handleMouseUp()
   *
   * Event handler for mouseup event.
   */
  handleMouseUp(e) {
    this.mouseDown = false;
    this.cleanup();
    this.setState({ pressed: false });
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * handleTouchStart()
   *
   * Event handler for touchstart event.
   */
  handleTouchStart(e) {
    this.touchDown = true;
    this.setState({ pressed: true, value: !this.state.value });
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
  }

  handleTouchEnd(e) {
    this.cleanup();
    this.setState({ pressed: false });
    this.touchDown = false;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

}
Toggle.propTypes = {
  title: PropTypes.string,    // defaults to ''
  value: PropTypes.bool,      // defaults to false
};
