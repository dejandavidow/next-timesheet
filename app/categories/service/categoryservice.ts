import { Category } from "@/app/models/category";
import { Session } from "next-auth";
export const GetCategories = async (
  pageNumber: number,
  search: string,
  orderBy: string,
  pageSize: number,
  session: Session
) => {
  let url = `http://localhost:29468/api/categories?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (orderBy) {
    url += `&OrderBy=${orderBy}`;
  }
  return await fetch(url, {
    headers: {
      authorization: `Bearer ${session.user.token}`,
    },
  });
};
export const GetAllCategories = async (session:Session) => {
  return await fetch("http://localhost:29468/api/categories/all", {
    headers: {
      authorization: `Bearer ${session.user.token}`,
    },
  });
};
export const GetCategory = async (id: number, session: Session) => {
  let res = await fetch(`http://localhost:29468/api/categories/${id}`, {
    headers: {
      authorization: `Bearer ${session.user.token}`,
    },
  });
  if (res.ok) {
    return await res.json();
  } else {
    alert("Error occurred");
  }
};
export const PostCategory = async (name: string, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "POST",
    body: JSON.stringify({ name }),
  };
  return await fetch("http://localhost:29468/api/categories", options);
};
export const UpdateCategory = async (category: Category, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "PUT",
    body: JSON.stringify(category),
  };
  return await fetch(
    `http://localhost:29468/api/categories/${category.id}`,
    options
  );
};
export const DeleteCategory = async (id: number, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "DELETE",
  };
  return await fetch(`http://localhost:29468/api/categories/${id}`, options);
};
