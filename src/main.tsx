import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CategoryProvider } from "./context/CategoryContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CategoryProvider>
      <App />
    </CategoryProvider>
  </React.StrictMode>
);
