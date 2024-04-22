export interface Presale {
    id: number,
    amount: number,
    date: Date,
    tape_type: "SERVIFACIL" | "NORMAL",
    customer_id: number,
    distribution_id: number
}
