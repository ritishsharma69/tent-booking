import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useTentContext } from "../store/Store";
import { useNavigate } from "react-router-dom";
import tentImageReceipt from "../assets/tentImageReceipt.jpeg";

const CenteredContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "92vh",
  padding: "10px",
  backgroundImage: `url(${tentImageReceipt})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const StyledCard = styled(Card)({
  width: "400px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "15px",
});

const ButtonOutlined = styled(Button)<{ selected?: boolean }>(
  ({ selected }) => ({
    color: selected ? "#fff" : "#b22515",
    border: "1px solid #e56051",
    backgroundColor: selected ? "#b22515" : "transparent",
    borderRadius: "6px",
    "&:hover": {
      backgroundColor: selected ? "#e56051" : "rgba(25, 118, 210, 0.1)",
      color: selected ? "#fff" : "#b22515",
      border: "1px solid #e56051",
    },
  })
);

const CustomModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  message: any;
}> = ({ open, onClose, title, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#b22515",
            "&:hover": {
              backgroundColor: "#e56051",
            },
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const DownloadReceipt: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [receiptType, setReceiptType] = useState<"none" | "tent">("none");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState<any>(null);
  const [verificationSuccess, setVerificationSuccess] =
    useState<boolean>(false);

  const { baseUrl } = useTentContext();

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    setMobile(input);
  };

  const handleDownloadReceipt = async () => {
    if (mobile.length === 10 && receiptType === "tent") {
      try {
        const response = await axios.post(`${baseUrl}/tent/download-receipt`, {
          mobile,
          receiptType: "tent",
        });

        console.log("API Response:", response.data);

        if (
          response.data &&
          response.data.data &&
          response.data.data.download_url
        ) {
          window.open(response.data.data.download_url, "_blank");
        } else if (
          response.data &&
          response.data.success &&
          response.data.message === "failed payment"
        ) {
          setModalTitle("Last transaction failed");
          setVerificationSuccess(true);
          setModalOpen(true);
          console.log(response.data.data);
        } else {
          setModalTitle("Booking Not Found");
          setModalMessage(`No user has booked a tent with ${mobile}.`);
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Error downloading receipt:", error);
        setModalTitle("Download Failed");
        setModalMessage("Failed to download receipt. Please try again later.");
        setModalOpen(true);
      }
    } else {
      setModalTitle("Incomplete Form");
      setModalMessage("Please fill in all required fields.");
      setModalOpen(true);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(!(mobile.length === 10 && receiptType === "tent"));
  }, [mobile, receiptType]);

  return (
    <div>
      <CenteredContainer>
        <StyledCard>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ mb: 4, fontWeight: "bold", color: "#b22515" }}
            >
              Download Receipt
            </Typography>
            <Box sx={{ mb: 2 }}>
              <ButtonOutlined
                variant="outlined"
                selected={receiptType === "tent"}
                fullWidth
                onClick={() => setReceiptType("tent")}
                sx={{ mb: 2 }}
              >
                Tent Booking Receipt
              </ButtonOutlined>
            </Box>
            {receiptType === "tent" && (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Enter Your Phone Number
                </Typography>
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ mt: 1 }}
                >
                  <TextField
                    label="Mobile Number"
                    type="tel"
                    fullWidth
                    value={mobile}
                    onChange={handleMobileChange}
                    sx={{ mb: 2 }}
                    inputProps={{
                      maxLength: 10,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleDownloadReceipt}
                    disabled={isButtonDisabled}
                    sx={{
                      borderRadius: "6px",
                      backgroundColor: isButtonDisabled ? "#cccccc" : "#b22515",
                      "&:hover": {
                        backgroundColor: isButtonDisabled
                          ? "#cccccc"
                          : "#e56051",
                      },
                    }}
                  >
                    Download Tent Booking Receipt
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </StyledCard>

        <CustomModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </CenteredContainer>
    </div>
  );
};

export default DownloadReceipt;
