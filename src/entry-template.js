module.exports = (props = {}) => {
  return `
import React from 'react';
import ReactDOM from 'react-dom';
import SandboxComponent from './sandbox-element';

ReactDOM.render(
  <div className="sandbox">
    <SandboxComponent {...${JSON.stringify(props)}}/>
  </div>,
  document.getElementById('app')
);`;
};
