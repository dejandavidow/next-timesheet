"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ClientDTO } from "../../models/client";
import { DeleteClient } from "../service/clientservice";
import { useSession } from "next-auth/react";
type deleteProps = {
  client: ClientDTO;
  setDeleted: (c: boolean) => void;
  setShowAlert:(c:boolean) => void
  setMsg:(c:string) => void
};
const DeleteModal = ({ client, setDeleted,setShowAlert,setMsg}: deleteProps) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const {data:session} = useSession();
  const handleDelete = () => {
    DeleteClient(client.id,session).then((res) => {
      if (res.ok) {
        setDeleted(true);
        handleClose();
        setMsg("Client deleted successfully!")
        setShowAlert(true);
      } else {
        alert("Error occured");
      }
    });
  };
  return (
    <>
      <Button variant="danger" className="mx-2" onClick={handleShow}>
        Delete
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure that you want to delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Client: {client.name}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModal;
