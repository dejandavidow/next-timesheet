"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Row } from "react-bootstrap";
export default function Home() {
  const router = useRouter();
  const path = usePathname()
  console.log(path)
  return (
    <div id="home" className="row align-content-center gap-2">
      <Row className="justify-content-center">
        <Button
          className="col-lg-2"
          variant="btn btn-success"
          onClick={() => signIn(undefined, { callbackUrl: path })}
        >
          Login
        </Button>
      </Row>
      <Row className="justify-content-center">
        <Button
          className="col-lg-2"
          variant="btn btn-primary"
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
      </Row>
    </div>
  );
}
