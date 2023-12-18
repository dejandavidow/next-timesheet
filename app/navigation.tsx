"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useState } from "react";
const NavigationBar = () => {
  const [categoryActive, setCategoryActive] = useState(false);
  const [clientActive, setClientActive] = useState(false);

  return (
    <ul className="nav nav-underline justify-content-center">
      <li className="nav-item">
        <Link href="/categories" className={categoryActive ? "nav-link active" : "nav-link"} onClick={() => {setCategoryActive(true),setClientActive(false)}}>
          Categories
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/clients" className={clientActive ? "nav-link active" : "nav-link"}onClick={() => {setCategoryActive(false),setClientActive(true)}}>
          Clients
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/projects" className="nav-link">
          Projects
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/timesheets" className="nav-link">
          Timesheets
        </Link>
      </li>
    </ul>
  );
};

export default NavigationBar;
