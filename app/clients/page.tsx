"use client";
import React, { useEffect, useState } from "react";
import { GetClients } from "./service/clientservice";
import { ClientDTO } from "../models/client";
import {
  Table,
  Button,
  Pagination,
  Dropdown,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import Link from "next/link";
import DeleteModal from "./components/deleteClient";
import { redirect, useRouter } from "next/navigation";
import { PaginationModel } from "../models/pagination";
import Image from "next/image";
import sortimg from "./../../public/sortimg.png";
import { useSession } from "next-auth/react";
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [active, setActive] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/clients");
    },
  });
  useEffect(() => {
    if(session?.user)
    GetClients(pageNumber, search, orderBy, pageSize, session).then((res) => {
      if (res.ok) {
        let paginationData: PaginationModel = JSON.parse(
          res.headers.get("X-Pagination")
        );
        setLoaded(true);
        setHasNext(paginationData.HasNext);
        setHasPrevious(paginationData.HasPrevious);
        setTotalPages(paginationData.TotalPages);
        setActive(pageNumber);
        res.json().then(setClients);
      } else {
        alert("Error occurred!");
      }
    },(e) => console.log(e));
    setDeleted(false);
  }, [deleted, pageNumber, orderBy, pageSize, search,session]);
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
      <Alert
        variant={"success"}
        show={showAlert}
        dismissible
        onClose={() => setShowAlert(false)}
      >
        {msg}
      </Alert>
      <h2>Clients</h2>
      <hr />
      <div className="row justify-content-between">
        <div className="col-auto">
          <Link href="/clients/create" className="btn btn-primary">
            Add new
          </Link>
        </div>
        <div className="col-auto">
          <Form>
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </div>
      </div>
      <div className="float-end mt-2 mb-2">
        <Dropdown>
          <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
            Page size
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPageSize(5)}>5</Dropdown.Item>
            <Dropdown.Item onClick={() => setPageSize(10)}>10</Dropdown.Item>
            <Dropdown.Item onClick={() => setPageSize(15)}>15</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Table size="sm" bordered className="mt-2">
        <thead className="table-info">
          <tr>
            <th>Id</th>
            <th>
              Name
              <Image
                onClick={() =>
                  setOrderBy(orderBy === "name" ? "name_desc" : "name")
                }
                style={{ textAlign: "right" }}
                className="float-end mt-1"
                src={sortimg}
                alt="sort button"
                width={18}
                height={15}
              />
            </th>
            <th>Address</th>
            <th>City</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client: ClientDTO) => {
            return (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.adress}</td>
                <td>{client.city}</td>
                <td className="col-lg-3 col-sm-auto text-center">
                  <Button
                    onClick={() => router.push(`clients/edit/${client.id}`)}
                    variant="warning"
                  >
                    Update
                  </Button>
                  <DeleteModal
                    client={client}
                    setDeleted={setDeleted}
                    setShowAlert={setShowAlert}
                    setMsg={setMsg}
                  />
                </td>
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
};

export default Clients;
