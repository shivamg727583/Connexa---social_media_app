// import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import "./index.css";

import store from "./redux/store";
import { persistStore } from "redux-persist";
import { Toaster } from "./components/ui/sonner";

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
