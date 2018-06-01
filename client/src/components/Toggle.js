import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const style = {
  frame: {
    width:          128,
    height:         128,
    border:         '3px outset',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       40,
  },
  pressed: {
    border:   '3px inset',
    fontSize: 40,
  },
  on: {
    //    backgroundColor: 'yellow',
    color: 'yellow'
  },
  title: {
    fontSize: 16,
    flex:     .5
  },
  icon: {
    fontSize: 16,
    flex:     .5
  },
  value: {
    width:     '100%',
    textAlign: 'center',
    margin:    0,
    padding:   0,
    flex:      1
  },
};

export default class Toggle extends Component {
  get icon() {
    return this.props.icon ? <Glyphicon glyph={this.props.icon}/> : '';
  }
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
    return (
      <div 
        style={{...cstyle, ...this.props.style}}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart ={this.handleMouseDown}
        onTouchEnd ={this.handleMouseUp}
        onTouchCancel ={this.handleMouseUp}
      >
        <div style={style.title}>{this.title}</div>
        {value ? 'ON' : 'OFF'}
        <div style={style.icon}>
          {this.icon}
        </div>
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
  style: PropTypes.string,    // defaults to null
  title: PropTypes.string,    // defaults to ''
  icon:  PropTypes.string,    // defaults to ''
  value: PropTypes.bool,      // defaults to false
};
