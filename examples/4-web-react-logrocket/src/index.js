import React from 'react';
import { render } from 'react-dom';
import dlog from '../dlogger';

const rootElement = document.getElementById('react-app');

const App = props => {
  dlog.log({ App: { a: 99, props } });
  return <div>App</div>;
};

render(
  <div>
    <App />
  </div>,
  rootElement
);
