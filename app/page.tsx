"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Row } from "react-bootstrap";
export default function Home() {
  const router = useRouter();
  return (
    <div>
      <div
        id="home"
        className="d-flex justify-content-center align-items-center text-center"
      >
        <div id="login-buttons">
          <h2 className="text-center">Please login</h2>

          <Button
            variant="btn btn-primary"
            onClick={() => signIn(undefined, { callbackUrl: "/categories" })}
            className="mt-2 col-12"
          >
            Login
          </Button>
          <br></br>
          <Button
            className="mt-2 col-12"
            variant="btn btn-secondary"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
