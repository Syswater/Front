import { ContainerReport } from "./container_report";
import { ExpenseReport } from "./expense_report";
import { SaleReport } from "./sale_report";

export interface DistributionReport {
    saleReport:      SaleReport;
    expenseReport:   ExpenseReport;
    balance:         number;
    containerReport: ContainerReport;
    load:            number;
}