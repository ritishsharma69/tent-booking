import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#e56051" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Trebuchet MS, sans-serif",
            }}
          >
            Manimahesh Yatra 2024
          </Typography>

          <Box sx={{ display: { xs: "none", lg: "flex" } }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{
                marginLeft: 2,
                "&:hover": {
                  backgroundColor: "#FF4500",
                  height: "100%",
                },
                fontFamily: "Trebuchet MS, sans-serif",
              }}
            >
              Book Tent
            </Button>
            <Button
              component={Link}
              to="/download-receipt"
              color="inherit"
              sx={{
                marginLeft: 2,
                "&:hover": {
                  backgroundColor: "#FF4500",
                  height: "100%",
                },
                fontFamily: "Trebuchet MS, sans-serif",
              }}
            >
              Download Receipt
            </Button>
            {/* <Button
              component={Link}
              to="/cancel-booking"
              color="inherit"
              sx={{
                marginRight: 4,
                marginLeft: 2,
                "&:hover": {
                  backgroundColor: "#FF4500",
                  height: "100%",
                },
                fontFamily: "Trebuchet MS, sans-serif",
              }}
            >
              Cancel Booking Request
            </Button> */}
          </Box>

          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", lg: "none", marginRight: 10 } }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <List>
          <ListItem button component={Link} to="/" onClick={handleDrawerClose}>
            <ListItemText primary="Book Tent" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/download-receipt"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="Download Receipt" />
          </ListItem>
          {/* <ListItem
            button
            component={Link}
            to="/cancel-booking"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="Cancel Booking Request" />
          </ListItem> */}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
