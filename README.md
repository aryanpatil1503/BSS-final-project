# BSS-final-project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Next Steps

1. Install & init Prisma
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```
2. Define your first model in `prisma/schema.prisma` (e.g. `User` with `id`, `email`, `name`).
3. Run initial migration & generate client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Create `lib/prisma.ts` exporting a cached `PrismaClient`.
5. Write a GET API route at `app/api/users/route.ts` using `prisma.user.findMany()`.
6. Test the endpoint (curl or browser `http://localhost:3000/api/users`).
7. Build a front-end page at `app/users/page.tsx` to fetch & display users.
8. Add a “Create User” form to POST to `/api/users`.
9. Implement POST handler with `prisma.user.create` and refresh the list.
10. (Optional) Repeat for update/delete operations.

## Project Status

### Done
- **Prisma & DB**
  - Added `hashedPassword?` to User model
  - Ran `prisma migrate dev` and regenerated the client
- **Authentication**
  - Configured NextAuth with `CredentialsProvider` + bcrypt
  - Built `/api/auth/signup` to create users with hashed passwords
  - Updated NextAuth route to select and validate `hashedPassword`
- **UI/UX**
  - Split “Sign In” and “Sign Up” into separate pages (`/signin`, `/signup`)
  - Sign-in page collects email & password; Sign-up page adds name, password confirmation, toasts
  - Updated Header links and dark-mode styling for Header/Card
  - Wrapped app in `SessionProvider` and integrated `react-hot-toast`
- **Git & Deploy**
  - Resolved README merge conflict
  - Pushed codebase to GitHub at https://github.com/aryanpatil1503/BSS-final-project

### Remaining
- **Environment & Secrets**: Set `DATABASE_URL` and `NEXTAUTH_SECRET` in `.env.local`
- **UI Polish**: Enhance dark-mode styling and add “Sign Out” with user info
- **Route Protection**: Protect any pages requiring authentication (redirect unauthenticated users)
- **Validation & UX**: Implement password-strength checks, improved error messages, loading states
- **Testing**: Add unit/integration tests for auth endpoints and pages
- **Deployment Config**: Finalize Vercel (or other) env vars and CI/CD settings
