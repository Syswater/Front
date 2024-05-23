export interface ExpenseReport {
    total:        number;
    per_category: PerCategory[];
}

export interface PerCategory {
    category: Category;
    value:    number;
}

export interface Category {
    id:   number;
    type: string;
}