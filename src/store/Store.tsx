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
  const baseUrl = "https://manimahesh.netgen.work/api";
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

    // check_in_date: bookingSummary?.check_in_date || "2024-08-20",
    // check_out_date: bookingSummary?.check_out_date || "2024-08-21",
    // quadHouse: bookingSummary?.quadHouse || 0,
    // hexaHouse: bookingSummary?.hexaHouse || 0,
    // total_fee: bookingSummary?.total_fee || 0,
    // max_person: bookingSummary?.max_person || 0,
    // tents: bookingSummary?.tents || [
    //   { tent_type_id: 1, quantity: 2 },
    //   { tent_type_id: 2, quantity: 2 },
    // ],
  });
  

  useEffect(() => {
    console.log('Booking Summary:', tentBookingSummary);
    console.log('Additional Travelers Count:', additionalTravelersCount);

    if (tentBookingSummary) {
      setPrimaryTraveler((prev) => ({
        ...prev,
        // check_in_date: bookingSummary.check_in_date,
        // check_out_date: bookingSummary.check_out_date,
        // quadHouse: bookingSummary.quadHouse,
        // hexaHouse: bookingSummary.hexaHouse,
        // total_fee: bookingSummary.total_fee,
        // max_person: bookingSummary.max_person,
        total_people: additionalTravelersCount + 1,
        // tents: [
        //   {
        //     tent_type_id: 1,
        //     quantity: 2,
        //   },
        //   {
        //     tent_type_id: 2,
        //     quantity: 2,
        //   },
        // ],
      }));
    }
  }, [tentBookingSummary, additionalTravelersCount]);

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
        baseUrl,
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