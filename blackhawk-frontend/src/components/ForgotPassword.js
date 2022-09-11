import { Avatar, Button, CssBaseline, Grid, Paper, TextField, Typography } from "@mui/material";
import { CognitoUser } from "amazon-cognito-identity-js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pool from "../Userpool";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const sendCode = (e) => {
    const user = new CognitoUser({ Username: email.toLowerCase(), Pool });
    e.preventDefault();

    user.forgotPassword({
      onSuccess: (result) => {
        console.log("success", result);
      },
      onFailure: (error) => {
        console.log("fail", error.message);
        toast.error("User not found!")
      },
      inputVerificationCode: (code) => {
        toast.success("Enter secret code sent to your email address and set your new password.")
        localStorage.setItem("email", email.toLowerCase());
        navigate("/reset-password");
      },
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
          <Typography variant="h5">Forgot Password</Typography>
        </Grid>
        <form onSubmit={sendCode}>
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

          <Button type="submit" fullWidth variant="contained" color="primary">
            Send Code
          </Button>          
        </form>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
