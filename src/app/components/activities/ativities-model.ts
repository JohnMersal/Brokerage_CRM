export class ActivityModel{
    id: number;
    client_id: number;
    activity_type: string; //Call or Meeting
    activity_status: string; //Ongoing, Won or Lost
    feedback: string;
    activity_date: any;
}
export class AtivitiesListModel {
    id: number;
    client_id: number;
    activity_type: string; //Call or Meeting
    activity_status: string; //Ongoing, Won or Lost
    feedback: string;
    activity_date: Date;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
    client_data: {
        id: number;
        first_name: string;
        second_name: string;
    };
}
export class ActivityClient{
    id: number;
    client_id: number;
    activity_type: string; // Call or Meeting
    activity_status: string; // Ongoing, Won or Lost
    feedback: string;
    activity_date: any;
    unit_id: number;
    type_of_sale: string; // internal, external, or primary
}
