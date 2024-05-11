export interface Transaction {
    id:                   number;
    date:                 Date;
    value:                number;
    type:                 string;
    total:                number;
    customer_id:          number;
    user_id:              number;
    product_inventroy_id: number;
}
