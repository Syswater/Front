export interface TransactionPayment {
    id:             number;
    date:           Date;
    value:          number;
    type:           string;
    payment_method: string;
    total:          number;
    user_id:        number;
    customer_id:    number;
    user_name:      string;
}