import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, TextField, Typography, Box, Grid, IconButton } from "@mui/material";
import axios from "axios";
import { useTentContext } from "../store/Store";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import {conf} from "../conf/conf";

interface PhoneNumberVerifyProps {
  mobile: string;
  onClose: () => void;
}

const PhoneNumberVerify: React.FC<PhoneNumberVerifyProps> = ({
  mobile, onClose,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [verificationSuccess, setVerificationSuccess] =
    useState<boolean>(false);
  const { bookingId, setOtpResponseData } = useTentContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const {baseUrl} = conf;

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const otpArray = [...otp];
    otpArray[index] = value;

    if (value.length === 1 && index < otp.length - 1) {
      (
        document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement
      )?.focus();
    } else if ( value.length === 0 && index > 0 ) {
      (
        document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement
      )?.focus();
    }

    setOtp(otpArray);
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    console.log(bookingId);

    // Check if OTP is valid (add your validation logic here)
    if (otpValue.length === otp.length) {
      const data = {
        application_id: bookingId,
        otp: otpValue,
      };

      const url = `${baseUrl}/tent/verify`;
      try {
        console.log("Data being sent:", data);
        const response = await axios.post(url, data);
        console.log("Response:", response.data);
        console.log(response.data.data);
        setOtpResponseData(response.data.data);
        setVerificationSuccess(true);
      } catch (error: any) {
        if (error.response) {
          console.error("Error Response:", error.response.data);
          setMessage("OTP is Incorrect");
        } else {
          console.error("Error:", error.message);
        }
      }
    } else {
      console.error("Invalid OTP");
      setMessage("Please enter OTP");
    }
  };

  const handleResendOTP = async () => {
    const url = `${baseUrl}/tent/resend-otp/${bookingId}`;
    try {
      const response = await axios.post(url);
      console.log(response);
      setMessage("OTP is Resend");
    } catch (error) {
      console.log("Error Resend", error);
      setMessage("Error in resending OTP");
    }

    console.log("Resend OTP");
    setOtp(["", "", "", ""]);
    setTimeLeft(120);
    setIsResendDisabled(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    if (verificationSuccess) {
      navigate("/redirect-page");
    }
  }, [verificationSuccess, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
      sx={{
        maxWidth: "500px",
        mx: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: 2,
      }}
    >
      <div style={{ background: "#a81f10", color: "#fff", width: "100%", padding: 4, borderRadius: "8px" }}>

        <div style={{ position: "absolute", top: 8, right: 45 }}>
          <div style={{ position: "fixed" }}>
            <IconButton onClick={onClose} color="inherit" aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            textTransform: "uppercase",
            padding: 1,
          }}
        >
          OTP Verification
        </Typography>
      </div>
      <Grid container borderTop={1} borderColor="grey.300"></Grid>

      <Typography variant="body1" align="center">
        An OTP (One Time Passcode) has been sent to +91 {mobile}.
        <br />
        Please enter the OTP in the fields below to verify your phone.
      </Typography>

      <Typography variant="body2" align="center" color="error">{message && (
        <Typography>{message}</Typography>
      )}</Typography>

      <Typography variant="body2" align="center" color="error">
        Your OTP will be sent again in {formatTime(timeLeft)} minutes.
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        {otp.map((value, index) => (
          <TextField
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputProps={{ maxLength: 1 }}
            value={value}
            onChange={(e) =>
              handleChange(e as ChangeEvent<HTMLInputElement>, index)
            }
            sx={{
              width: "40px",
              height: "40px",
              textAlign: "center",
              fontSize: "1.5rem",
              mx: 0.5,
            }}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" width="100%">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResendOTP}
          disabled={isResendDisabled}
          sx={{ mt: 2, flexGrow: 1, mr: 1 }}
        >
          Resend OTP
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#b22515',
            mt: 2,
            flexGrow: 1,
            mr: 1,
            '&:hover': {
              backgroundColor: '#e56051',
            },
          }}
        >
          Verify
        </Button>
      </Box>
    </Box>
  );
};

export default PhoneNumberVerify;
