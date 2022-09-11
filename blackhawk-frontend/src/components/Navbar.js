import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Accounts";
import { useContext, useState, useEffect } from "react";

const ResponsiveAppBar = () => {
  const { getSession, logout, status, setStatus } = useContext(AccountContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();

  const onLogout = (e) => {
    logout.then(localStorage.clear(), navigate("/"), setStatus(false));
  };

  useEffect(() => {
    getSession().then((session) => {
      setStatus(true);
    }).catch((err)=>{
      setStatus(false);
    });
  }, []);

  return (
    <AppBar sx={{ bgcolor: "#212121" }} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FlutterDashIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BlackHawk
          </Typography>
          {status?<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/Listings");
                }}
              >
                <Typography textAlign="center">Listings</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/my-listings");
                }}
              >
                <Typography textAlign="center">My Listings</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/requests");
                }}
              >
                <Typography textAlign="center">Requests</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/account");
                }}
              >
                <Typography textAlign="center">Acccount</Typography>
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleCloseNavMenu();
                  onLogout(e);
                }}
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>:''}
          <FlutterDashIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BlackHawk
          </Typography>
          <Box sx={{ flexGrow: 22 }} />
          {status?<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => {
                handleCloseNavMenu();
                navigate("/Listings");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Listings
            </Button>
            <Button
              onClick={() => {
                handleCloseNavMenu();
                navigate("/my-listings");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              My Listings
            </Button>
            <Button
              onClick={() => {
                handleCloseNavMenu();
                navigate("/requests");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Requests
            </Button>
            <Button
              onClick={() => {
                handleCloseNavMenu();
                navigate("/account");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Account
            </Button>
            <Button
              onClick={(e) => {
                handleCloseNavMenu();
                onLogout(e);
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Logout
            </Button>
          </Box>:''}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
