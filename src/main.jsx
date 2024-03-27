import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import theme from "./colors.jsx";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </BrowserRouter>,
);
