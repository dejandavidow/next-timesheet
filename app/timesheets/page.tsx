"use client";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { GetAllCategories } from "../categories/service/categoryservice";
import { useSession } from "next-auth/react";
import { Category } from "../models/category";
import { GetAllClients } from "../clients/service/clientservice";
import { GetAllProjects } from "../projects/service/projectservice";
import { ClientDTO } from "../models/client";
import { Project } from "../models/project";
import { useRouter } from "next/navigation";
import { PostTimesheet } from "./service/timesheetservice";

function Timesheets() {
  const [validated, setvalidated] = useState(false);
  const [description, setdescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [time, settime] = useState(0);
  const [overTime, setovertime] = useState(0);
  const [date, setdate] = useState("");
  const [projects, setprojects] = useState([]);
  const [clients, setClients] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [projectId, setProjectId] = useState(0);
  const [clientId, setClientId] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    GetAllCategories(session)
      .then((res) => {
        if (res.ok) {
          res.json().then(setCategories);
        }
      })
      .catch((err) => console.log(err));
    GetAllProjects(session)
      .then((res) => {
        if (res.ok) {
          res.json().then(setprojects);
        }
      })
      .catch((err) => console.log(err));
    GetAllClients(session)
      .then((res) => {
        if (res.ok) {
          res.json().then(setClients);
        }
      })
      .catch((err) => console.log(err));
  }, [session]);
  function handleSubmit(event: SyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      console.log({id:0,description,time,overTime,date,clientId,projectId,categoryId})
      PostTimesheet({id:0,description,time,overTime,date,clientId,projectId,categoryId},session)
      .then((res) =>{
        if(res.ok)
        {
            alert("Timeshete added successfully")
            ResetForm();
        }
      }).catch((err) => console.log(err));
    }
    setvalidated(true);
  }
  const ResetForm = () => {
    setvalidated(false)
    setdescription("");
    setdate("");
    setovertime(0);
    settime(0);
    setClientId(0)
    setProjectId(0)
    setCategoryId(0);
  };
  return (
    <>
      <Button variant="info" onClick={() => router.push("/timesheets/preview")}>Preview timesheets</Button>
      <div className="d-flex justify-content-center">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="validationCustom">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label>Work hours</Form.Label>
            <Form.Control
              type="number"
              placeholder="Work hours"
              value={time}
              required
              onChange={(e) => settime(+e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid work time.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom04">
            <Form.Label>Over Work hours</Form.Label>
            <Form.Control
              type="number"
              placeholder="Work hours"
              value={overTime}
              required
              onChange={(e) => setovertime(+e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid over work time.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom05">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Date"
              value={date}
              required
              onChange={(e) => setdate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please select date.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom03">
            <Form.Label>Category</Form.Label>
            <Form.Select required aria-label="Default select example" onChange={(e) => setCategoryId(+e.target.value)}>
              <option value={""}>Open this select menu</option>
              {categories.map((category: Category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select category.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom06">
            <Form.Label>Client</Form.Label>
            <Form.Select required aria-label="Default select example" onChange={(e) => setClientId(+e.target.value)}>
              <option value={""}>Open this select menu</option>
              {clients.map((client: ClientDTO) => {
                return (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select client.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom07">
            <Form.Label>Project</Form.Label>
            <Form.Select required aria-label="Default select example" onChange={(e) => setProjectId(+e.target.value)}>
              <option value={""}>Open this select menu</option>
              {projects.map((project: Project) => {
                return (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select project.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-center gap-1">
            <Button variant="success" type="submit">
              Save
            </Button>
            <Button variant="secondary" type="button" onClick={ResetForm}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Timesheets;
