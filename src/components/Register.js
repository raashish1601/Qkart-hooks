import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState(false);

  let formData = {
    username: name,
    password: pass
  };

  let data = {
    username: name,
    password: pass,
    confirmPassword: password
  };

  const register = async (formData, e, data) => {
    e.preventDefault();
    setLog(true);

    if (validateInput(data) === true) {
      console.log("hello");
      await axios
        .post(`${config.endpoint}/auth/register`, formData)
        .then((response) => {
          if (response.status >= 200 && response.status < 400) {
            console.log(response);
            setLog(false);
            enqueueSnackbar("Registered successfully");
            history.push("/login", { from: "Register" });
          }
        })

        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            console.log(error.response);
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
    console.log("callles");
    if (data.username === "") {
      enqueueSnackbar("Username is a required field");
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters");
      return false;
    } else if (data.password === "") {
      enqueueSnackbar("Password is a required field");
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters");
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match");
      return false;
    } else {
      return true;
    }
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth
          />
          {!log && (
            <Button
              className="button"
              variant="contained"
              onClick={(e) => {
                register(formData, e, data);
              }}
            >
              Register Now
            </Button>
          )}
          <box className="loadingg">{log && <CircularProgress />}</box>

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default Register;
