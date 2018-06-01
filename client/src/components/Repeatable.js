import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Repeatable extends Component {
  constructor(props) {
    super();
    this.initialDelay = props.initialDelay || 1000;
    this.initialRepeat = props.initialRepeat || 250;
    this.acceleration = props.acceleration || 4;
    this.accelerationAmount = props.accelerationAmount || 10;
    this.minRepeat = props.minRepeat || 50;

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
    this.mouseDown = true;
    this.eventListenerHandler(true);
    this.props.onMouseDown && this.props.onMouseDown();
    this.timeout = setTimeout(this.handleStartRepeat, this.initialDelay);
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
    this.props.onEnd && this.props.onEnd();
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
    this.timer = setTimeout(this.handleStartRepeat, this.initialDelay);
    this.props.onMouseDown && this.props.onMouseDown();
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
  }

  handleTouchEnd(e) {
    this.cleanup();
    this.props.onEnd && this.props.onEnd();
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
  }
  
  handleRepeat() {
    if (!this.mouseDown && !this.touchDown) {
      this.cleanup();
      return;
    }
    this.props.onRepeat && this.props.onRepeat();
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

  render() {
    return (
      <div 
        style={this.props.style}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart ={this.handleTouchStart}
        onTouchEnd ={this.handleTouchEnd}
        onTouchCancel ={this.handleTouchEnd}
      >
        {this.props.children}
      </div>
    );
  }
}

Repeatable.propTypes = {
  children:           PropTypes.node,
  initialDelay:       PropTypes.number,   // defaults to 1000
  initalRepeat:       PropTypes.number,   // defaults to 250
  acceleration:       PropTypes.number,   // defaults to 4, every 4 repeats, repeat time decremented
  accelerationAmount: PropTypes.number,   // how much to speed up repeat each acceleration count, defaults to 10
  minRepeat:          PropTypes.number,   // minimum value for repeat interval, defaults to 50 (ms)
  onRepeat:           PropTypes.func, // method to call when element is pressed and held
  onPress:            PropTypes.func, // method to call when element is pressed and released
  onMouseDown:        PropTypes.func, // method to call when element is pressed and released
  onEnd:              PropTypes.func, // method to call when mouse/tap is released
};
