"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  DeleteCategory,
  GetCategories,
  GetCategory,
  PostCategory,
  UpdateCategory,
} from "./service/categoryservice";
import { Category } from "../models/category";
import { PaginationModel } from "../models/pagination";

export default function Categories() {
  const [categories, setCategoires] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [changed, setChanged] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const handleClose = () => {
    setShow(false);
    ResetForm();
    setAdded(false);
  };
  const handleShow = () => setShow(true);
  useEffect(() => {
    GetCategories(pageNumber, search, sortBy).then((res: Response) => {
      if (res.ok) {
        setLoaded(true);
        let paginationData: PaginationModel = JSON.parse(
          res.headers.get("X-Pagination")
        );
        setHasNext(paginationData.HasNext);
        setHasPrevious(paginationData.HasPrevious);
        res.json().then(setCategoires);
      }
    });
    setChanged(false);
  }, [changed, pageNumber, search, sortBy]);
  const AddCategory = () => {
    PostCategory(name).then((res) => {
      if (res.ok) {
        setAdded(true);
        setChanged(true);
        handleClose();
        setMsg("Category created successfully!");
        setShowAlert(true);
      } else {
        alert("Error occurred while adding!");
      }
    });
  };
  const DeleteCategoryOnClick = (e: any) => {
    DeleteCategory(e.target.name).then((res) => {
      if (res.ok) {
        setChanged(true);
        setMsg("Category deleted successfully!");
        setShowAlert(true);
      } else {
        alert("Error occurrd while deleting!");
      }
    });
  };
  const ResetForm = () => {
    setName("");
    setId(0);
  };
  const GetCategoryOnClick = (e: any) => {
    let id = e.target.name;
    GetCategory(id).then((category: Category) => {
      setUpdating(true);
      setName(category.name);
      setId(category.id);
    });
  };
  const UpdateCategoryOnClick = () => {
    UpdateCategory({ id, name }).then((res) => {
      if (res.ok) {
        setChanged(true);
        ResetForm();
        setUpdating(false);
        setMsg("Category updated successfully!");
        setShowAlert(true);
      } else {
        alert("Error occurred while updating!");
      }
    });
  };
  const handleCancel = () => {
    ResetForm();
    setUpdating(false);
  };
  const SortCategories = () => {
    let sort = sortBy === "name_desc" ? "name" : "name_desc";
    setSortBy(sort);
  };
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
      <h2>Categories</h2>
      <hr />
      <Row className="justify-content-beetwen">
        <Col>
          <Button variant="primary" onClick={handleShow}>
            Add new
          </Button>
        </Col>
        <Col lg={2} md>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!added ? (
            <Button variant="success" onClick={AddCategory}>
              Save
            </Button>
          ) : null}
          {added ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Saving...
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
      <Table size="sm" bordered className="mt-2">
        <thead className="table-success">
          <tr>
            <th>Id</th>
            <th>
              Name
              <img
                onClick={SortCategories}
                style={{ height: "15px", textAlign: "right" }}
                className="float-end mt-1"
                src="https://static-00.iconduck.com/assets.00/sort-icon-512x410-1kpy040x.png"
              ></img>
            </th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: Category) => {
            return (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    name={category.id.toString()}
                    onClick={GetCategoryOnClick}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="mx-2"
                    name={category.id.toString()}
                    onClick={DeleteCategoryOnClick}
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
        <Pagination.Prev
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={!hasPrevious}
        />
        <Pagination.Next
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={!hasNext}
        />
      </Pagination>
      <div style={updating ? { display: "block" } : { display: "none" }}>
        <Row className="justify-content-center">
          <Form.Control type="number" value={id} hidden />
          <Col md={3}>
            <Form className="row justify-content-center">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Button
            variant="success"
            onClick={UpdateCategoryOnClick}
            className="col-auto mt-3"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="col-auto mt-3 mx-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Row>
      </div>
    </>
  );
}
