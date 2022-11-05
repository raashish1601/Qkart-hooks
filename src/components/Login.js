import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [log, setLog] = useState(false);

  let formData = {
    username: name,
    password: pass
  };

  const login = async (formData, e) => {
    e.preventDefault();
    setLog(true);

    if (validateInput(formData) === true) {
      console.log("hello");
      await axios
        .post(`${config.endpoint}/auth/login`, formData)
        .then((response) => {
          if (response.status >= 200 && response.status < 400) {
            //console.log(response)
            setLog(false);

            enqueueSnackbar("Logged in successfully");
            const { token, username, balance } = response.data;
            persistLogin(token, username, balance);
            history.push("/", { from: "Login" });
          }
        })

        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            //console.log(error.response)
            enqueueSnackbar(error.response.data.message);
            setLog(false);
          } else {
            enqueueSnackbar(
              "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
            );
          }
        });
    } else {
      setLog(false);
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field");
      return false;
    } else if (data.password === "") {
      enqueueSnackbar("Password is a required field");
      return false;
    } else {
      return true;
    }
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons="false" />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            title="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            placeholder="Enter a password with minimum 6 characters"
            fullWidth
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          {!log && (
            <Button
              className="button"
              variant="contained"
              onClick={(e) => {
                login(formData, e);
              }}
            >
              LOGIN TO QKART
            </Button>
          )}
          <box className="loadingg">{log && <CircularProgress />}</box>
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
