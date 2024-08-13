import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="p">
        We are processing your request...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
