import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import theme from "./colors.jsx";

import { Button, MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <App />
    <Button variant="filled">Button</Button>
  </MantineProvider>,
);
