import React from "react";
import { Container, Typography, Paper, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

interface ServicesAndCancellationPageProps {
  onClose: () => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minHeight: "60vh",
  maxHeight: "80vh",
  overflowY: "auto",
  "@media (max-width: 600px)": {
    maxHeight: "90vh",
    minHeight: "auto",
    padding: theme.spacing(2),
  },
}));

const Heading = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "#e56051",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  "@media (max-width: 600px)": {
    fontSize: "1.5rem",
  },
}));

const SubHeading = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "#e56051",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
}));

const TermsAndConditions: React.FC<ServicesAndCancellationPageProps> = ({
  onClose,
}) => {
  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <StyledPaper>
        <div style={{ position: "absolute", top: 2, right: 40 }}>
          <div style={{ position: "fixed" }}>
            <IconButton onClick={onClose} color="inherit" aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <Box textAlign="center" mb={3}>
          <Heading variant="h4" gutterBottom>
            General Instructions for Travelers And Cancellation & Refund Policy
          </Heading>
        </Box>

        <Box mb={3}>
          <SubHeading textAlign="center" variant="h5" gutterBottom>
            General Instructions for Travelers
          </SubHeading>



          <Typography variant="body1" paragraph>
            • The customer is responsible for any damage or loss to the tent, sleeping bags, or other equipment during the rental period. Charges for repair or replacement will be applied if necessary.
          </Typography>

        </Box>

        <Box textAlign="center" mb={3}>
          <SubHeading variant="h5" gutterBottom>
            Cancellation & Refund Policy
          </SubHeading>
          <Box textAlign="left" mb={3} mx="auto">

            <Typography variant="body1" paragraph>
              • No Refunds: All payments, including deposits, are non-refundable under any circumstances. This policy applies to cancellations, changes, or no-shows.
            </Typography>
            <Typography variant="body1" paragraph>
              • We do not provide refunds or compensation for adverse weather conditions. In case of severe weather warnings, we may offer rescheduling options.
            </Typography>

            <Typography variant="body1" paragraph>
              • In case of cancellation
              .
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default TermsAndConditions;
