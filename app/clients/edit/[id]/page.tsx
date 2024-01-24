"use client";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { GetClient, UpdateClient } from "../../service/clientservice";
import { ClientEntity } from "@/app/models/client";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const Edit = ({ params }: { params: { id: string } }) => {
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [id, setId] = useState(0);
  useEffect(() => {
    GetClient(+params.id, session).then((client: ClientEntity) => {
      setId(client.id);
      setName(client.name);
      setAdress(client.adress);
      setCity(client.city);
      setPostalCode(client.postalCode);
      setCountry(client.postalCode);
    }).catch((err) => console.log(err));;
  }, []);
  const [validated, setValidated] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const handleSubmit = (event: SyntheticEvent) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      UpdateClient(
        { id, name, adress, city, postalCode, country },
        session
      ).then((res) => {
        if (res.ok) {
          setMsg("Client updated successfully!");
          setShowAlert(true);
          setTimeout(() => {
            router.push("/clients");
          }, 1000);
        } else {
          alert("Error occurred!");
        }
      }).catch((err) => console.log(err));;
    }
    setValidated(true);
  };
  const { data: session } = useSession();
  return (
    <div>
      <Alert
        variant={"success"}
        show={showAlert}
        dismissible
        onClose={() => setShowAlert(false)}
      >
        {msg}
      </Alert>
      <Form
        className="row justify-content-center align-items-center"
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
      >
        <div className="col-md-3">
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
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              value={adress}
              required
              onChange={(e) => setAdress(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom03">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom04">
            <Form.Label>Zip code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Zip"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid zip code.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom05">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid country.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="row justify-content-center mt-3 gap-2">
          <Button variant="success" className="col-auto" type="submit">
            Save
          </Button>
          <Button
            variant="secondary"
            className="col-auto"
            onClick={() => router.push("/clients")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Edit;
