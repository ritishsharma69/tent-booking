import React from "react";
import { Button, DialogActions, Box, Typography } from "@mui/material";
import axios from "axios";
import { useTentContext } from "../store/Store";

interface ReceiptModalProps {
  mobile: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ mobile }) => {
  const { baseUrl } = useTentContext();

  const handleDownloadReceipt = async () => {

    try {
      const response = await axios.post(
        `${baseUrl}/tent/download-receipt`,
        {
          mobile,
          // receiptType: "tent",
        }
      );

      console.log("API Response:", response.data);

      if (
        response.data &&
        response.data.data &&
        response.data.data.download_url
      ) {
        window.open(response.data.data.download_url, "_blank");
      } else {
        console.error("Download URL not found in the API response.");
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("fetch receipt failed ok ");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" pb={2} color={'#b22515'}>Booking Already Exists</Typography>
      <Typography variant="body1" paragraph>
        {/* Your booking already exists. Please download your receipt using the button below. */}
        Your booking already exists for this phone number {mobile}. Please download your receipt using the button below.
      </Typography>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#b22515',
            '&:hover': {
              backgroundColor: '#e56051',
            },
          }}
          onClick={handleDownloadReceipt}
        >
          Download Receipt
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ReceiptModal;
