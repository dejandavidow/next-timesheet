"use client";

import { GetClients } from "@/app/clients/service/clientservice";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, SyntheticEvent } from "react";
import { GetProject, UpdateProject } from "../../service/projectservice";
import { ClientDTO } from "@/app/models/client";
import { Form, Button } from "react-bootstrap";
import { Project } from "@/app/models/project";

function Page() {
  const [name, setName] = useState("");
  const [description, setDecription] = useState("");
  const [archive, setarchive] = useState(false);
  const [status, setstatus] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [clients, setClients] = useState([]);
  const [validated, setValidated] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const paramId = useParams();
  useEffect(() => {
    if (session?.user) {
      GetProject(+paramId.id, session).then((res) => {
        if (res.ok) {
          res.json().then((project: Project) => {
            setName(project.name);
            setarchive(project.archive);
            setstatus(project.status);
            setDecription(project.description);
          });
        }
      });
      GetClients(1, "", "", 5, session).then((res) => {
        if (res.ok) {
          res.json().then(setClients);
        }
      });
    }
  }, []);
  function handleSubmit(event: SyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      let userId = session?.user.id;
      let id = +paramId.id;
      UpdateProject(
        { id, name, description, status, archive, clientId, userId },
        session
      )
        .then((res) => {
          if (res.ok) {
            router.push("/projects");
          }
        })
        .catch((err) => console.log(err));
    }
    setValidated(true);
  }
  return (
    <>
      <div className="d-flex justify-content-center">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="validationCustom01">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDecription(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid description.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom03">
            <Form.Label>Client</Form.Label>
            <Form.Select
              required
              aria-label="Default select example"
              onChange={(e) => setClientId(+e.target.value)}
            >
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
          <Form.Group onChange={(e) => setarchive(e.target.value === 'true' ? true : false)}>
            <Form.Label>Archived</Form.Label>
            <br></br>
            <Form.Check
              inline
              label="Yes"
              type="radio"
              name="archived"
              value="true"
              checked={archive}
              required
              feedbackType="invalid"
              feedback="Please select one"
            ></Form.Check>
            <Form.Check
              inline
              label="No"
              type="radio"
              name="archived"
              value="false"
              checked={!archive}
              required
              feedbackType="invalid"
              feedback="Please select one"
            ></Form.Check>
          </Form.Group>
          <Form.Group onChange={(e) => setstatus(e.target.value === 'true' ? true : false)}>
            <Form.Label>Status</Form.Label>
            <br></br>
            <Form.Check
              inline
              label="Active"
              type="radio"
              name="status"
              value="true"
              required
              checked={status}
              feedbackType="invalid"
              feedback="Please select one"
            ></Form.Check>
            <Form.Check
              inline
              label="Inactive"
              type="radio"
              name="status"
              value="false"
              checked={!status}
              required
              feedbackType="invalid"
              feedback="Please select one"
            ></Form.Check>
          </Form.Group>
          <div className="d-flex justify-content-end gap-1">
            <Button variant="success" type="submit">
              Save
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.push("/projects")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Page;
