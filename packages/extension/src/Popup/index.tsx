import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router} from 'react-router-dom';

import Popup from './Popup';
import './index.css';

render(
  <React.StrictMode>
      <Router>
        <Popup/>
      </Router>
  </React.StrictMode>,
  window.document.querySelector('#app-container')
);

if ((module as any).hot) (module as any).hot.accept();
