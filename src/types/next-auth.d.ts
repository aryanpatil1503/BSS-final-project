import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** Unique identifier for the user */
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User extends DefaultUser {
    /** Unique identifier for the user */
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Stored user id in token */
    id: string
  }
}
