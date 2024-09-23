import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-0o6fpuzsivlewh2d.us.auth0.com"
    clientId="gCoa77PyZqdmsWnSODrxNVWIwQNRoCke"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
