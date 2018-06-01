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
    fontSize:       30,
  },
  pressed: {
    border:   '3px inset',
    fontSize: 30,
  },
  on: {
    //    backgroundColor: 'yellow',
    color: 'yellow'
  },
  title: {
    marginBottom:  8,
    width:         '100%',
    textAlign:     'center',
    verticalAlign: 'middle',
    fontSize:      16,
    flex:          .25,
  },
  icon: {
    paddingTop:    8,
    width:         '100%',
    textAlign:     'center',
    verticalAlign: 'bottom',
    fontSize:      20,
    flex:          .25,
  },
  value: {
    width:         '100%',
    textAlign:     'center',
    verticalAlign: 'middle',
    margin:        0,
    padding:       0,
    flex:          .5,
  },
};

const clamp = (val, min, max) => {
  if (val < min) {
    return min;
  }
  else if (val > max) {
    return max;
  }
  else {
    return val;
  }
};
const values = [ 'Low', 'Medium', 'High' ];
export default class Fan extends Component {
  get icon() {
    return this.props.icon ? <div className={'glyphicon glyphicon-' + this.props.icon}/> : '';
  }
  constructor(props) {
    super();
    this.title = props.title || '';

    this.handleUp = this.handleUp.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      pressed: false,
      value:   props.value || 0
    };
  }

  render() {
    const state = this.state,
          value = state.value,
          on = state.on,
          cstyle = Object.assign({}, style.frame, (state.pressed ? style.pressed : {}), (on ? style.on : {}));

    return (
      <div 
        style={{...cstyle, ...this.props.style}}
      >
        <div 
          style={style.icon}
          onMouseDown={this.handleUp}
        >
          {this.icon}
        </div>
        <div 
          style={style.value}
          onMouseDown={this.handleToggle}
        >
          {values[value]}
        </div>
        <div 
          style={style.title}
          onMouseDown={this.handleDown}
        >
          {this.title}
        </div>
      </div>
    );
  }

  handleUp(e) {
    console.log('handle up', e.nativeEvent);
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    const newValue = clamp(this.state.value + 1, 0, 2);
    this.setState({ pressed: true, value: newValue});
    return false;
  }
  handleDown(e) {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    const newValue = clamp(this.state.value - 1, 0, 2);
    this.setState({ pressed: true, value: newValue});
    return false;
  }
  handleToggle(e) {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    this.setState({ on: !this.state.on });
    console.log('handle toggle', this.state.on);
    return false;
  }

}
Fan.propTypes = {
  style: PropTypes.string,    // defaults to null
  title: PropTypes.string,    // defaults to ''
  icon:  PropTypes.string,    // defaults to ''
  value: PropTypes.bool,      // defaults to false
};
