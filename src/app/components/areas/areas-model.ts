export class AreasModel {
    id: number;
    name: string;
    address: string;
}
export class AreasList{
    id: number;
    name: string;
    address: string;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
    user: {
        id: number;
        first_name: string;
        second_name: string;
    }
}