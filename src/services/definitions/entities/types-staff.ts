export interface IStaffPage {
    totalRecords: number;
    entityList: Array<IStaffRow>;
}

export interface IStaffRow {
    id: number,
    firstName: string,
    username: string,
    roleId: number,
    created: Date,
    cell: number,
    avatarPath: string
}
