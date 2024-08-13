import { PrimaryTraveler, AdditionalTravelers } from "../formComponent/types";
export interface TentType {
  id: number;
  name: string;
  capacity: number;
  max_tents: number;
  default_rate: string;
  created_at: string;
  updated_at: string;
}
export type DailyAvailability = Record<string, number>;
export type Rates = Record<string, string>;
export interface TentData {
  tent_type: TentType;
  daily_availability: DailyAvailability;
  rates: Rates;
  min_availability: number;
  payable_amount: number;
}

export interface OtpResponseData {
    action: string;
    [key: string]: any;
  }

export interface TentContextProps {
    primaryTraveler: PrimaryTraveler;
    travelers: AdditionalTravelers[];
    setTravelers: React.Dispatch<React.SetStateAction<AdditionalTravelers[]>>;
    setPrimaryTraveler: React.Dispatch<React.SetStateAction<PrimaryTraveler>>;
    additionalTravelersCount: number;
    setAdditionalTravelersCount: React.Dispatch<React.SetStateAction<number>>;
    bookingId: number | null;
    setBookingId: React.Dispatch<React.SetStateAction<number | null>>;
    otpResponseData: OtpResponseData | null;
    setOtpResponseData: React.Dispatch<
      React.SetStateAction<OtpResponseData | null>
    >;
    total_people: number;
    baseUrl: string;
    // total_fee: number;
    tentBookingSummary: BookingSummary | null;
    setTentBookingSummary: React.Dispatch<React.SetStateAction<BookingSummary | null>>;
    max_person: number;
    apiData: TentData[];
}

interface TentItem {
  tent_type_id: number;
  quantity: number;
}

export interface BookingSummary {
  check_in_date: string;
  check_out_date: string;
  quadHouse: number;
  hexaHouse: number;
  max_person: number;
  total_fee: number;
  tents: TentItem[];
}