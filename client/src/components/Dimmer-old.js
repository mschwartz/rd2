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
  chevron: {
    margin:    0,
    padding:   0,
    textAlign: 'center',
    fontSize:  10,
  },
};

/**
 * Dimmer Component
 *
 * A number is displayed in the cneter of this component.  If the user clicks or
 * taps above the center Y of the component, the number is incremented, and if
 * the user clicks or taps below the center Y, the number is decremented.
 *
 * Both mouse and touch events need to be processed.
 *
 * Mouse Events
 * ============
 * On mousedown, we can determine if the increment or decrement is to be
 * performed by the offsetY in the native event.  We then use a timer to handle
 * the initial 1 second delay before doing a setInterval() to handle repeat
 * while pressing.
 *
 * The mouseup event is tricky to handle.  It is fired over whatever target
 * element the mouse happens to be over when the mouse button is released.  So
 * if the mousedown occurs on our Dimmer and the mouse is moved outside it and
 * then the mouse is released, we will NOT get the mouseup event by listening on
 * our component.  Instead, we install a mouseup event handler on the document
 * and treat ANY mouseup event it handles as a mouseup over our component.
 *
 * We only install the document handler while mouse is down, and we assure it's
 * not installed when the component is removed from the DOM.
 *
 * Touch Events
 * ============
 * Touch events are a bit more tricky because long press on touch screens and
 * mobile devices can trigger a contextmenu event.  We need to override this,
 * perhaps in your index.js, nearly the first thing:
 * ```javascript
 * document.addEventListener('contextmenu', (e) => e.preventDefault(), false);
 * ```
 * If you need contextmenu functionality, you may want to enhance the event
 * handler for the contextmenu event beyond simply calling preventDefault().
 */
export default class Dimmer extends Component {
  get icon() {
    return this.props.icon ? <Glyphicon glyph={this.props.icon}/> : '';
  }
  constructor(props) {
    super();
    this.title = props.title || '';
    this.increment = props.increment || 1;
    this.decrement = props.decrement || -1;
    this.minValue = props.minValue || 0;
    this.maxValue = props.maxValue || 100;
    this.initialDelay = props.initialDelay || 1000;
    this.initialRepeat = props.initialRepeat || 250;
    this.acceleration = props.acceleration || 4;
    this.accelerationAmount = props.accelerationAmount || 10;
    this.minRepeat = props.minRepeat || 50;

    this.state = {
      pressed: false,
      value:   props.value || 0,
      on:      props.on || false
    };

    // handles for setTimeout and setInterval
    this.timeout = null;
    this.interval = null;

    // Mouse Event Handling
    this.mouseDown = false;
    this.eventHandlerInstalled = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // Touch Event Handling
    this.touchDown = false;
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    // Handlers for repeat while holding press
    this.handleStartRepeat = this.handleStartRepeat.bind(this);
    this.handleRepeat = this.handleRepeat.bind(this);
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
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
  }

  /**
   * componentWillUnMount()
   *
   * Assure everything is cleaned up.
   */
  componentWillUnmount() {
    this.cleanup();
  }

  /**
   * render()
   *
   * Render the component.
   */
  render() {
    const state = this.state,
          value = state.value,
          on = state.on,
          cstyle = Object.assign({}, style.frame, (state.pressed ? style.pressed : {}), (on ? style.on : {}));

    return (
      <div 
        style={{...cstyle, ...this.props.style}}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart ={this.handleTouchStart}
        onTouchEnd ={this.handleTouchEnd}
        onTouchCancel ={this.handleTouchEnd}
      >
        <div 
          style={style.icon}
        >
          {this.icon}
        </div>
        <div 
          style={style.value}
          onMouseDown={(e) => {
            this.setState({ on: !this.state.on });
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            this.setState({ on: !this.state.on });
            e.stopPropagation();
          }}
        >
          {value}
        </div>
        <div 
          style={style.title}
        >
          {this.title}
        </div>
      </div>
    );
  }

  /**
   * changeValue()
   *
   * Either increment or decrement state.value, depending on this.dir.
   * We use this.dir because sometimes changeValue() will be called while
   * long press/repeat - we want to repeat the increment/decrement each time.
   *
   * returns new value
   *
   * @private
   */
  changeValue() {
    const value = this.state.value,
          val = value + this.dir;
    if (val > this.maxValue || val < this.minValue) {
      return value;
    }
    return val;
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

  /**
   * handleMouseDown()
   *
   * Event handler for mousedown event.
   */
  handleMouseDown(e) {
    this.dir = e.nativeEvent.offsetY < 50 ? this.increment : this.decrement;
    this.mouseDown = true;
    this.eventListenerHandler(true);
    this.timeout = setTimeout(this.handleStartRepeat, this.initialDelay);
    this.setState({ pressed: true, value: this.changeValue() });
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * handleMouseUp()
   *
   * Event handler for mouseup event.
   */
  handleMouseUp(e) {
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
    const n = e.touches[0],
          y = n.clientY - n.target.offsetTop;

    this.dir = y < 50 ? this.increment : this.decrement;

    this.touchDown = true;
    this.timer = setTimeout(this.handleStartRepeat, this.initialDelay);
    this.setState({ pressed: true, value: this.changeValue() });
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

  handleStartRepeat() {
    if (!this.mouseDown && !this.touchDown) {
      this.cleanup();
      return;
    }
    this.acclerationCount = this.acceleration;
    this.repeatTime = this.initialRepeat;
    this.interval = setTimeout(this.handleRepeat, this.initialRepeat);
    this.setState({ value: this.changeValue() });
  }
  
  handleRepeat() {
    if (!this.mouseDown && !this.touchDown) {
      this.cleanup();
      return;
    }
    this.setState({ value: this.changeValue() });
    if (--this.accelerationCount) {
      return;
    }
    this.accelrationCount = this.acceleration;
    this.repeatTime -= this.accelerationAmount;
    if (this.repeatTime < this.minRepeat) {
      this.repeatTime = this.minRepeat;
    }
    this.interval = setTimeout(this.handleRepeat, this.repeatTime);
  }
}

Dimmer.propTypes = {
  title:              PropTypes.string,   // defaults to ''
  icon:               PropTypes.string,   // defaults to ''
  on:                 PropTypes.bool,     // defaults to false
  value:              PropTypes.number,   // defaults to 0
  minValue:           PropTypes.number,   // defaults to 0
  maxValue:           PropTypes.number,   // defaults to 100
  increment:          PropTypes.number,   // defaults to 1
  decrement:          PropTypes.number,   // defaults to -1,
  initialDelay:       PropTypes.number,   // defaults to 1000
  initalRepeat:       PropTypes.number,   // defaults to 250
  acceleration:       PropTypes.number,   // defaults to 4, every 4 repeats, repeat time decremented
  accelerationAmount: PropTypes.number,   // how much to speed up repeat each acceleration count, defaults to 10
  minRepeat:          PropTypes.number,   // minimum value for repeat interval, defaults to 50 (ms)
};
