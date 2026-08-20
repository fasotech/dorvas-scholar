# Green Ledger School Management Portal

Green Ledger is a responsive full-stack school operations and learning portal. It includes protected role-aware dashboards for administrators, teachers, students, and parents; Mongoose models for all required MongoDB collections; server-side tRPC procedures; and Manus OAuth sign-in.

## Local development

Install dependencies with `pnpm install`, then run `pnpm dev`. The project uses React, Vite, Express, tRPC, Mongoose, and Tailwind CSS. An unauthenticated sign-in screen works without Atlas; live school records require the secure MongoDB configuration in [`ATLAS_SETUP.md`](./ATLAS_SETUP.md).

## GitHub and Vercel deployment

Commit the entire repository to a new GitHub repository. The original static Vite configuration can be deployed to Vercel, but the current OAuth + tRPC API requires a Node-capable backend deployment. Use Manus built-in full-stack hosting or adapt the Express server to Vercel serverless functions before treating a Vercel deployment as production-ready.

| Vercel setting | Value |
| --- | --- |
| Framework preset | Vite |
| Install command | `pnpm install` |
| Build command | `pnpm run build` |
| Output directory | `dist/public` |

## Activating live school data

Follow [`ATLAS_SETUP.md`](./ATLAS_SETUP.md) to rotate the previously exposed Atlas credential, add a deployment network rule, set `MONGODB_URI`, and link signed-in people to their `SchoolUser` role documents. Keep database credentials only in deployment environment variables; never expose them in browser code.
