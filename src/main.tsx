import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import { CategoryProvider } from "./context/CategoryProvider";
import { AuthProvider } from "./context/AuthProvider";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 1. Provider (Redux) */}
    <Provider store={store}>
      {/* 2. AuthProvider */}
      <AuthProvider>
        {/* 3. CategoryProvider */}
        <CategoryProvider>
          {/* 4. App */}
          <App />
        </CategoryProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);