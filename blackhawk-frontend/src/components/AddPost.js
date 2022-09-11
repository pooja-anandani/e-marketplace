import React, { useContext } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { toast } from "react-toastify";
import { AccountContext } from "./Accounts";

const defaultValues = {
  Title: "",
  Description: "",
  Price: 0,
};

function AddPost(props) {
  const theme = useTheme();
  const styles = {
    [theme.breakpoints.down("md")]: {
      maxWidth: "90%",
      elevation: 10,
      boxShadow: 8,
      mt: 8,
      mr: "auto",
      ml: "auto",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "60%",
      elevation: 10,
      boxShadow: 8,
      mt: 8,
      mr: "auto",
      ml: "auto",
    },
  };
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [message, setMessage] = useState("");
  const [imagePath, setImagePath] = useState();
  const [Title, setTitle] = useState("");
  const [Category, setCategory] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Post, setPost] = useState(defaultValues);
  const { getUserAttributes } = useContext(AccountContext);
  const processImage2Base64 = (e) => {
    var f = document.getElementById("contained-button-file");
    const fileName = f.files[0].name;
    setFileName(fileName);
    var file = f.files[0];
    var fileData;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      fileData = reader.result;
      setImagePath(fileData);
    };
  };
  const handleSubmit = () => {
    if (Title === "" || Price === 0 || Category === "" || fileName === "") {
      // setOpen(true);
      // setSeverity("error");
      // setMessage("Please fill all the required details");
      toast.error("Please fill all the required details");
    } else {
      getUserAttributes()
        .then((attributes) => {
          let firstname=attributes.filter((attribute)=>attribute.Name==="given_name")[0].Value;
          let lastname=attributes.filter((attribute)=>attribute.Name==="family_name")[0].Value;
          let name=firstname+" "+lastname;
          let email=attributes.filter((attribute)=>attribute.Name==="email")[0].Value;
          axios
            .post(
              "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/createpost",
              {
                title: Title,
                description: Description,
                category: Category,
                price: Price,
                fileData: imagePath,
                fileName: fileName,
                sellerEmail: email,
                sellerName: name,
              }
            )
            .then((response) => {
              // setOpen(true);
              // setSeverity("success");
              toast.success("Listing Added Sucessfully");
              setCategory("");
              setTitle("");
              setDescription("");
              setPrice(0);
              setFileName("");
            })
            .catch((err) => {
              toast.error("Failed to Add Listing");
            });
        })
        .catch((err) => {
          toast.error("Failed to Add Listing");
        });
    }
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <>
      {/* <Box
        sx={styles}
      > */}
      <Grid
        container
        align="center"
        justifyContent="center"
        sx={{ backgroundColor: "background.paper" }}
      >
        <Grid item md={12}>
          <Typography variant="h3">Add Listing</Typography>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} xs={12} sx={{ mt: 2 }}>
          <TextField
            required
            value={Title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            variant="outlined"
            label="Title"
            fullWidth
          ></TextField>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} xs={12} sx={{ mt: 2 }}>
          <TextField
            value={Description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            variant="outlined"
            multiline
            rows={4}
            label="Description"
            fullWidth
          ></TextField>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} xs={12} sx={{ mt: 2 }}>
          {/* <TextField
              required
              value={Category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              fullWidth
              variant="outlined"
              label="Category"
            ></TextField> */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Category}
              label="Category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              align="left"
            >
              <MenuItem value={"Furniture"}>Furniture</MenuItem>
              <MenuItem value={"Electronics"}>Electronics</MenuItem>
              <MenuItem value={"Home"}>Home</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} xs={12} sx={{ mt: 2 }}>
          <TextField
            required
            value={Price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            type="number"
            variant="outlined"
            label="Price"
            fullWidth
          ></TextField>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} xs={12} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            value={fileName}
            variant="outlined"
            label="Image"
            InputProps={{
              endAdornment: (
                <label htmlFor="contained-button-file">
                  <Input
                    onChange={(e) => {
                      processImage2Base64(e);
                    }}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                  />
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
              ),
            }}
          ></TextField>
        </Grid>
        <Grid item md={3}></Grid>
        <Grid item md={3}></Grid>
        <Grid item md={6} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Grid>
        <Grid item md={3}></Grid>
      </Grid>
      {/* <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={1000}
      >
        <Alert severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar> */}
      {/* <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        severity="success"
        open={open}
        message={message}
        key={'top' + 'center'}
        autoHideDuration={1000}
      /> */}
      {/* </Box> */}
    </>
  );
}

export default AddPost;
