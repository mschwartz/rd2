import React, { Component } from 'react';

import Toggle from './components/Toggle';
import Dimmer from './components/Dimmer';

import 'bootswatch/dist/slate/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Dimmer title="one"/>
        <Dimmer title="two" />
        <Dimmer title="three"/>
        <Toggle title="four"/>
      </div>
    );
  }
}

export default App;
