export interface ContainerReport {
    total_borrowed: number;
    total_returned: number;
    total_broken:   number;
    per_type:       PerType[];
}

export interface PerType {
    id:           number;
    product_name: string;
    type:         string;
    value:        number;
}
