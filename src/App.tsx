import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import RouterConfig from "./RouterConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./styles.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
