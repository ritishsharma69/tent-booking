import React, { useState, useEffect } from "react";
import { useFormik, FormikProvider, FormikErrors } from "formik";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  Dialog,
  Typography,
} from "@mui/material";
import axios from "axios";
import { primaryTravelerSchemas } from "./ValidationSchema";
import { useTentContext } from "../store/Store";
import { AdditionalTravelers } from "./types";
import BookingDetails from "./BookingDetails";
import TermsAndConditions from "../modalComponent/TermsAndConditions";
import PhoneVerifyModel from "../modalComponent/PhoneVerifyModal";
import ReceiptModal from "../modalComponent/ReceiptModal";
import { conf } from "../conf/conf";

const TentForm: React.FC = () => {
  const [receiptModal, setReceiptModal] = useState<boolean>(false);
  const [termsAndConditionsModal, setTermsAndConditionsModal] =
    useState<boolean>(false);
  const [phoneVerifyModal, setPhoneVerifyModal] = useState<boolean>(false);
  const [isXs, setIsXs] = useState(window.innerWidth <= 992);
  const { baseUrl } = conf;

  useEffect(() => {
    const handleResize = () => {
      setIsXs(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    primaryTraveler,
    setPrimaryTraveler,
    travelers,
    setTravelers,
    additionalTravelersCount,
    setAdditionalTravelersCount,
    max_person,
    setBookingId,
    tentBookingSummary,
  } = useTentContext();

  const handleSubmit = async (values: any) => {
    console.log("Form values on submit:", values);
    await formik.validateForm();
    setPrimaryTraveler({
      ...values,
    });
    setTravelers(values.additionalTravelers);
    console.log("Updated primaryTraveler:", primaryTraveler);
    console.log("Updated additionalTravelersCount:", additionalTravelersCount);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await handleBooking();
  };

  const formik = useFormik({
    initialValues: {
      ...primaryTraveler,
      additionalTravelers: travelers,
      terms_and_conditions: false,
    },
    validationSchema: primaryTravelerSchemas,
    onSubmit: handleSubmit,
  });

  const handleBooking = async () => {
    const url = `${baseUrl}/tent/application`;
    const data = {
      primaryTraveler: {
        ...primaryTraveler,
        people: travelers,
        ...tentBookingSummary,
      },
    };
    try {
      console.log("helo helo", data);

      const response = await axios.post(url, data.primaryTraveler);
      console.log("Response Ha", response.data);
      if (response.data.message === "Tent application stored successfully.") {
        const booking_id: number = response.data.data.id;
        setBookingId(booking_id);
        setPhoneVerifyModal(true);
        console.log(booking_id);
      } else {
        console.log("Error");
      }
    } catch (error: any) {
      if (error.response.data.message) {
        setReceiptModal(true);
      } else {
        console.error("Error:", error.message.errors);
      }
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setAdditionalTravelersCount(value);
    console.log("Updated additional travelers count:", value);
  };

  useEffect(() => {
    formik.setValues((prev) => ({
      ...prev,
      additionalTravelers: Array.from(
        { length: additionalTravelersCount },
        (_, i) =>
          prev.additionalTravelers[i] || {
            name: "",
            age: "",
            gender: "",
          }
      ),
    }));
  }, [additionalTravelersCount]);

  useEffect(() => {
    setTravelers(formik.values.additionalTravelers);
  }, [formik.values.additionalTravelers]);

  useEffect(() => {
    setPrimaryTraveler({
      ...formik.values,
      total_people: additionalTravelersCount + 1,
    });
  }, [formik.values, additionalTravelersCount]);

  const handleResetForm = () => {
    formik.resetForm();
    setTravelers([]);
    setAdditionalTravelersCount(0);
  };

  const getError = (field: keyof AdditionalTravelers, index: number) => {
    const errorsArray = formik.errors.additionalTravelers as
      | FormikErrors<AdditionalTravelers>[]
      | undefined;
    const error = errorsArray?.[index];
    return error ? error[field] : undefined;
  };

  const getIdNumberPlaceholder = (idType: string) => {
    let placeholder: string;

    switch (idType) {
      case "Aadhar Card":
        placeholder = "Enter last 4 digits";
        break;
      case "Driver License":
        placeholder = "Enter driver license number";
        break;
      case "Pan Card":
        placeholder = "Enter PAN card number";
        break;
      default:
        placeholder = "Enter ID number";
        break;
    }

    return placeholder;
  };

  const termsAndConditionsOpen = () => {
    setTermsAndConditionsModal(true);
  };

  const handleTermsAndConductionClose = () => {
    setTermsAndConditionsModal(false);
  };

  const handlePhoneVerifyClose = () => {
    setPhoneVerifyModal(false);
  };

  const handleReceiptModalClose = () => {
    setReceiptModal(false);
  };

  return (
    <div>
      <Container>
        <Grid>
          <BookingDetails />
        </Grid>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid mb={2}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  background: "#a81f10",
                  color: "#fff",
                  marginBottom: "16px",
                  marginTop: "20px",
                  borderRadius: 2,
                  padding: 1,
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.55rem",
                    md: "1.75rem",
                  },
                }}
              >
                Primary Traveler Details
              </Typography>
              {/* <Grid
                container
                mt={-2.5}
                borderTop={3}
                borderColor="#991a0c"
              ></Grid> */}
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="yatra_application_number"
                  name="yatra_application_number"
                  // label="Yatra Application Number"
                  label="Yatra Registration No."
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  value={formik.values.yatra_application_number}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "yatra_application_number",
                      e.target.value.toUpperCase()
                    );
                  }}
                  error={
                    formik.touched.yatra_application_number &&
                    Boolean(formik.errors.yatra_application_number)
                  }
                  helperText={
                    formik.touched.yatra_application_number &&
                    formik.errors.yatra_application_number
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={
                    <span>
                      Name <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label={
                    <span>
                      Age <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  type="text"
                  value={formik.values.age}
                  onChange={(e) => {
                    const formattedValue = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("age", formattedValue);
                  }}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    {
                      <span
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Gender <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    id="gender"
                    name="gender"
                    label="Gender  "
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formik.touched.gender && Boolean(formik.errors.gender) && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "14px",
                      }}
                    >
                      {formik.errors.gender}
                    </div>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label={<span>Email</span>}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="text"
                  fullWidth
                  id="mobile"
                  name="mobile"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  label={
                    <span>
                      Phone Number <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={formik.values.mobile}
                  onChange={(e) => {
                    const formattedValue = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("mobile", formattedValue);
                  }}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    {
                      <span
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        ID Type <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    id="id_type"
                    name="id_type"
                    label="ID Type"
                    value={formik.values.id_type}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.id_type && Boolean(formik.errors.id_type)
                    }
                  >
                    <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                    <MenuItem value="Pan Card">Pan Card</MenuItem>
                    <MenuItem value="Driver License">Driver License</MenuItem>
                  </Select>
                  {formik.touched.id_type && Boolean(formik.errors.id_type) && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "14px",
                      }}
                    >
                      {formik.errors.id_type}
                    </div>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="id_number"
                  name="id_number"
                  label={
                    <span>
                      ID Number <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  placeholder={getIdNumberPlaceholder(formik.values.id_type)}
                  value={formik.values.id_number}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "id_number",
                      e.target.value.toUpperCase()
                    );
                  }}
                  error={
                    formik.touched.id_number && Boolean(formik.errors.id_number)
                  }
                  helperText={
                    formik.touched.id_number && formik.errors.id_number
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label={
                    <span>
                      Address <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "black",
                      fontWeight: "700",
                      fontSize: "18px",
                    },
                  }}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  rows={2}
                  multiline
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              <Grid item xs={12}>
                <Box className="travelers-count" sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <span
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Additional Travelers{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </InputLabel>
                    <Select
                      value={additionalTravelersCount}
                      onChange={handleSelectChange}
                      label="Additional Travelers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                      defaultValue={max_person}
                      disabled={!(max_person === 0)}
                    >
                      {Array.from({ length: max_person }, (_, i) => (
                        <MenuItem key={i} value={i}>
                          {i === 0 ? "Only me" : i}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Additional Travelers Title */}
              {additionalTravelersCount > 0 && (
                <Grid container ml={2} mt={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#991a0c",
                        marginBottom: "16px",
                        fontWeight: "bold",
                        fontSize: {
                          xs: "1.5rem",
                          sm: "1.75rem",
                          md: "2rem",
                        },
                      }}
                    >
                      Additional Travelers Details
                    </Typography>
                    <Grid
                      container
                      mt={-2.5}
                      borderTop={3}
                      borderColor="#991a0c"
                      borderRadius="20px"
                    ></Grid>
                  </Grid>
                </Grid>
              )}

              {additionalTravelersCount > 0 && (
                <Grid item xs={12}>
                  {isXs ? (
                    // Render single input fields for small screens
                    formik.values.additionalTravelers.map((traveler, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <h3
                          style={{
                            color: "#991a0c",
                            fontSize: "20px",
                            marginTop: "4px",
                            marginBottom: "-5px",
                          }}
                        >
                          Traveler {index + 1}
                        </h3>
                        <TextField
                          fullWidth
                          label={
                            <span>
                              Name <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "black",
                              fontWeight: "700",
                              fontSize: "18px",
                            },
                          }}
                          id={`additionalTravelers.${index}.name`}
                          name={`additionalTravelers.${index}.name`}
                          value={traveler.name}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.additionalTravelers?.[index]?.name &&
                            Boolean(getError("name", index))
                          }
                          helperText={
                            formik.touched.additionalTravelers?.[index]?.name &&
                            getError("name", index)
                          }
                        />
                        <TextField
                          fullWidth
                          label={
                            <span>
                              Age <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "black",
                              fontWeight: "700",
                              fontSize: "18px",
                            },
                          }}
                          id={`additionalTravelers.${index}.age`}
                          name={`additionalTravelers.${index}.age`}
                          type="text"
                          value={traveler.age}
                          onChange={(e) => {
                            const formattedValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            formik.setFieldValue(
                              `additionalTravelers.${index}.age`,
                              formattedValue
                            );
                          }}
                          error={
                            formik.touched.additionalTravelers?.[index]?.age &&
                            Boolean(getError("age", index))
                          }
                          helperText={
                            formik.touched.additionalTravelers?.[index]?.age &&
                            getError("age", index)
                          }
                        />
                        <FormControl fullWidth>
                          <InputLabel
                            id={`additionalTravelers-${index}-gender-label`}
                          >
                            {
                              <span
                                style={{
                                  color: "black",
                                  fontWeight: "700",
                                  fontSize: "18px",
                                }}
                              >
                                Gender <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          </InputLabel>
                          <Select
                            id={`additionalTravelers.${index}.gender`}
                            name={`additionalTravelers.${index}.gender`}
                            labelId={`additionalTravelers-${index}-gender-label`}
                            value={traveler.gender}
                            onChange={formik.handleChange}
                            label={`Gender`}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                          {formik.touched.additionalTravelers?.[index]
                            ?.gender &&
                            Boolean(getError("gender", index)) && (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "12px",
                                  marginLeft: "14px",
                                }}
                              >
                                {getError("gender", index)}
                              </div>
                            )}
                        </FormControl>
                      </div>
                    ))
                  ) : (
                    // Render table for larger screens
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead style={{ background: "#E56051" }}>
                          <TableRow>
                            <TableCell
                              sx={{ width: 10 }}
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              Sr. No.
                            </TableCell>
                            <TableCell
                              sx={{ width: 150 }}
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {
                                <span>
                                  Name<span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            </TableCell>
                            <TableCell
                              sx={{ width: 80 }}
                              style={{ color: "white" }}
                            >
                              {
                                <span>
                                  Age<span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            </TableCell>
                            <TableCell
                              sx={{ width: 100 }}
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {
                                <span>
                                  Gender<span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formik.values.additionalTravelers.map(
                            (traveler, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label="Name"
                                    sx={{
                                      "& .MuiInputLabel-root": {
                                        color: "black",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                      },
                                    }}
                                    id={`additionalTravelers.${index}.name`}
                                    name={`additionalTravelers.${index}.name`}
                                    value={traveler.name}
                                    onChange={formik.handleChange}
                                    error={
                                      formik.touched.additionalTravelers?.[
                                        index
                                      ]?.name &&
                                      Boolean(getError("name", index))
                                    }
                                    helperText={
                                      formik.touched.additionalTravelers?.[
                                        index
                                      ]?.name && getError("name", index)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label="Age"
                                    sx={{
                                      "& .MuiInputLabel-root": {
                                        color: "black",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                      },
                                    }}
                                    id={`additionalTravelers.${index}.age`}
                                    name={`additionalTravelers.${index}.age`}
                                    type="text"
                                    value={traveler.age}
                                    onChange={(e) => {
                                      const formattedValue =
                                        e.target.value.replace(/\D/g, "");
                                      formik.setFieldValue(
                                        `additionalTravelers.${index}.age`,
                                        formattedValue
                                      );
                                    }}
                                    error={
                                      formik.touched.additionalTravelers?.[
                                        index
                                      ]?.age && Boolean(getError("age", index))
                                    }
                                    helperText={
                                      formik.touched.additionalTravelers?.[
                                        index
                                      ]?.age && getError("age", index)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel
                                      style={{
                                        color: "black",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                      }}
                                      id={`additionalTravelers-${index}-gender-label`}
                                    >
                                      Gender
                                    </InputLabel>
                                    <Select
                                      id={`additionalTravelers.${index}.gender`}
                                      name={`additionalTravelers.${index}.gender`}
                                      labelId={`additionalTravelers-${index}-gender-label`}
                                      value={traveler.gender}
                                      onChange={formik.handleChange}
                                      label="Gender"
                                    >
                                      <MenuItem value="Male">Male</MenuItem>
                                      <MenuItem value="Female">Female</MenuItem>
                                      <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                    {formik.touched.additionalTravelers?.[index]
                                      ?.gender &&
                                      Boolean(getError("gender", index)) && (
                                        <div
                                          style={{
                                            color: "red",
                                            fontSize: "12px",
                                            marginLeft: "14px",
                                          }}
                                        >
                                          {getError("gender", index)}
                                        </div>
                                      )}
                                  </FormControl>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 2,
                  width: "100%",
                  "@media (min-width: 600px)": {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flex: 1,
                    ml: 2,
                    "@media (min-width: 600px)": {
                      width: "50%",
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="terms_and_conditions"
                        name="terms_and_conditions"
                        color="primary"
                        checked={formik.values.terms_and_conditions}
                        onChange={formik.handleChange}
                      />
                    }
                    label={
                      <div>
                        I accept the{" "}
                        <span
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              termsAndConditionsOpen();
                            }}
                          >
                            Terms & Conditions
                          </span>
                        </span>{" "}
                      </div>
                    }
                  />
                  {formik.touched.terms_and_conditions &&
                    Boolean(formik.errors.terms_and_conditions) && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "30px",
                          marginTop: "-20px",
                        }}
                      >
                        {formik.errors.terms_and_conditions}
                      </div>
                    )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    flex: 1,
                    justifyContent: "flex-end",
                    "@media (min-width: 600px)": {
                      width: "50%",
                    },
                  }}
                >
                  <Button
                    onClick={handleResetForm}
                    sx={{
                      border: "1px solid transparent",
                      color: "#a6a6a6",
                      backgroundColor: "#e5e5e5",
                      px: 2,
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      "&:hover": {
                        borderColor: "transparent",
                        backgroundColor: "darkgray",
                        color: "white",
                      },
                    }}
                  >
                    Reset Form
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!formik.values.terms_and_conditions}
                    sx={{
                      backgroundColor: "#b22515",
                      px: 5,
                      "&:hover": {
                        backgroundColor: "#e56051",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Grid>
          </form>
        </FormikProvider>
        <Dialog open={receiptModal} onClose={handleReceiptModalClose}>
          <ReceiptModal mobile={primaryTraveler.mobile} />
        </Dialog>
        <Dialog open={phoneVerifyModal}>
          <PhoneVerifyModel
            mobile={primaryTraveler.mobile}
            onClose={handlePhoneVerifyClose}
          />
        </Dialog>
        <Dialog open={termsAndConditionsModal}>
          <TermsAndConditions onClose={handleTermsAndConductionClose} />
        </Dialog>
      </Container>
    </div>
  );
};

export default TentForm;
