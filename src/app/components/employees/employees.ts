export class singleEmployee{
    id: number;
    first_name: string;
    second_name: string;
    email: string;
    mobile: number;
    password: string;
    gender: string;
    job_title: string;
    national_id: string;
    joining_date: any;
    profile_picture: any;
    active: number;
    position_id: number;
    team_leader_id: number;
}
export class Employees {
    id: number;
    active: number;
    type: string;
    first_name: string;
    second_name: string;
    mobile: number;
    gender: string;
    email: string;
    email_verified_at: Date;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    position_id: number;
    team_leader_id: number;
    numOfActivites: {
        calls: number;
        meetings: number;
        showings: number;
        wons: number;
    }
}
export class Employee{
    id: number;
    user_id: number;
    job_title: string;
    level_id: number;
    level: {
        created_at: Date;
        created_by: number;
        id: number;
        name: string;
        updated_at: Date;
        value: number;
    };
    points: number;
    target_flag: number;
    national_id: string;
    joining_date: Date;
    profile_picture: string;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
}