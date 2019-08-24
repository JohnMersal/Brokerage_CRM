export class NotificationModel {
    id: number;
    rem_date: any;
    rem_desc: string;
}
export class NotificationsList{
    id: number;
    rem_date: any;
    rem_desc: string;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: any;
    updated_at: any;
}