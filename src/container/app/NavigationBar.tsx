import React, { useEffect, useState } from "react";

// React Router Dom
import { Link as RouterLink } from "react-router-dom";

// aws-amplify
import { Auth, Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

// MaterialUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

// Custom component
import ButtonLink from "../../components/buttonLink/ButtonLink";
import { useUserContext } from "./UserContext";

const ROUTER_LINK_INFO = [
  {
    name: "Illumination",
    routerLink: "/",
    variant: "h6" as const,
  },
  {
    name: "Projects",
    routerLink: "/projects",
  },
  {
    name: "Pipelines",
    routerLink: "/pipelines",
  },
  // {
  //   name: "Users",
  //   routerLink: "/users",
  // },
];

interface NavBarLinkConstant extends TypographyProps {
  name: string;
  routerLink: string;
}

function navbarLinkButton(linkInformation: NavBarLinkConstant) {
  return (
    <ButtonLink
      color="primary"
      to={linkInformation.routerLink}
      sx={{
        margin: "0 10px 0 10px",
        color: "black",
        textTransform: "none",
      }}
    >
      <Typography
        variant={
          linkInformation.variant ? linkInformation.variant : "subtitle1"
        }
        component="div"
      >
        {linkInformation.name}
      </Typography>
    </ButtonLink>
  );
}

const ResponsiveAppBar = () => {
  // User Context State
  const { user, setUser } = useUserContext();

  // Navigations Bar State
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar>
          {/* Smaller Screen (Hamburger menu item will appear) */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
              {ROUTER_LINK_INFO.map((linkInfo, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  {navbarLinkButton(linkInfo)}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "Center",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Illumination
          </Typography>

          {/* Links for larger screen */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {ROUTER_LINK_INFO.map((linkInfo, index) => (
              <div key={index}>{navbarLinkButton(linkInfo)}</div>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px", width: "150px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!user.isSignedIn ? (
                <MenuItem
                  onClick={() =>
                    Auth.federatedSignIn({
                      provider: CognitoHostedUIIdentityProvider.Google,
                    })
                  }
                >
                  Sign In
                </MenuItem>
              ) : (
                <MenuItem onClick={() => Auth.signOut()}>Sign Out</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
