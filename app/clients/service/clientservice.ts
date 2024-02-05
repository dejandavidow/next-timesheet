import { ClientEntity } from "@/app/models/client";
import { Session } from "next-auth";

export const GetClients = async (
  pageNumber: number,
  search: string,
  orderBy: string,
  pageSize: number,
  session: Session
) => {
  let url = `http://localhost:29468/api/clients?pageNumber=${pageNumber}&pageSize=${pageSize}`;
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
export const GetAllClients = async (session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "GET",
  };
  return await fetch("http://localhost:29468/api/clients/all", options);
};
export const GetClient = async (id: number, session: Session) => {
  let res = await fetch(`http://localhost:29468/api/clients/${id}`, {
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
export const PostClient = async (client: ClientEntity, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "POST",
    body: JSON.stringify(client),
  };
  return await fetch("http://localhost:29468/api/clients", options);
};
export const UpdateClient = async (client: ClientEntity, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "PUT",
    body: JSON.stringify(client),
  };
  return await fetch(
    `http://localhost:29468/api/clients/${client.id}`,
    options
  );
};
export const DeleteClient = async (id: number, session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "DELETE",
  };
  return await fetch(`http://localhost:29468/api/clients/${id}`, options);
};
