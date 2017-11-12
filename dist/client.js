import React from 'react';
import ReactDOM from 'react-dom';
import element from './sandbox-element';

ReactDOM.render(
  React.createElement('div', { className: 'sandbox' }, element),
  document.getElementById('app')
);
