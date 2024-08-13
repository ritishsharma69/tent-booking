import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import payment_failed from ".././assets/failed.png";

const RetryPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve URL parameter from the query string
  const params = new URLSearchParams(location.search);
  const url = params.get("URL");

  // Navigate to the home page
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        textAlign: "center",
      }}
    >
      <img
        src={payment_failed}
        alt="Payment failed"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          marginBottom: "20px",
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 2, color: "#e56051", fontWeight: "bold" }}
      >
        Oops! Something went wrong
      </Typography>
      {url && (
        <Button
          variant="contained"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mb: 2,
            color: "#fff",
            backgroundColor: "#b22515",
            "&:hover": {
              backgroundColor: "#e56051",
            },
          }}
        >
          Retry Payment
        </Button>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleGoHome}
        sx={{ mb: 3 }}
      >
        Go to Home Page
      </Button>
    </Container>
  );
};

export default RetryPayment;
