import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Fab,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { HashLoader } from "react-spinners";
import AddPost from "./AddPost";
import { AccountContext } from "./Accounts";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  backgroundColor: "white",
  border: "2px solid #fff",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const MyListings = () => {
  const navigate = useNavigate();
  const { getSession, setStatus, getUserAttributes } = useContext(AccountContext);
  const [posts, setPosts] = useState([]);
  const [backupPosts, setBackupPosts] = useState([]);
  const [openFlag, setOpenFlag] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedPost, setSelectedPost] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchToggle, setSearchToggle] = useState(false);
  const [addPostFlag, setAddPostFlag] = useState(false);

  const handleOpen = (post) => {
    setSelectedPost(post);
    setOpenFlag(true);
  };

  const handleClose = () => {
    setSelectedPost({});
    setOpenFlag(false);
  };

  const handleChange = (event) => {
    let post = selectedPost;
    post[event.target.name] = event.target.value;
    setSelectedPost({ ...post });
  };

  useEffect(() => {
    getSession()
      .then((session) => {
        setLoader(true);
        getUserAttributes().then((attributes)=>{
          console.log(attributes)
          axios
          .post(
            "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/get-product-info",
            {
              SELLER_EMAIL: attributes.filter((attribute)=>attribute.Name==="email")[0].Value,
            }
          )
          .then((response) => {
            response.data.Items.map((post) => {
              post.IMAGE = "http://" + post.IMAGE;
            });
            setPosts(response.data.Items);
            setBackupPosts(response.data.Items);
            setLoader(false);
          })
          .catch(() => {
            setPosts([]);
            setBackupPosts([]);
            setLoader(false);
          });
        }).catch((err)=>{
          console.log(err)
          setLoader(false);
        })
        
      })
      .catch((err) => {
        setLoader(false);
        navigate("/");
        localStorage.clear();
        setStatus(false);
      });
  }, [openFlag,addPostFlag]);

  const handleEditPost = () => {
    setLoader(true);
    axios
      .post(
        "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/modifypost",
        {
          ID: selectedPost.ID,
          POST_TITLE: selectedPost.POST_TITLE,
          DESCRIPTION: selectedPost.DESCRIPTION,
          PRICE: selectedPost.PRICE,
        }
      )
      .then((response) => {
        toast.success(response.data.data);
        setOpenFlag(false);
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoader(false);
      });
  };

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    let keyword = searchInput.trim().toLowerCase();
    if (keyword === "") {
      setPosts(backupPosts);
      setSearchToggle(false);
    } else {
      let filteredPosts = posts.filter((item) => {
        if (
          item.POST_TITLE.toLowerCase().includes(keyword) ||
          item.DESCRIPTION.toLowerCase().includes(keyword) ||
          item.SELLER_NAME.toLowerCase().includes(keyword)
        ) {
          return true;
        } else {
          return false;
        }
      });
      setPosts(filteredPosts);
      setSearchToggle(true);
    }
  };

  const handleDeletePost = () => {
    setLoader(true);
    axios
      .post(
        "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/deletepost",
        { ID: selectedPost.ID }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          toast.success(response.data.body.message);
          setOpenFlag(false);
        } else {
          toast.error(response.data.body.message);
        }
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoader(false);
      });
  };

  return (
    <LoadingOverlay active={loader} spinner={<HashLoader color="#ffffff" />}>
      <Container>
        {posts.length === 0 ? (
          <Grid
            container
            spacing={3}
            mt={1}
            pb={5}
            direction="column"
            alignContent="center"
            justifyContent="center"
          >
            <Grid item md={12} xs={12}>
              <Typography variant="h4">My Listings</Typography>
            </Grid>
            <Grid item xs={12}>
              <img
                src="https://lynethhealthcare.in/images/no-product.png"
                alt="No Posts Found"
                style={{ maxWidth: "100%" }}
              />
              <Typography variant="h5" align="center">
                You haven't posted any listings yet.
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3} mt={1} pb={5}>
            <Grid item md={12} xs={12}>
              <Typography variant="h4">My Listings</Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  inputProps={{ "aria-label": "search..." }}
                />
                <IconButton
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  {searchToggle ? (
                    <CloseIcon
                      onClick={() => {
                        setSearchToggle(false);
                        setSearchInput("");
                      }}
                    />
                  ) : (
                    <SearchIcon />
                  )}
                </IconButton>
              </Paper>
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            {posts.map((post, index) => (
              <Grid item md={3} xs={12} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={
                      post.IMAGE
                        ? post.IMAGE
                        : "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="250"
                    alt="post"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      ${post.PRICE}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.POST_TITLE}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleOpen(post)}>
                      Edit Post
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Modal
              open={openFlag}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openFlag}>
                <Box sx={style}>
                  <CloseIcon
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 5, top: 0 }}
                  />

                  <Grid container spacing={6}>
                    <Grid item md={6} xs={12}>
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: "Post Image",
                            isFluidWidth: true,
                            src: selectedPost.IMAGE
                              ? selectedPost.IMAGE
                              : "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
                            width: 800,
                            height: 400,
                          },
                          largeImage: {
                            src: selectedPost.IMAGE
                              ? selectedPost.IMAGE
                              : "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
                            width: 1600,
                            height: 1200,
                          },
                          enlargedImagePosition: "over",
                          isEnlargedImagePortalEnabledForTouch: true,
                          isHintEnabled: true,
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Typography
                        id="transition-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        <TextField
                          fullWidth
                          label="Post Title"
                          name="POST_TITLE"
                          onChange={(event) => handleChange(event)}
                          value={selectedPost.POST_TITLE}
                        />
                      </Typography>
                      <Typography variant="subtitle1">
                        <FormControl fullWidth sx={{ mt: 2 }}>
                          <InputLabel htmlFor="outlined-adornment-amount">
                            Price
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            value={selectedPost.PRICE}
                            type="number"
                            onChange={(event) => handleChange(event)}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                            label="PRICE"
                            name="PRICE"
                          />
                        </FormControl>
                      </Typography>
                      <Divider sx={{ mt: 2 }} />
                      <Typography variant="body1">
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={4}
                          name="DESCRIPTION"
                          onChange={(event) => handleChange(event)}
                          value={selectedPost.DESCRIPTION}
                        />
                      </Typography>
                      <Divider sx={{ mt: 2 }} />
                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 2, fontWeight: 700 }}
                      >
                        Seller information
                      </Typography>
                      <Typography variant="body1" mb={3}>
                        {selectedPost.SELLER_NAME}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleEditPost}
                      >
                        Update Post
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleDeletePost}
                      >
                        Delete Post
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>
          </Grid>
        )}
        <Grid container justifyContent="flex-end" alignContent="flex-end">
          <Fab
            color="primary"
            variant="extended"
            sx={{ position: "fixed", bottom: 50, right: 40 }}
            onClick={() => setAddPostFlag(true)}
          >
            <AddIcon />
            Add Listing
          </Fab>
        </Grid>
        <Modal
          open={addPostFlag}
          onClose={() => setAddPostFlag(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={addPostFlag}>
            <Box sx={style}>
              <CloseIcon
                onClick={() => setAddPostFlag(false)}
                sx={{ position: "absolute", right: 5, top: 0 }}
              />
              <AddPost />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </LoadingOverlay>
  );
};

export default MyListings;
