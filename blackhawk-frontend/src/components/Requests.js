import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { HashLoader } from "react-spinners";

function Requests() {
  const theme = useTheme();
  const styles = {
    [theme.breakpoints.down("md")]: {
      maxWidth: "95%",
      elevation: 10,
      boxShadow: 8,
      mt: 8,
      mr: "auto",
      ml: "auto",
      backgroundColor: "background.paper",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "80%",
      elevation: 10,
      boxShadow: 8,
      mt: 8,
      mr: "auto",
      ml: "auto",
      backgroundColor: "background.paper",
    },
  };
  const [flag, setFlag] = useState("");
  const [loader, setLoader] = useState(true);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setLoader(true);
    axios
      .post(
        "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/getrequeststatus",
        {
          SELLER_EMAIL: localStorage.getItem("email"),
        }
      )
      .then((data) => {
        setLoader(false);
        setRequests(data.data.Items);
      })
      .catch((error) => {
        setLoader(false);
        setRequests([]);
      });
  }, [flag]);

  const handleAccepted = (requests) => {
    setLoader(true);
    axios
      .post(
        "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/contactinfo",
        {
          ID: requests.ID,
          SELLER_EMAIL: requests.SELLER_EMAIL,
          BUYER_EMAIL: requests.BUYER_EMAIL,
          POST_TITLE: requests.POST_TITLE,
          R_STATUS: "Accepted",
        }
      )
      .then((data) => {
        setFlag("set");
        setLoader(false);
        toast.success("Contact request accepted, your contact details have been sent to buyer.")
      })
      .catch((err) => {
        setFlag("set");
        setLoader(false);
        toast.error("Some error occured while updating request.")
      });
  };
  const handleRejected = (requests) => {
    setLoader(true);
    axios
      .post(
        "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/contactinfo",
        {
          ID: requests.ID,
          SELLER_EMAIL: requests.SELLER_EMAIL,
          BUYER_EMAIL: requests.BUYER_EMAIL,
          POST_TITLE: requests.POST_TITLE,
          R_STATUS: "Rejected",
        }
      )
      .then((data) => {
        setFlag("set")
        setLoader(false);;
        toast.success("Contact request rejected");
      })
      .catch((err) => {
        setFlag("set");
        setLoader(false);
        toast.error("Some error occured while updating request.");
      });
  };
  return (
    <LoadingOverlay active={loader} spinner={<HashLoader color="#ffffff" />}>
      <Grid container align="center" justifyContent="center" sx={styles}>
        <Grid item md={12} sx={{ p: 2 }}>
          <Typography variant="h3">Contact Requests</Typography>
        </Grid>
        <Grid item md={10} xs={11}>
          <TableContainer component={Paper} sx={{ mt: 3, mb: 3 }}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ backgroundColor: "#424242", color: "white" }}
                    align="center"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "#424242", color: "white" }}
                    align="center"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "#424242", color: "white" }}
                    align="center"
                  >
                    Message
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "#424242", color: "white" }}
                    align="center"
                  >
                    Post Title
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "#424242", color: "white" }}
                    align="center"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row) => (
                  <TableRow hover key={row.ID}>
                    <TableCell align="center">{row.BUYER_NAME}</TableCell>
                    <TableCell align="center">{row.BUYER_EMAIL}</TableCell>
                    <TableCell align="center">{row.MESSAGE}</TableCell>
                    <TableCell align="center">{row.POST_TITLE}</TableCell>
                    {row.R_STATUS === "Created" ? (
                      <TableCell align="center">
                        <Grid
                          container="row"
                          justifyContent="center"
                          spacing={2}
                        >
                          <Grid item>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handleAccepted(row);
                              }}
                            >
                              Accept
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => {
                                handleRejected(row);
                              }}
                            >
                              Reject
                            </Button>
                          </Grid>
                        </Grid>
                      </TableCell>
                    ) : (
                      <TableCell align="center">{row.R_STATUS}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </LoadingOverlay>
  );
}

export default Requests;
