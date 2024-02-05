export class Timesheet {
  constructor(
    public id: number,
    public description: string,
    public time: number,
    public overTime: number,
    public date: string,
    public clientId: number,
    public projectId: number,
    public categoryId: number
  ) {}
}
export class TimesheetDTO {
  constructor(
    public id: number,
    public description: string,
    public time: number,
    public overTime: number,
    public date: string,
    public clientName: string,
    public projectName: string,
    public categoryName: string
  ) {}
}
