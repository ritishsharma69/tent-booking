import * as Yup from "yup";

export const yatraApplicationNumberValidation = Yup.string().min(
  13,
  "Registration No. have 13 character."
);
export const nameValidation = Yup.string()
  .min(3, "Name must be at least 3 characters long")
  .max(20, "Name cannot be longer than 30 characters")
  .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces")
  .required("Required");
export const ageValidation = Yup.number()
  .nullable()
  .positive("Age must be positive")
  .integer("Age must be an integer")
  .required("Required");
export const genderValidation = Yup.string()
  .oneOf(["Male", "Female", "Other"], "Invalid gender")
  .required("Required");
export const emailValidation = Yup.string()
  .email("Invalid email format");
export const phoneValidation = Yup.string()
  .matches(
    /^[9876]\d{9}$/,
    "Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits"
  )
  .test(
    "is-not-generic",
    "Phone number is not valid",
    (value) =>
      value !== undefined &&
      ![
        "9876543210",
        "8888888888",
        "9999999999",
        "7777777777",
        "6666666666",
      ].includes(value)
  )
  .required("Phone number is required");
export const dateOfBirthValidation = Yup.date()
  .required("Date of Birth is required")
  .max(new Date(), "Date of Birth cannot be in the future");
export const idTypeValidation = Yup.string()
  .oneOf(["Aadhar Card", "Driver License", "Pan Card"], "Invalid ID Type")
  .required("Required");

const validateIdNumber = (id_type: string, id_number: string) => {
  const isNumeric = (str: string) => /^[0-9]+$/.test(str);
  const isAlphanumeric = (str: string) => /^[A-Za-z0-9]+$/.test(str);
  switch (id_type) {
    case "Aadhar Card":
      if (id_number.length !== 4) {
        return "Aadhar number must be exactly 4 digits";
      }
      if (!isNumeric(id_number)) {
        return "Aadhar number must contain only digits";
      }
      break;
    case "Driver License":
      if (id_number.length !== 15) {
        return "Driver license number should be 15 characters";
      }
      if (!isAlphanumeric(id_number)) {
        return "Driver license number must contain only letters and digits";
      }
      break;
    case "Pan Card":
      if (id_number.length !== 10) {
        return "PAN card number must be exactly 10 characters";
      }
      if (!isAlphanumeric(id_number)) {
        return "PAN card number must contain only letters and digits";
      }
      break;
    default:
      return "Invalid ID Type";
  }
  return null;
};

// Create a custom Yup validation method
const customIdNumberValidation = Yup.string().test(
  "id_number",
  "ID number is invalid",
  function (value) {
    const { id_type } = this.parent;
    const error = validateIdNumber(id_type, value || "");
    return error === null || this.createError({ message: error });
  }
);

export const addressValidation = Yup.string()
  .min(5, "Address must be at least 5 characters long")
  .max(100, "Address cannot be longer than 50 characters")
  .required("Required");
export const termsAndConditionsValidation = Yup.boolean()
  .oneOf([true], "You must accept the Terms & Conditions")
  .required("Required");

export const primaryTravelerSchemas = Yup.object().shape({
  yatra_application_number: yatraApplicationNumberValidation,
  name: nameValidation,
  age: ageValidation,
  gender: genderValidation,
  email: emailValidation,
  mobile: phoneValidation,
//   dob: dateOfBirthValidation,
  id_type: idTypeValidation,
  id_number: customIdNumberValidation,
  address: addressValidation,
  terms_and_conditions: termsAndConditionsValidation,
  additionalTravelers: Yup.array().of(
    Yup.object().shape({
      name: nameValidation,
      age: ageValidation,
      gender: genderValidation,
    })
  ),
});
