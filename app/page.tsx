"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
export default function Home() {
  const router = useRouter();
  return (
    <div id="home" className="row align-items-center justify-content-center gap-1">
      <Button className="col-auto" variant="btn btn-warning" onClick={() => signIn(undefined,{ callbackUrl: '/categories' })}>Login</Button>
      <Button className="col-auto"  variant="btn btn-warning" onClick={() => router.push("/register")}>Register</Button>
    </div>
  );
}
