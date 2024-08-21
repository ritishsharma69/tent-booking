import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  TentContextProps,
  OtpResponseData,
  BookingSummary,
  TentData,
} from "./types";
import { PrimaryTraveler, AdditionalTravelers } from "../formComponent/types";
import axios from "axios";

const TentContext = createContext<TentContextProps | undefined>(undefined);

export const TentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const baseUrl = "https://manimahesh.netgen.work/api";
  const [apiData, setApiData] = useState<TentData[]>([]);
  const [tentBookingSummary, setTentBookingSummary] = useState<BookingSummary | null>(
    null
  );
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [otpResponseData, setOtpResponseData] =
    useState<OtpResponseData | null>(null);
  const [additionalTravelersCount, setAdditionalTravelersCount] =
    useState<number>(0);
  const [travelers, setTravelers] = useState<AdditionalTravelers[]>([]);

const [primaryTraveler, setPrimaryTraveler] = useState<PrimaryTraveler>({
    yatra_application_number: "",
    name: "",
    age: 0,
    gender: "",
    email: "",
    mobile: "",
    id_type: "",
    id_number: "",
    address: "",
    total_people: additionalTravelersCount + 1,
  });
  

  useEffect(() => {
    console.log('Booking Summary:', tentBookingSummary);
    console.log('Additional Travelers Count:', additionalTravelersCount);

    if (tentBookingSummary) {
      setPrimaryTraveler((prev) => ({
        ...prev,
        total_people: additionalTravelersCount + 1,
      }));
    }
  }, [tentBookingSummary, additionalTravelersCount]);

  const max_person = tentBookingSummary?.max_person ?? 0;
  useEffect(() => {
    if (max_person > 0) {
      setAdditionalTravelersCount(max_person - 1);
    }
  }, [max_person]);

  return (
    <TentContext.Provider
      value={{
        primaryTraveler,
        travelers,
        setTravelers,
        setPrimaryTraveler,
        additionalTravelersCount,
        setAdditionalTravelersCount,
        bookingId,
        setBookingId,
        otpResponseData,
        setOtpResponseData,
        total_people: primaryTraveler.total_people,
        // baseUrl,
        tentBookingSummary,
        setTentBookingSummary,
        max_person: tentBookingSummary?.max_person ?? 0,
        apiData,
      }}
    >
      {children}
    </TentContext.Provider>
  );
};

// Custom hook to use the context
export const useTentContext = (): TentContextProps => {
  const context = useContext(TentContext);
  if (!context) {
    throw new Error("useTentContext must be used within a TentProvider");
  }
  return context;
};
