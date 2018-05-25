import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.addEventListener('contextmenu', (e) => e.preventDefault(), false);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
