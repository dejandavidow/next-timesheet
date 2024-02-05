"use client";

import { useEffect, useState } from "react";
import { GetTimesheets } from "../service/timesheetservice";
import { useSession } from "next-auth/react";
import { Table, Pagination, Spinner } from "react-bootstrap";
import { TimesheetDTO } from "@/app/models/timesheet";
import { redirect } from "next/navigation";

function Preview() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/timesheets/preview");
    },
  });
  const [timesheets, setTimesheets] = useState<TimesheetDTO[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [active, setActive] = useState(1);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (session?.user)
      GetTimesheets(pageNumber, 5, session)
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              setLoaded(true);
              let paginationData: PaginationModel = JSON.parse(
                res.headers.get("X-Pagination")
              );
              setHasNext(paginationData.HasNext);
              setHasPrevious(paginationData.HasPrevious);
              setTotalPages(paginationData.TotalPages);
              setActive(pageNumber);
              setTimesheets(data);
            });
          }
        })
        .catch((err) => console.log(err));
  }, [session, pageNumber]);
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={active === number}
        onClick={() => {
          setPageNumber(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }
  if (!loaded) {
    return (
      <div
        className="row justify-content-center align-content-center"
        style={{ height: "80vh" }}
      >
        <Spinner className="text-center" animation="border" variant="primary" />
      </div>
    );
  }
  return (
    <>
      <Table size="sm" bordered className="mt-2">
        <thead className="table-info">
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Time</th>
            <th>Overtime</th>
            <th>Date</th>
            <th>Client</th>
            <th>Project</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((ts: TimesheetDTO) => {
            let a = Date.parse(ts.date);
            let datum = new Date(a);
            return (
              <tr key={ts.id}>
                <td>{ts.id}</td>
                <td>{ts.description}</td>
                <td>{ts.time}</td>
                <td>{ts.overTime}</td>
                <td>{datum.toLocaleDateString()}</td>
                <td>{ts.clientName}</td>
                <td>{ts.projectName}</td>
                <td>{ts.categoryName}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => setPageNumber(1)} />
        <Pagination.Prev
          disabled={!hasPrevious}
          onClick={() => setPageNumber(pageNumber - 1)}
        />
        {items}
        <Pagination.Next
          disabled={!hasNext}
          onClick={() => setPageNumber(pageNumber + 1)}
        />
        <Pagination.Last onClick={() => setPageNumber(totalPages)} />
      </Pagination>
    </>
  );
}

export default Preview;
