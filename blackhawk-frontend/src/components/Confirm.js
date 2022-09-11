import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CognitoUser } from "amazon-cognito-identity-js";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPool from "../Userpool";
import Pool from "../Userpool";
import LockIcon from "@mui/icons-material/Lock";
import ReplayIcon from '@mui/icons-material/Replay';
import CheckIcon from '@mui/icons-material/Check';
import { AccountContext } from "./Accounts";
import {  toast } from 'react-toastify';

const Confirm = () => {
  const [code, Setcode] = useState(0);
  const { resend, confirm } = useContext(AccountContext);
  const navigate = useNavigate();
  const onClick = (e) => {
    e.preventDefault();
    resend()
      .then((result) => {
        toast.success("Code has been re-sent to your email.");
      })
      .catch((err) => {
        toast.error("Failed to resend code, try again in sometime.");
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    confirm(code)
      .then((result) => {
        toast.success("Successfully confirmed user, proceed to Login!")
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message)
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
        <Grid item align="center" mb={2}>
          <Avatar>
            <LockIcon />
          </Avatar>
          <Typography variant="h5">Confirm Your Account</Typography>
        </Grid>
        <form onSubmit={onSubmit}>
          <Typography variant="subtitle2">Please verify email before signing in by entering the code below</Typography>
          <TextField
            type="number"
            label="Secret Code"
            fullWidth
            onChange={(e) => {
              Setcode(e.target.value);
            }}
            required
          />
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={onClick}
              startIcon={<ReplayIcon />}
            >
              Resend Code
            </Button>
            <Button type="submit" fullWidth variant="contained" color="primary" endIcon={<CheckIcon />}>
              Confirm Account
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
    
    // <div>
    //   <form onSubmit={onSubmit}>
    //     <p> Please verify email before signing in by entering the code</p>
    //     <TextField
    //       type="number"
    //       onChange={(e) => {
    //         Setcode(e.target.value);
    //       }}
    //     />
    //     <button type="submit"> Submit </button>
    //     <button type="button" onClick={onClick}>
    //       {" "}
    //       Resend code
    //     </button>
    //   </form>
    // </div>
  );
};

export default Confirm;
