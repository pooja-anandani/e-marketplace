import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import LoadingOverlay from "react-loading-overlay";
import { HashLoader } from "react-spinners";
import { AccountContext } from "./Accounts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

const Listings = () => {
  const navigate = useNavigate();
  const { getSession, setStatus, getUserAttributes } =
    useContext(AccountContext);
  const [posts, setPosts] = useState([]);
  const [backupPosts, setBackupPosts] = useState([]);
  const [openFlag, setOpenFlag] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [loader, setLoader] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchToggle, setSearchToggle] = useState(false);
  const [contactMessage, setContactMessage] = useState(
    "Hi, I am interested in buying this product. How can I get in touch with you?"
  );

  const handleOpen = (post) => {
    setSelectedPost(post);
    setOpenFlag(true);
  };

  const handleClose = () => {
    setSelectedPost({});
    setOpenFlag(false);
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

  useEffect(() => {
    getSession()
      .then((session) => {
        setLoader(true);
        axios
          .get(
            "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/getallposts"
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
            setLoader(false);
          });
      })
      .catch((err) => {
        navigate("/");
        localStorage.clear();
        setStatus(false);
      });
  }, []);

  const handleContactSeller = () => {
    getUserAttributes()
      .then((attributes) => {
        let firstname = attributes.filter(
          (attribute) => attribute.Name === "given_name"
        )[0].Value;
        let lastname = attributes.filter(
          (attribute) => attribute.Name === "family_name"
        )[0].Value;
        let name = firstname + " " + lastname;
        let email = attributes.filter(
          (attribute) => attribute.Name === "email"
        )[0].Value;
        axios
          .post(
            "https://zu2tr9ds09.execute-api.us-east-1.amazonaws.com/prod/createcontactrequest",
            {
              BUYER_EMAIL: email,
              SELLER_EMAIL: selectedPost.SELLER_EMAIL,
              BUYER_NAME: name,
              POST_TITLE: selectedPost.POST_TITLE,
              POST_ID: selectedPost.ID,
              MESSAGE: contactMessage,
            }
          )
          .then((response) => {
            if (response.data.err) {
              toast.error(
                "Failed to send contact request to seller, try again later."
              );
            } else {
              toast.success("Seller has been requested for contact details.");
            }
          })
          .catch((err) => {
            toast.error(
              "Failed to send contact request to seller, try again later."
            );
          });
      })
      .catch((err) => {
        toast.error("Failed to raise contact request");
      });
    handleClose();
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
              <Typography variant="h4">Listings</Typography>
            </Grid>
            <Grid item xs={12}>
              <img
                src="https://lynethhealthcare.in/images/no-product.png"
                alt="No Posts Found"
                style={{ maxWidth: "100%" }}
              />
              <Typography variant="h5" align="center">
                Oops! No Posts Available. Please try later.
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3} mt={1} pb={5}>
            <Grid item md={12} xs={12}>
              <Typography variant="h4">Listings</Typography>
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
                      View Post
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
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
                    onClick={() => handleClose()}
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
                        {selectedPost.POST_TITLE}
                      </Typography>
                      <Typography variant="subtitle1">
                        $ {selectedPost.PRICE}
                      </Typography>
                      <Divider sx={{ mt: 2 }} />
                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 2, fontWeight: 700 }}
                      >
                        Seller's Description
                      </Typography>
                      <Typography variant="body1">
                        {selectedPost.DESCRIPTION}
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
                      {selectedPost.SELLER_EMAIL ===
                      localStorage.getItem("email") ? (
                        ""
                      ) : (
                        <div>
                          <TextField
                            value={contactMessage}
                            onChange={(e) => {
                              setContactMessage(e.target.value);
                            }}
                            variant="outlined"
                            multiline
                            rows={4}
                            label="Enter Message"
                            fullWidth
                          ></TextField>
                          <Button
                            onClick={() => handleContactSeller()}
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                          >
                            Contact Seller
                          </Button>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>
          </Grid>
        )}
      </Container>
    </LoadingOverlay>
  );
};

export default Listings;
