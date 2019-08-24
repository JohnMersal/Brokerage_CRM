export class CompoundModel {
    id: number;
    area_id: number;
    name: string;
    address: string;
}
export class CompoundsList {
    id: number;
    name: string;
    address: string;
    area: {
        id: number;
        name: string;
        address: string;
    };
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    }
    created_at: Date;
    updated_at: Date;
}