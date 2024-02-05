import { Timesheet } from "@/app/models/timesheet";
import { Session } from "next-auth";
export const GetTimesheets = async (
  pageNumber: number,
  pageSize: number,
  session: Session
) => {
  let options = {
    headers: {
      "Content-Type": "Application/json",
      authorization: `Bearer ${session.user.token}`,
    },
    method: "GET",
  };
  return await fetch(
    `http://localhost:29468/api/Timesheets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    options
  );
};
export const PostTimesheet = async (timesheet: Timesheet, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "Application/json",
      authorization: `Bearer ${session.user.token}`,
    },
    method: "POST",
    body: JSON.stringify(timesheet),
  };
  return await fetch("http://localhost:29468/api/Timesheets", options);
};
