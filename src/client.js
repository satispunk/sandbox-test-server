import React from 'react';
import ReactDOM from 'react-dom';
import element from 'sandbox-test-server/sandbox-element';

ReactDOM.render(
  <div className="sandbox">{element}</div>,
  document.getElementById('app')
);
