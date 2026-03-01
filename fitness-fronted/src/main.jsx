import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  palette: {
    primary: { main: "#0072ff" },
    secondary: { main: "#00c6ff" },
  },
  shape: {
    borderRadius: 14,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider authConfig={authConfig}>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>

    </ThemeProvider>
  </React.StrictMode>
);