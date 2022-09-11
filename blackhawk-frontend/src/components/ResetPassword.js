import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { CognitoUser } from "amazon-cognito-identity-js";
import React, { useState } from "react";
import Pool from "../Userpool";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [code, Setcode] = useState("");
  const [password, Setpassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Invalid Secret Code Entered");
    } else if (password !== ConfirmPassword) {
      toast.error("Passwords do not match");
    } else {
      const email = localStorage.getItem("email");
      const user = new CognitoUser({ Username: email, Pool });
      user.confirmPassword(code, password, {
        onSuccess: (result) => {
          console.log("success", result);
          toast.success("Password reset successfully, proceed to Login!");
          navigate("/");
        },
        onFailure: (error) => {
          console.log("failure", error);
          toast.error(error.message);
        },
      });
    }
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
          <Typography variant="h5">Set Password</Typography>
        </Grid>
        <form onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            type="text"
            label="Enter Secret Code"
            onChange={(e) => Setcode(e.target.value)}
            required
            fullWidth
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            label="Password"
            onChange={(e) => {
              Setpassword(e.target.value);
            }}
            required
            fullWidth
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            label="Confirm Password"
            onChange={(e) => {
              SetConfirmPassword(e.target.value);
            }}
            required
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item md={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Change Password
              </Button>
            </Grid>
            <Grid item md={12}>
              <Button
                onClick={() => {
                  navigate("/forgot-password");
                }}
                fullWidth
                variant="contained"
                color="error"
              >
                Go Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
