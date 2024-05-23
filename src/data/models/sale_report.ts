export interface SaleReport {
    total:        number;
    per_method:   PerMethod[];
    quantitySold: number;
    debt:         number;
}

export interface PerMethod {
    method: null | string;
    value:  number;
    date:   string;
}
