export class LeadsModel {
    id: number;
    first_name: string;
    second_name: string;
    project_name: string;
    country_code: number;
    lead_phone: number;
}
export class leadsList {
    id: number;
    first_name: string;
    second_name: string;
    project_name: string;
    country_code: string;
    lead_phone: number;
    lead_status: string;
    assigned_to: Person;
    reassigned_to: Person;
    reassigned_by: Person;
    created_by: Person;
    created_at: Date;
    updated_at: Date;
}
export class Person{
    id: number;
    first_name: string;
    second_name: string;
}