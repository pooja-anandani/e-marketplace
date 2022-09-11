import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "./Accounts";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { authenticate, getSession, setStatus } = useContext(AccountContext);

  useEffect(() => {
    getSession().then((session) => {
      console.log("Session:", session);
      navigate("/listings")
    }).catch((err)=>{
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    authenticate(email, password)
      .then((data) => {
        setStatus(true);
        localStorage.setItem("email",email);
        navigate("/listings");
      })
      .catch((err) => {
        console.log("failed", err);
        // alert(err);
        toast.error(err.message);
      });
  };

  return (
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
      >
        <Grid item align="center">
          <Avatar>
            <LockIcon />
          </Avatar>
          <Typography variant="h5">Sign in</Typography>
        </Grid>
        <form onSubmit={onSubmit}>
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
            Sign In
          </Button>
          <Grid container mt={1}>
            <Grid item md={12}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </Grid>
            <Grid item md={12}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
