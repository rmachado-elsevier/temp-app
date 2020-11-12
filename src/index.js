import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const AppComposer = React.memo(({ config }) => {
  return (
    <app-composer name="my-data" config={JSON.stringify(config)}></app-composer>
  );
});
AppComposer.displayName = "AppComposer";

document.currentScript.loadFragment((domElement, config) => {
  return ReactDOM.render(
    <React.StrictMode>
      <AppComposer config={config} />
    </React.StrictMode>,
    domElement,
    () => {
      window.unmountTempApp = () => ReactDOM.unmountComponentAtNode(domElement);
    }
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
