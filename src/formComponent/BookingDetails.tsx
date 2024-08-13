import React from "react";
import { Typography, Grid, Paper, TextField } from "@mui/material";
import { useTentContext } from "../store/Store";

const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const BookingDetails: React.FC = () => {
  const { tentBookingSummary } = useTentContext();

  if (!tentBookingSummary) {
    return (
      <Typography
        variant="body1"
        sx={{
          color: "#a81f10",
          fontSize: "1.25rem",
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        No booking details available Go BACK
      </Typography>
    );
  }

  const {
    check_in_date,
    check_out_date,
    quadHouse,
    hexaHouse,
    max_person,
    total_fee,
  } = tentBookingSummary;

  const formattedCheckInDate = formatDateToDDMMYYYY(check_in_date);
  const formattedCheckOutDate = formatDateToDDMMYYYY(check_out_date);

  return (
    <Paper
      elevation={3}
      sx={{ padding: "16px", margin: "16px", borderRadius: "8px" }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              textTransform: "uppercase",
              background: "#a81f10",
              color: "#fff",
              padding: 2,
              borderRadius: 2,
            }}
          >
            Booking Details
          </Typography>
          <Grid container mt={1} spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-In Date"
                value={formattedCheckInDate}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-Out Date"
                value={formattedCheckOutDate}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quad Tent"
                value={`${quadHouse}`}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hexa Tent"
                value={`${hexaHouse}`}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Persons Allowed"
                value={max_person}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Fee"
                value={`₹${total_fee}`}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookingDetails;
