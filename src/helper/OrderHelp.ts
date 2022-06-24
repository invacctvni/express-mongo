export enum OrderStatusCode {
    PENDING = 1,
    COMPLETED = 2,
    CANCEL = 3
}
export enum PaymentStatusCode {
    PENDING = 1,
    COMPLETED = 2,
    CANCEL = 3
}

export enum OrderStatusStr {
    PENDING = "pending",
    COMPLETED = "Completed",
    CANCEL = "cancel"
}

export enum OrderMode {
    HALF_YEAR = 'half-year',
    ONE_YEAR = 'one-year',
    ALL = 'all'
}