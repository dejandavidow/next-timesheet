"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavigationBar = () => {
  const path = usePathname();
  const { data: session } = useSession();
  if (session?.user)
    return (
      <div className="container">
        <ul className="nav nav-underline justify-content-center">
          <li className="nav-item">
            <Link
              href="/categories"
              className={
                path === "/categories" ? "nav-link active" : "nav-link"
              }
            >
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/clients"
              className={path === "/clients" ? "nav-link active" : "nav-link"}
            >
              Clients
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/projects"
              className={path === "/projects" ? "nav-link active" : "nav-link"}
            >
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/timesheets"
              className={
                path === "/timesheets" ? "nav-link active" : "nav-link"
              }
            >
              Timesheets
            </Link>
          </li>
        </ul>
        <div className="row justify-content-between">
          <h6 className="col-auto">
            User:{session?.user?.name}
          </h6>
          <Link
            href="/api/auth/signout"
            className="col-auto btn btn-outline-dark float-end"
          >
            Signout
          </Link>
        </div>
      </div>
    );
};

export default NavigationBar;
