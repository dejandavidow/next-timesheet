"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Dropdown,
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
import Image from "next/image";
import sortimg from "./../../public/sortimg.png";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
function Categories() {
  const { data: session} = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/categories");
    },
  });
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
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [validated, setValidated] = useState(false);
  const handleClose = () => {
    setShow(false);
    ResetForm();
    setAdded(false);
    setValidated(false);
  };
  const handleShow = () => setShow(true);
  useEffect(() => {
    if (session?.user)
      GetCategories(pageNumber, search, sortBy, pageSize, session).then(
        (res: Response) => {
          if (res.ok) {
            setLoaded(true);
            let paginationData: PaginationModel = JSON.parse(
              res.headers.get("X-Pagination")
            );
            setHasNext(paginationData.HasNext);
            setHasPrevious(paginationData.HasPrevious);
            setTotalPages(paginationData.TotalPages);
            setActive(pageNumber);
            res.json().then(setCategoires);
          }
        }
      );
    setChanged(false);
  }, [changed, pageNumber, search, sortBy, pageSize,session]);
  const DeleteCategoryOnClick = (e: any) => {
    DeleteCategory(e.target.name,session).then((res) => {
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
    GetCategory(id,session).then((category: Category) => {
      setUpdating(true);
      setName(category.name);
      setId(category.id);
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
  const handleUpdate = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      UpdateCategory({ id, name },session).then((res) => {
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
    }
    setValidated(true);
  };
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      PostCategory(name,session).then((res) => {
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
    }
    setValidated(true);
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
          <Modal.Title>Add new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="validationCustom">
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
            <div className="float-end mt-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-1"
              >
                Close
              </Button>
              {!added ? (
                <Button variant="success" type="submit">
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
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Table size="sm" bordered className="mt-2">
        <thead className="table-info">
          <tr>
            <th>Id</th>
            <th>
              Name
              <Image
                onClick={SortCategories}
                style={{ textAlign: "right" }}
                className="float-end mt-1"
                src={sortimg}
                alt="sort button"
                width={18}
                height={15}
              />
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
                <td className="col-lg-3 col-sm-auto text-center">
                  <Button
                    variant="warning"
                    name={category.id.toString()}
                    onClick={GetCategoryOnClick}
                  >
                    Update
                  </Button>
                  <Button
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
      <div style={updating ? { display: "block" } : { display: "none" }}>
        <Form
          className="row justify-content-center"
          noValidate
          validated={validated}
          onSubmit={handleUpdate}
        >
          <Row className="justify-content-center">
            <Form.Control type="number" value={id} hidden readOnly/>
            <Col md={3}>
              <Form.Group controlId="validationCustom">
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
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button variant="success" type="submit" className="col-auto mt-3">
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
        </Form>
      </div>
    </>
  );
}
export default Categories;
