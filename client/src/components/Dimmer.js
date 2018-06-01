import React from 'react';
import PropTypes from 'prop-types';

import Tile from './Tile';

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
export default class Dimmer extends Tile {
  constructor(props) {
    super(props);
    this.increment = props.increment || 1;
    this.decrement = props.decrement || -1;
    this.minValue = props.minValue || 0;
    this.maxValue = props.maxValue || 100;
    this.val = props.value || 0;

    this.onUp = this.handleUp.bind(this);
    this.onDown = this.handleDown.bind(this);
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
  changeValue(delta) {
    const value = this.state.value,
          val = value + delta;

    console.log('changeValue', val);
    if (val > this.maxValue || val < this.minValue) {
      return value;
    }
    return val;
  }

  handleUp() {
    this.setState({ value: this.changeValue(1)});
  }
  handleDown() {
    this.setState({ value: this.changeValue(-1)});
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
