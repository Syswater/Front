import { TransactionContainer } from "./transactionContainer";
import { TransactionPayment } from "./transactionPayment";

export interface Pagination {
    currentPage: number;
    items:       TransactionContainer[] | TransactionPayment[];
    size:        number;
    totalPages:  number;
}