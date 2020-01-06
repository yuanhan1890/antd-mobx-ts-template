import ConfigProvider from "antd/es/config-provider";
import zhCN from "antd/es/locale/zh_CN";
import { enableLogging } from "mobx-logger";
import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { stores } from '@/stores';

import App from "./app";

if (process.env.NODE_ENV === "development") {
  enableLogging();
}

export default function runApp() {
  return ReactDOM.render((
    <ConfigProvider locale={zhCN}>
      <Provider {...stores}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  ), document.getElementById("root"));
}
