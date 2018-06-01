import React, { Component } from 'react';

import Toggle from './components/Toggle';
import Dimmer from './components/Dimmer';
import Fan from './components/Fan';
import Repeatable from './components/Repeatable';

import 'bootswatch/dist/slate/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Repeatable
          style={{height: 128, width: 128, border: '1px solid white'}}
          onRepeat={() => { console.log('repeat'); }}
          onPress={() => { console.log('press'); }}
        >
          {'text'}
        </Repeatable>
        <Fan title="Ceiling Fan" icon="flash" />
        <Dimmer title="two" icon="flash"/>
        <Dimmer title="three"/>
        <Toggle title="Toggle" icon = "check"/>
      </div>
    );
  }
}

export default App;
