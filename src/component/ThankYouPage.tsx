import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Payment_thank_you_svg } from "../assets/AllSvgImages";
import { useLocation } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const url = params.get("URL");
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  // useEffect(() => {
  //   const timer = setTimeout(handleGoHome, 900000);
  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <Container
    //   maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Payment_thank_you_svg />
      </div>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 2, color: "#e56051", fontWeight: "bold" }}
      >
        Thank You!
      </Typography>
      <Typography variant="h6" component="p" sx={{ mb: 3 }}>
        Payment done successfully
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        You will be automatically redirected shortly. Meanwhile, you can click
        below to download your payment receipt.
      </Typography>
      {url && (
        <div>
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
            Download Payment Receipt
          </Button>
        </div>
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

export default ThankYouPage;
