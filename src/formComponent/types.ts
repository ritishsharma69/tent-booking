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
}

export interface AdditionalTravelers {
    id: number;
    name: string;
    age: number | null;
    gender: string;
}