interface IAlert {
    id: number;
    type: string;
    message: string;
    date: string;
    priority: string;
    employeeID: number; // Thêm trường employeeID
}

export type { IAlert};