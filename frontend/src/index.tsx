import React from "react";
import ReactDOM from "react-dom";
import { SWRConfig } from "swr";
import { zooniverseApi} from "zooApi";
import zooTheme from "@zooniverse/grommet-theme";
import { Grommet } from "grommet";

import reportWebVitals from "./reportWebVitals";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 3000,
        // @ts-ignore
        zooniverseApi,
      }}
    >
      <Grommet theme={zooTheme}>
        <App />
      </Grommet>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
