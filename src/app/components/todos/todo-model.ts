export class TodoModel {
    id: number;
    todo_desc: string;
    todo_status: string;
    assigned_to: number;
    todo_date: any;
    start_date: any;
    end_date: any;
}
export class Calendar{
    text: string;
    employeeID: number;
    startDate: Date;
    endDate: Date;
    assigned_to: number;
    todo_desc: string;
    todo_status: string;
}
export class TodosList{
    id: number;
    todo_desc: string;
    todo_status: string;
    assigned_to: {
        id: number;
        first_name: string;
        second_name: string;
    };
    todo_date: any;
    start_date: any;
    end_date: any;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
}