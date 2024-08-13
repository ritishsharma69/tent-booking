export interface PrimaryTraveler {
    yatra_application_number: string;
    name: string;
    age: number | null;
    gender: string;
    email: string;
    mobile: string;
    // dob: Date | null;
    id_type: string;
    id_number: string;
    address: string;
    total_people: number;
    // check_in_date?: string,
    // check_out_date?: string,
    // quadHouse?: number,
    // quadHousePrice?: number,
    // hexaHouse?: number,
    // hexaHousePrice?: number,
    // total_fee?: number,
    // max_person?: number
    // tents?: { tent_type_id: number; quantity: number }[];
}

export interface AdditionalTravelers {
    id: number;
    name: string;
    age: number | null;
    gender: string;
}