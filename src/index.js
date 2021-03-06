import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "semantic-ui-css/semantic.min.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
  <Auth0Provider
    domain={`${process.env.REACT_APP_DOMAIN}`}
    clientId={`${process.env.REACT_APP_CLIENT_ID}`}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>,
  document.getElementById("root"),
  console.log(process.env.REACT_APP_CLIENT_ID)
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
