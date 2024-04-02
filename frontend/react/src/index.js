import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import "./styles/main.css";
import "./styles/core.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserContextProvider>
        <App />
    </UserContextProvider>
);
