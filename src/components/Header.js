import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import "./Products.css";
import { useHistory } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // console.log(children)
  // console.log(localStorage.length)

  let status = localStorage.getItem("username");
  const history = useHistory();

  if (localStorage.length === 0 && hasHiddenAuthButtons === "") {
    console.log("HI");
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}

        <Button
          className="explore-button"
          variant="text"
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </Button>

        <Button
          className="explore-button"
          variant="text"
          onClick={() => {
            history.push("/register");
          }}
        >
          Register
        </Button>
      </Box>
    );
  } else if (hasHiddenAuthButtons === "false") {
    console.log("main");
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      </Box>
    );
  } else if (localStorage.length > 0) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}

        <img src="avatar.png" alt={status} className="altar"></img>
        <p className="text">{status}</p>

        <Button
          className="explore-button"
          variant="text"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
            history.push("/");
          }}
        >
          Logout
        </Button>
      </Box>
    );
  }
};

export default Header;
