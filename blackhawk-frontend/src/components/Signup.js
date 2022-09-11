import React, { useState } from "react";

import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import UserPool from "../Userpool";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import {  toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const attributes = [
      new CognitoUserAttribute({ Name: "given_name", Value: firstname }),
      new CognitoUserAttribute({ Name: "family_name", Value: lastname }),
      new CognitoUserAttribute({ Name: "address", Value: address }),
      new CognitoUserAttribute({ Name: "phone_number", Value: "+"+phonenumber }),
    ];
    localStorage.setItem("email", email);
    UserPool.signUp(email, password, attributes, null, (err, data) => {
      if (err) {        
        toast.error(err.message)
      } else {
        toast.success("User Registered successfully! Please confirm your account using secret code sent to your email.")
        navigate("/confirm");
      }
    });
  };

  return (
    <div>
      <Grid container component="main" justifyContent="center">
        <CssBaseline />
        <Grid
          item
          xs={11}
          sm={8}
          md={3}
          p={2}
          mt={2}
          component={Paper}
          elevation={3}
          square
        >
          <Grid item align="center">
            <Avatar>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
          </Grid>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="firstname"
              label="First Name"
              type="text"
              id="firstname"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="lastname"
              label="Last Name"
              type="text"
              id="lastname"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              type="text"
              id="address"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone"
              type="number"
              id="phone"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
            <Grid container mt={1}>
              <Grid item>
                <Link to="/" style={{ textDecoration: "none" }}>
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default Signup;
