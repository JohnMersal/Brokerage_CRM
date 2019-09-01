export class UnitsModel {
    id: number;
    compound_id: number;
    unit_type: string;
    offering_type: string;
    unit_num: number;
    floor_num: number;
    unit_view: string;
    market_price: string;

    owner_name: string;
    owner_phone: number;
    owner_email: number;
    owner_facebook: string;

    land_area: string;
    building_area: string;
    garden_area: string;
    bedrooms: number;
    bathrooms: number;
    original_price: number;
    owner_price: number;
    over_price: number;
    commission_percentage: number;
    commission_value: number;
    final_price: number;
    original_downpayment: number;
    final_downpayment: number;
    unit_desc: string;
}
export class unitsList {
    id: number;
    compound_id: number;
    unit_type: string;
    unit_num: number;
    land_area: number;
    building_area: number;
    garden_area: number;
    offering_type: string;
    owner_name: string;
    owner_phone: number;
    owner_email: number;
    owner_facebook: string;
    bedrooms: number;
    bathrooms: number;
    floor_num: number;
    unit_view: number;
    unit_desc: string;
    original_price: number;
    market_price: string;
    owner_price: number;
    over_price: number;
    commission_percentage: number;
    commission_value: number;
    final_price: number;
    original_downpayment: number;
    final_downpayment: number;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
    compound: {
        id: number;
        name: string;
        address: string;
    }
}
