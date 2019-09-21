export class ClientsModel {
    id: number;
    first_name: string;
    second_name: string;
    email: string;
    mobile: number;
    gender: string;
    budget_from: number;
    budget_to: number;
    request_type: string;// Buy, Sale, Rent
}
export class ClientsList {
    id: number;
    first_name: string;
    second_name: string;
    gender: string;;
    active: number;
    type: string;
    mobile: number;
    email: string;
    email_verified_at: Date;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    user_id: number;
    request_type: string;
    budget_from: number;
    budget_to: number;
}