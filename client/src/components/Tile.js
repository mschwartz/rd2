import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Repeatable from './Repeatable';

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

export default class Tile extends Component {
  get icon() {
    return this.props.icon ? <div className={'glyphicon glyphicon-' + this.props.icon}/> : '';
  }

  // child class should override this
  get value() {
    return this.state.value;
  }

  constructor(props) {
    super(props);
    this.title = props.title || '';

    this.initialDelay = props.initialDelay || 1000;
    this.initialRepeat = props.initialRepeat || 250;
    this.acceleration = props.acceleration || 4;
    this.accelerationAmount = props.accelerationAmount || 10;
    this.minRepeat = props.minRepeat || 50;

    this.state = {
      on:      props.on || false,
      pressed: false,
      value:   props.value || 0
    };

    this.handleUpPressed = this.handleUpPressed.bind(this);
    this.handleTogglePressed = this.handleTogglePressed.bind(this);
    this.handleDownPressed = this.handleDownPressed.bind(this);
    this.handleReleased = this.handleReleased.bind(this);
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

  render() {
    const state = this.state,
          props = this.props,
          value = this.value,
          on = state.on,
          cstyle = Object.assign({}, style.frame, (state.pressed ? style.pressed : {}), (on ? style.on : {}));

    console.log('value', value);
    this.initialDelay = props.initialDelay || 1000;
    this.initialRepeat = props.initialRepeat || 250;
    this.acceleration = props.acceleration || 4;
    this.accelerationAmount = props.accelerationAmount || 10;
    this.minRepeat = props.minRepeat || 50;
    return (
      <div 
        style={{...cstyle, ...this.props.style}}
      >
        <Repeatable
          style={style.title}
          onMouseDown={this.handleUpPressed}
          onRepeat={this.handleUpPressed}
          onEnd={this.handleReleased}
        >
          {this.title}
        </Repeatable>
        <Repeatable 
          style={style.value}
          onMouseDown={this.handleTogglePressed}
          onRepeat={this.handlelePressedValuePressed}
          onEnd={this.handleReleased}
        >
          {this.value}
        </Repeatable>
        <Repeatable 
          style={style.icon}
          onMouseDown={this.handleDownPressed}
          onRepeat ={this.handleDownPressed}
          onEnd={this.handleReleased}
        >
          {this.icon}
        </Repeatable>
      </div>
    );
  }
  handleUpPressed() {
    this.setState({ pressed: true });
    this.onUp && this.onUp();
  }
  handleTogglePressed() {
    this.setState({ on: !this.state.on, pressed: true });
    this.onToggle && this.onToggleUp();
  }
  handleDownPressed() {
    this.setState({ pressed: true });
    this.onDown && this.onDown();
  }
  handleReleased() {
    this.setState({ pressed: false });
    this.onEnd && this.onEnd();
  }
}
Tile.propTypes = {
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
  onUp:               PropTypes.func,
  onToggle:           PropTypes.func,
  onDown:             PropTypes.func,
  onEnd:              PropTypes.func
};
