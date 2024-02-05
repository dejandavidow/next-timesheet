import { Category } from "@/app/models/category";
import { Project, ProjectEntity } from "@/app/models/project";
import { Session } from "next-auth";
export const GetProjects = async (
  pageNumber: number,
  search: string,
  orderBy: string,
  pageSize: number,
  session: Session | null
) => {
  let url = `http://localhost:29468/api/projects?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (orderBy) {
    url += `&OrderBy=${orderBy}`;
  }
  return await fetch(url, {
    headers: {
      authorization: `Bearer ${session?.user.token}`,
    },
  });
};
export const GetAllProjects = async (session: Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "GET",
  };
  return await fetch("http://localhost:29468/api/projects/all", options);
};
export const GetProject = async (id: number,session:Session) => {
 return await fetch(`http://localhost:29468/api/projects/${id}`,{
    headers: {
      authorization: `Bearer ${session.user.token}`,
    },
  });
};
export const PostProject = async (project:ProjectEntity,session:Session | null) => {
  let options = {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user.token}`,},
    method: "POST",
    body: JSON.stringify(project),
  };
  return await fetch("http://localhost:29468/api/projects", options);
};
export const UpdateProject = async (project: ProjectEntity,session:Session) => {
  let options = {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.token}`},
    method: "PUT",
    body: JSON.stringify(project),
  };
  return await fetch(
    `http://localhost:29468/api/projects/${project.id}`,
    options
  );
};
export const DeleteProject = async (id: number,session:Session) => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    method: "DELETE",
  };
  return await fetch(`http://localhost:29468/api/projects/${id}`, options);
};
