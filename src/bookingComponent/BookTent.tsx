import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Button,
  Container,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import manimahesh_Tent_Image from "../assets/manimahesh_Tent_Image.jpg";
import { useTentContext } from "../store/Store";
import WelcomeTentModal from "../modalComponent/WelcomeTentModal";
import { useNavigate } from "react-router-dom";

interface TentType {
  id: number;
  name: string;
  capacity: number;
  max_tents: number;
  extra_person_price: number;
  default_rate: string;
}

interface TentAvailability {
  tent_type: TentType;
  daily_availability: { [key: string]: number };
  rates: { [key: string]: string };
  min_availability: number;
  payable_amount: string;
}

interface TentItem {
  tent_type_id: number;
  quantity: number;
}
interface TentBookingSummary {
  check_in_date: string;
  check_out_date: string;
  quadHouse: number;
  hexaHouse: number;
  max_person: number;
  total_fee: number;
  tents: TentItem[];
  extra_person: any;
}

// formated date ok
const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const BookTent: React.FC = () => {
  const [welcomeTentModal, setWelcomeTentModal] = useState<boolean>(true);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [minCheckOutDate, setMinCheckOutDate] = useState<string>("");

  const [tentAvailability, setTentAvailability] = useState<TentAvailability[]>(
    []
  );
  const [numTents, setNumTents] = useState<{ [key: string]: number }>({});
  const [showCards, setShowCards] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setTentBookingSummary, baseUrl } = useTentContext();

  // formatted Date ok
  const formattedCheckInDate = formatDateToDDMMYYYY(checkInDate);
  const formattedCheckOutDate = formatDateToDDMMYYYY(checkOutDate);

  const [numAdditionalPersons, setNumAdditionalPersons] = useState<{
    [key: string]: number;
  }>({ keyName: 0 });
  const extraPerson = numAdditionalPersons["Quad House"];

  useEffect(() => {
    if (checkInDate && checkOutDate && showCards) {
      fetchTentAvailability(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate, showCards]);

  useEffect(() => {
    if (checkInDate) {
      const minDate = new Date(checkInDate);
      minDate.setDate(minDate.getDate() + 1);
      setMinCheckOutDate(minDate.toISOString().split("T")[0]);
    }
  }, [checkInDate]);

  const fetchTentAvailability = async (checkIn: string, checkOut: string) => {
    try {
      const response = await fetch(
        `https://manimahesh.netgen.work/api/tent/check-availability?check_in_date=${checkIn}&check_out_date=${checkOut}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API Response Data:", data);

      setTentAvailability(data);
    } catch (error) {
      console.error("Error fetching tent availability:", error);
    }
  };

  const handleCheckAvailability = () => {
    setShowCards(true);
    fetchTentAvailability(checkInDate, checkOutDate);
  };

  const handleTentCountChange = (id: string, delta: number) => {
    const accommodation = tentAvailability.find(
      (item) => item.tent_type.name === id
    );
    if (!accommodation) return;

    // Calculate the new count
    const newCount = (numTents[id] || 0) + delta;

    // Ensure the new count doesn't exceed available tents
    if (newCount >= 0 && newCount <= accommodation.min_availability) {
      setNumTents((prev) => ({
        ...prev,
        [id]: newCount,
      }));

      // Reset additional persons count if the tent count is decreased
      if (delta < 0) {
        setNumAdditionalPersons((prev) => ({
          ...prev,
          [id]: 0,
        }));
      }
    }
  };

  const calculateNumberOfNights = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const calculateTotalPrice = (
    tentName: string,
    payableAmount: string,
    count: number,
    extraPersonPrice: number
  ) => {
    const pricePerTent = parseFloat(payableAmount);
    if (numAdditionalPersons[tentName] > 0) {
      return (
        pricePerTent * count +
        numAdditionalPersons[tentName] *
          extraPersonPrice *
          calculateNumberOfNights()
      );
    }
    return pricePerTent * count;
  };

  const handleConfirmBooking = () => {
    const totalFee = tentAvailability.reduce((total, accommodation) => {
      const tentCount = numTents[accommodation.tent_type.name] || 0;
      return (
        total +
        calculateTotalPrice(
          accommodation.tent_type.name,
          accommodation.payable_amount,
          tentCount,
          accommodation.tent_type.extra_person_price
        )
      );
    }, 0);
    console.log("Total Fee: ", totalFee);

    // Ensure that quadHouse and hexaHouse are at the correct indices
    const quadHouse = numTents[tentAvailability[0]?.tent_type.name] || 0;
    const hexaHouse = numTents[tentAvailability[1]?.tent_type.name] || 0;

    const tents: TentItem[] = tentAvailability
      .filter((accommodation) => numTents[accommodation.tent_type.name] > 0)
      .map((accommodation) => ({
        tent_type_id: accommodation.tent_type.id,
        quantity: numTents[accommodation.tent_type.name],
      }));

    const maxPerson = Object.values(numTents).reduce((sum, count, index) => {
      // Adjust the calculation to match your data structure
      return (
        sum +
        count * (tentAvailability[index]?.tent_type?.capacity || 0) +
        extraPerson -
        quadHouse -
        hexaHouse
      );
    }, 0);

    const summary: TentBookingSummary = {
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      quadHouse: quadHouse,
      hexaHouse: hexaHouse,
      max_person: maxPerson,
      total_fee: totalFee,
      tents: tents,
      extra_person: extraPerson,
    };
    console.log(summary);
    setTentBookingSummary(summary);
    navigate("./tent-form");
  };

  const handleCancelBooking = () => {
    setShowCards(false);
    setNumTents({});
    setCheckInDate("");
    setCheckOutDate("");
  };

  const bookingSummary = tentAvailability
    .map((accommodation) => {
      const tentCount = numTents[accommodation.tent_type.name] || 0;
      return {
        name: accommodation.tent_type.name,
        pricePerTent: parseFloat(accommodation.payable_amount),
        nights: calculateNumberOfNights(),
        totalPrice: calculateTotalPrice(
          accommodation.tent_type.name,
          accommodation.payable_amount,
          tentCount,
          accommodation.tent_type.extra_person_price
        ),
        tentCount,
      };
    })
    .filter((summary) => summary.tentCount > 0);

  const totalBookingPrice = bookingSummary.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  // Create a new Date object representing the current date and time
  const today = new Date().toISOString().split("T")[0];
  const yatraOpenDate = "2024-08-26";

  const handlePersonCountChange = (id: string, delta: number) => {
    const accommodation = tentAvailability.find(
      (item) => item.tent_type.name === id
    );
    if (!accommodation) return;

    // Calculate the new count
    const newCount = (numAdditionalPersons[id] || 0) + delta;

    // Ensure the new count doesn't exceed the allowed range
    if (
      newCount >= 0 &&
      newCount <= (numTents[id] || 0) * accommodation.tent_type.capacity
    ) {
      setNumAdditionalPersons((prev) => ({
        ...prev,
        [id]: newCount,
      }));
    }
  };

  var minDate = today < yatraOpenDate ? yatraOpenDate : today;

  const handleCloseWelcomeModal = () => {
    setWelcomeTentModal(false);
  };

  return (
    <Container>
      <Box textAlign="center" marginTop={4} padding={2}>
        {welcomeTentModal && (
          <Dialog open={welcomeTentModal}>
            <WelcomeTentModal onClose={handleCloseWelcomeModal} />
          </Dialog>
        )}

        <Typography
          variant="h4" // Adjust the size as needed
          style={{
            fontFamily: "Trebuchet MS, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
            color: "#fff",
          }}
        >
          Tent Booking for Manimahesh Yatra 2024
        </Typography>
        <img
          src={manimahesh_Tent_Image}
          alt="Background"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            filter: "blur(3px)",
            zIndex: -1,
          }}
        />

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              // backgroundColor: "rgba(255, 255, 255, 0.5)", // light white overlay
              zIndex: 1,
            }}
          />
        </div>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            margin: "15px auto",
            marginTop: "40px",
            marginBottom: 50,
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontFamily: "Trebuchet MS, sans-serif",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: "#b22515",
              fontSize: "1.5rem",
            }}
          >
            Check from here
          </Typography>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Check-in Date"
              type="date"
              value={checkInDate}
              onChange={(e) => {
                setCheckInDate(e.target.value);
                setCheckOutDate(""); // Reset the checkout date
                setShowCards(false);
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: minDate,
                max: "2024-09-11",
              }}
              style={{ marginBottom: "16px" }} // Optional: Add margin for spacing
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Check-out Date"
              type="date"
              value={checkOutDate}
              onChange={(e) => {
                setCheckOutDate(e.target.value);
                setShowCards(false);
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: minCheckOutDate,
                max: "2024-09-11",
              }}
              disabled={!checkInDate} // Disable if check-in date is not selected
              style={{ marginBottom: "16px" }} // Optional: Add margin for spacing
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleCheckAvailability}
              disabled={!checkInDate || !checkOutDate}
              style={{ height: "56px" }}
              sx={{
                backgroundColor: "#b22515",
                px: 5,
                "&:hover": {
                  backgroundColor: "#e56051",
                },
              }}
            >
              Check Availability
            </Button>
          </Grid>
        </Grid>

        {showCards && (
          <Grid container columnSpacing={0} justifyContent={"center"}>
            {tentAvailability.map((accommodation) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                display={"flex"}
                justifyContent={"center"}
                key={accommodation.tent_type.id}
              >
                <Card
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    maxWidth: "500px",
                    minHeight: "400px",
                    borderRadius: "12px",
                    boxShadow:
                      hoveredCard === accommodation.tent_type.name
                        ? "0px 12px 24px rgba(0, 0, 0, 0.3)"
                        : "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    transform:
                      hoveredCard === accommodation.tent_type.name
                        ? "scale(1.03)"
                        : "scale(1)",
                  }}
                  onMouseEnter={() =>
                    setHoveredCard(accommodation.tent_type.name)
                  }
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent>
                    <Container
                      sx={{
                        backgroundColor: "#e56051",
                        height: "60px", // Adjust the height as needed
                        display: "flex",
                        alignItems: "center", // Vertically center the text
                        justifyContent: "center", // Horizontally center the text
                        borderRadius: "8px", // Optional: Add border radius for rounded corners
                        marginBottom: 5,
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          marginBottom: 0,
                          fontSize: "2rem",
                          color: "#fff",
                        }} // White text color for contrast
                      >
                        {accommodation.tent_type.name}
                      </Typography>
                    </Container>

                    <Grid container spacing={0}>
                      <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
                        <Typography
                          variant="body1"
                          style={{ marginBottom: "8px" }}
                        >
                          <strong>Capacity:</strong> Max{" "}
                          {accommodation.tent_type.capacity - 1} Persons
                        </Typography>

                        <Typography
                          variant="body1"
                          style={{ marginBottom: "8px" }}
                        >
                          <strong>Check-in Date:</strong> {formattedCheckInDate}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          <strong>Availability:</strong>
                          <Typography
                            component="span"
                            style={{ color: "red", fontWeight: "bold" }}
                          >
                            {accommodation.min_availability}
                          </Typography>
                        </Typography>

                        <Typography
                          variant="body1"
                          style={{ marginBottom: "8px" }}
                        >
                          <strong>Check-out Date:</strong>{" "}
                          {formattedCheckOutDate}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} style={{ textAlign: "left" }}>
                        <Typography
                          variant="body1"
                          style={{ color: "green", marginBottom: "8px" }}
                        >
                          <strong>Includes:</strong>{" "}
                          {accommodation.tent_type.capacity - 1} Sleeping Bags &{" "}
                          {accommodation.tent_type.capacity - 1} Carry Mats.{" "}
                          <br />
                        </Typography>
                        <Typography
                          style={{ color: "red", marginBottom: "8px", fontWeight: "bold" }}
                        >
                          <i>
                            1 Additional Person with 1 Sleeping Bag and 1 Carry Mat
                            available at extra charges of ₹ 250.
                          </i>
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{ color: "black", marginBottom: "8px" }}
                        >
                          <strong>Description:</strong> hii this is quad tent
                          booking description here. here is the description for
                          this and please read it carefully.
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
                        <Typography
                          variant="body1"
                          style={{ marginBottom: "8px" }}
                        >
                          <strong>No. of Nights:</strong>{" "}
                          {calculateNumberOfNights()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          <strong>Payable Amount / Tent:</strong> ₹
                          {accommodation.payable_amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box
                    marginTop={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginBottom: "8px" }}
                      >
                        No. of Tents Needed
                      </Typography>
                      {accommodation.min_availability > 0 ? (
                        <Box
                          display="flex"
                          alignItems="center"
                          style={{ marginBottom: "16px" }}
                        >
                          <IconButton
                            onClick={() =>
                              handleTentCountChange(
                                accommodation.tent_type.name,
                                -1
                              )
                            }
                            disabled={
                              (numTents[accommodation.tent_type.name] || 0) <= 0
                            }
                            style={{
                              borderRadius: "50%",
                              backgroundColor: "#e0e0e0",
                              margin: "0 8px",
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography
                            variant="body1"
                            style={{
                              margin: "0 16px",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            {numTents[accommodation.tent_type.name] || 0}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleTentCountChange(
                                accommodation.tent_type.name,
                                1
                              )
                            }
                            disabled={
                              (numTents[accommodation.tent_type.name] || 0) >=
                              accommodation.tent_type.max_tents
                            }
                            style={{
                              borderRadius: "50%",
                              backgroundColor: "#e0e0e0",
                              margin: "0 8px",
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography
                          variant="body1"
                          style={{ color: "red", fontWeight: "bold" }}
                        >
                          Not Available
                        </Typography>
                      )}
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginBottom: "8px" }}
                      >
                        Additional Persons
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        style={{ marginBottom: "16px" }}
                      >
                        <IconButton
                          onClick={() =>
                            handlePersonCountChange(
                              accommodation.tent_type.name,
                              -1
                            )
                          }
                          disabled={
                            (numAdditionalPersons[
                              accommodation.tent_type.name
                            ] || 0) <= 0 ||
                            (numTents[accommodation.tent_type.name] || 0) === 0
                          }
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            margin: "0 8px",
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          style={{
                            margin: "0 16px",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          }}
                        >
                          {numAdditionalPersons[accommodation.tent_type.name] ||
                            0}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handlePersonCountChange(
                              accommodation.tent_type.name,
                              1
                            )
                          }
                          disabled={
                            (numAdditionalPersons[
                              accommodation.tent_type.name
                            ] || 0) >=
                              (numTents[accommodation.tent_type.name] || 0) ||
                            (numTents[accommodation.tent_type.name] || 0) === 0
                          }
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            margin: "0 8px",
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {showCards && bookingSummary.length > 0 && (
          <Box marginTop={4} style={{ textAlign: "left" }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardContent>
                <Container
                  sx={{
                    backgroundColor: "#e56051",
                    height: "70px", // Adjust the height as needed
                    display: "flex",
                    alignItems: "center", // Vertically center the text
                    justifyContent: "center", // Horizontally center the text
                    borderRadius: "8px", // Optional: Add border radius for rounded corners
                    marginBottom: 5,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ marginBottom: 0, fontSize: "2rem", color: "#fff" }} // White text color for contrast
                  >
                    Booking Summary
                  </Typography>
                </Container>

                <Grid container spacing={2}>
                  {bookingSummary.length > 0 && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            backgroundColor: "#f9f9f9",
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {bookingSummary[0].name}
                          </Typography>
                          <Typography variant="body1">
                            <strong>No. of Tents:</strong>{" "}
                            {bookingSummary[0].tentCount}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Total Price:</strong> ₹
                            {bookingSummary[0].totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>

                      {bookingSummary.length > 1 && (
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              backgroundColor: "#f9f9f9",
                              padding: 2,
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {bookingSummary[1].name}
                            </Typography>
                            <Typography variant="body1">
                              <strong>No. of Tents:</strong>{" "}
                              {bookingSummary[1].tentCount}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Total Price:</strong> ₹
                              {bookingSummary[1].totalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>

                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginTop: "16px" }}
                >
                  Grand Total: ₹{totalBookingPrice.toFixed(2)}
                </Typography>

                <Box
                  marginTop={2}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelBooking}
                    style={{ marginRight: "8px" }}
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmBooking}
                    sx={{
                      backgroundColor: "#b22515",
                      px: 5,
                      "&:hover": {
                        backgroundColor: "#e56051",
                      },
                    }}
                  >
                    Proceed to Book
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BookTent;
