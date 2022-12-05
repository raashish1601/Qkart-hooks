import Register from "./components/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import { ThemeProvider } from "@mui/system";
import React from "react";
import theme from "./theme";
import Thanks from "./components/Thanks";
import Checkout from "./components/Checkout";
export const config = {
  endpoint: `https://raashish-qkart-backend.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      {/**/}
      <Switch>
        <ThemeProvider theme={theme}>
          <Route path="/" exact component={Products} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thanks" component={Thanks} />
        </ThemeProvider>
      </Switch>
    </div>
  );
}

export default App;
