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
import React, { useContext, useState } from "react";
import Pool from "../Userpool";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Accounts";

const ChangePassword = () => {
  const [oldPassword, Setpassword] = useState("");
  const [newPassword, SetNewPassword] = useState("");
  const { changePassword } = useContext(AccountContext);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    changePassword(oldPassword, newPassword).then((response) => {
        toast.success("Password changed successfully.")
    }).catch((err)=>{
        toast.error(err.message || "Some error occured.")
    })
    // user.changePassword(oldPassword,newPassword,(err, result) => {
    //     if (err) {
    //         toast.error(err.message || "Some error occured.")
    //     } else {
    //         toast.success("Password changed successfully.")
    //     }
    //   });
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
          <Typography variant="h5">Change Password</Typography>
        </Grid>
        <form onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            label="Old Password"
            onChange={(e) => {
              Setpassword(e.target.value);
            }}
            value={oldPassword}
            required
            fullWidth
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            label="New Password"
            onChange={(e) => {
              SetNewPassword(e.target.value);
            }}
            value={newPassword}
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
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
