"use client";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Project } from "../models/project";
import { DeleteProject, GetProjects } from "./service/projectservice";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { PaginationModel } from "../models/pagination";
import { Table, Button, Pagination, Spinner } from "react-bootstrap";
import Image from "next/image";
import sortimg from "./../../public/sortimg.png";
import AddProject from "./components/AddProject";
const Projects = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/projects");
    },
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);
  useEffect(() => {
    setAdded(false);
    if (session?.user.token) {
      GetProjects(pageNumber, search, sortBy, pageSize, session).then((res) => {
        if (res.ok) {
          setLoaded(true)
          let paginationData: PaginationModel = JSON.parse(
            res.headers.get("X-Pagination")
          );
          setHasNext(paginationData.HasNext);
          setHasPrevious(paginationData.HasPrevious);
          setTotalPages(paginationData.TotalPages);
          setActive(pageNumber);
          res.json().then(setProjects);
        }
      }).catch((err) => console.log(err));;
    }
  }, [pageNumber, pageSize, search, sortBy, session, added]);
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
  const handleSort = () => {
    let sort = sortBy === "name" ? "name_desc" : "name";
    setSortBy(sort);
  };
  const router = useRouter();
  const handleUpdate = (e: SyntheticEvent) => {
    let id = e.currentTarget.name;
    router.push(`/projects/edit/${id}`)
  };
  const handleDelete = (e:SyntheticEvent) =>
  {
    let id = e.target.name;
    DeleteProject(id,session).then((res) =>{
      if(res.ok)
      {
        setAdded(true);
      }
    }).catch((err) => console.log(err));
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
      <h2>Projects</h2>
      <hr />
      <AddProject
        setPageSize={setPageSize}
        search={search}
        setSearch={setSearch}
        setAdded={setAdded}
      />
      <Table size="sm" bordered className="mt-2">
        <thead className="table-info">
          <tr>
            <th>Id</th>
            <th>
              Name
              <Image
                style={{ textAlign: "right" }}
                className="float-end mt-1"
                src={sortimg}
                alt="sort button"
                width={18}
                height={15}
                onClick={handleSort}
              />
            </th>
            <th>Description</th>
            <th>Archived</th>
            <th>Status</th>
            <th>Client</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: Project) => {
            return (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.archive ? "Yes" : "No"}</td>
                <td>{project.status ? "Active" : "Inactive"}</td>
                <td>{project.clientName}</td>
                <td className="col-lg-3 col-sm-auto text-center">
                  <Button
                    variant="warning"
                    name={project.id.toString()}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    name={project.id.toString()}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
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

export default Projects;
