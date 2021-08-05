import * as React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';

import Demo from './components/Demo';
import LogoSection from './components/LogoSection';
import LinksSection from './components/LinksSection';

const rootElement = document.getElementById('root');


if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <header>
        <h1><a href="#">periqles</a></h1>
      </header>
      <LinksSection />
      <Demo />
    </React.StrictMode>,
    rootElement,
  );
}
