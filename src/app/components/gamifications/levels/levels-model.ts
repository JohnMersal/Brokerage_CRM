export class LevelModel {
    id: number;
    name: string;
    value: number;
}
export class levelsList{
    id: number;
    name: string;
    value: number;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
}