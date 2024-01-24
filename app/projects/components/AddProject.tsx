"use client";
import { GetClients } from "@/app/clients/service/clientservice";
import { ClientDTO } from "@/app/models/client";
import { useSession } from "next-auth/react";
import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { PostProject } from "../service/projectservice";
type AddProjectsProps = {
  setPageSize: (c: number) => void;
  setSearch: (c: string) => void;
  search: string;
  setAdded: (c: boolean) => void;
};
function AddProject({
  setPageSize,
  setSearch,
  search,
  setAdded,
}: AddProjectsProps) {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      GetClients(1, "", "", 5, session).then((res) => {
        if (res.ok) {
          res.json().then(setClients);
        }
      });
    }
  }, []);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [description, setDecription] = useState("");
  const [archive, setarchive] = useState(false);
  const [status, setstatus] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [clients, setClients] = useState([]);
  const handleClose = () => {
    setShow(false);
    ResetForm();
  };
  const handleShow = () => {
    setShow(true);
  };
  function handleSubmit(event: SyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      let id = 0;
      let userId = session?.user.id;
      console.log({ id, name, description, status, archive, clientId, userId });
      PostProject(
        { id, name, description,status, archive, clientId, userId },
        session
      )
        .then((res) => {
          if (res.ok) {
            setAdded(true);
            handleClose();
          }
        })
        .catch((err) => console.log(err));
    }
    setValidated(true);
  }
  const ResetForm = () => {
    setName("");
    setarchive(false);
    setClientId(0);
    setstatus(false);
    setDecription("");
  };
  return (
    <>
      <Row className="justify-content-between">
        <Col className="col-auto">
          <Button variant="primary" onClick={handleShow}>
            Add new
          </Button>
        </Col>
        <Col className="col-auto">
          <Form>
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            <Form.Group
              onChange={(e) =>
                setarchive(e.target.value === "true" ? true : false)
              }
            >
              <Form.Label>Archive</Form.Label>
              <br></br>
              <Form.Check
                inline
                label="Yes"
                type="radio"
                name="archived"
                value="true"
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
                required
                feedbackType="invalid"
                feedback="Please select one"
              ></Form.Check>
            </Form.Group>
            <Form.Group
              onChange={(e) =>
                setstatus(e.target.value === "true" ? true : false)
              }
            >
              <Form.Label>Status</Form.Label>
              <br></br>
              <Form.Check
                inline
                label="Active"
                type="radio"
                name="status"
                value="true"
                required
                feedbackType="invalid"
                feedback="Please select one"
              ></Form.Check>
              <Form.Check
                inline
                label="Inactive"
                type="radio"
                name="status"
                value="false"
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
                onClick={() => setShow(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );

  <></>;
}

export default AddProject;
