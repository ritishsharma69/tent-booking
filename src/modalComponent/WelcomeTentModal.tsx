import React from "react";
import {
  Container,
  DialogContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import chambaKailash2 from "../assets/chambaKailash2.jpg";
import chambaKailash2Blur from "../assets/chambaKailash2Blur.png"

interface WelcomeTentModalProps {
  onClose: () => void;
}

const WelcomeTentModal: React.FC<WelcomeTentModalProps> = ({ onClose }) => {
  return (
    <Container
      maxWidth="md"
      sx={{
        padding: 2,
        backgroundColor: "#f5f5f5",
        boxShadow: 3,
      }}
    >
      <div id="particles-js">

        
</div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          textAlign: "center",
          backgroundImage: `url(${chambaKailash2Blur})`,
          backgroundColor: "rgba(0,0,0,0.4)",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: 4,
          borderRadius: "12px",
          boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "1.75rem",
            },
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            // lineHeight: 1.3,
          }}
        >
          पवित्र मणीमहेश डल झील के आस-पास कचरा, गीले कपडे और स्नान उपरान्त अपने
          अधोवस्त्र इधर-उधर न फेकें तथा इन्हे अपने साथ वापस ले कर जायें। पालन
          नहीं करने पर जुर्माना व सख्त कार्यवाही की जाएगी।
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#b22515",
            fontWeight: "bold",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem", xl: "2.5rem" },
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
          }}
        >
          Registration Open From
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
          }}
        >
          26<sup>th</sup> August to 11<sup>th</sup> September
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: "#b22515",
            "&:hover": {
              backgroundColor: "#e56051",
            },
            fontWeight: "bold",
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
            padding: { xs: "8px 16px", sm: "10px 20px", md: "12px 24px" },
          }}
        >
          Start
        </Button>
      </Box>
    </Container>
  );
};

export default WelcomeTentModal;
