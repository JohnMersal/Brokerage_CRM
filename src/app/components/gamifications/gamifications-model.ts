export class FixedPointsModel {
    id: number;
    action: string;
    fixed_points: number;
}
export class HappyHourUpdateModel{
    id: number;
    call_HappyHour_points: number;
    meeting_HappyHour_points: number;
    won_HappyHour_points: number;
    happy_start: any;
    happy_end: any;
}
export class HappyHoursModel{
    id: number;
    action: string;
    happy_points: number;
    happy_start: any;
    happy_end: any;
}
export class TargetPointUpdateModel {
    id: number;
    call_target_value: number;
    meeting_target_value: number;
    won_target_value: number;
    showing_target_value: number;
    target_start: any;
    target_end: any;
    target_points: number;
}
export class TargetPointsModel{
    id: number;
    action: string;
    target_value: number;
    target_points: number;
    target_start: any;
    target_end: any;
    created_by: {
        id: number;
        first_name: string;
        second_name: string;
    };
    created_at: Date;
    updated_at: Date;
}
export class Formula{
    formula_start: any;
    formula_end: any;
}