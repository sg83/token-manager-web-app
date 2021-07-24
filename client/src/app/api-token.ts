
export interface ApiToken {
    _id: string;
    status: TokenStatus
    createdAt: Date
    validTo: Date;
    name: string;
    description: string;
}

export enum TokenStatus {
    Inactive = 0,
    Active = 1,
}

