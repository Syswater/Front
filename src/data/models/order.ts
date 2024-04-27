export interface Order {
    id: number;
    amount: number;
    date: Date;
    tape_type: string;
    customer_id: number;
    distribution_id: number;
}
