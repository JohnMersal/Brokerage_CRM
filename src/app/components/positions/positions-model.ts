export class PositionModel {
    id: number;
    name: string;
    target_commission_monthly: number;
    target_commission_quarterly: number;
    target_commission_yearly: number;
    target_sales_monthly: number;
    target_sales_quarterly: number;
    target_sales_yearly: number;
}
export class PositionList{
    id: number;
    name: string;
    target_commission_monthly: number;
    target_commission_quarterly: number;
    target_commission_yearly: number;
    target_sales_monthly: number;
    target_sales_quarterly: number;
    target_sales_yearly: number;
    created_at: Date;
    updated_at: Date;
}