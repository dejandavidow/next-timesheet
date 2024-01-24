import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      token: string;
      name:string
      id:string
    };
  }
}