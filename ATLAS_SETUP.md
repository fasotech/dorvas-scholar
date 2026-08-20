# Green Ledger — MongoDB Atlas and Authentication Activation

The application now has a Mongoose model layer, protected tRPC procedures, and Manus OAuth sign-in. It intentionally shows a secure unavailable state until MongoDB Atlas can be reached and the signed-in person has a matching school profile. The database URI is server-only and is never included in the frontend bundle.

## 1. Secure the Atlas account

The database password that appeared in the prior screenshot should be considered compromised. Delete or rotate that database user before connecting the application. Create a dedicated application user with access restricted to the intended school database and a long, unique password. Do not use your MongoDB Atlas website login credentials as an application database user.

| Atlas area | Required setting |
| --- | --- |
| Database Access | Create a dedicated application user with `readWrite` access to the school database only. |
| Network Access | Allow the application’s deployment egress network. For a first Vercel/serverless deployment without fixed outbound IPs, Atlas commonly requires `0.0.0.0/0`; pair this with a strong, least-privilege database user and rotate credentials if exposure is suspected. |
| Connection method | Choose **Connect → Drivers** and copy the complete URI, including the database name. |
| Project secret | Set `MONGODB_URI` to the complete URI in the project Secrets panel; never commit it to GitHub. |

> A valid value begins with `mongodb+srv://` or `mongodb://`. A password alone, an Atlas web URL, or a URI with unresolved `<…>` placeholders will not work.

## 2. Verify the database connection

After the Network Access rule and full URI are in place, run the focused integration test from the repository root:

```bash
pnpm test -- server/mongoose.connection.test.ts
```

The test performs an authenticated database ping. It must pass before any live school record can load. A `MongooseServerSelectionError` indicates an Atlas Network Access issue, not a frontend issue.

## 3. Link an authenticated person to a school role

Sign in once with the Manus OAuth button. This creates or refreshes the platform identity used by the application. Then create a matching MongoDB record in the `users` collection using the same `oauthOpenId` or email address.

| Required field | Purpose |
| --- | --- |
| `oauthOpenId` or `email` | Matches the signed-in OAuth identity. Use the same value returned by the platform sign-in. |
| `displayName` | Name shown in the Green Ledger account rail. |
| `role` | One of `admin`, `teacher`, `student`, or `parent`. |
| `profileType` | `Administrator`, `Teacher`, `Student`, or `Parent`. |
| `profileId` | The ObjectId of the corresponding document in `teachers`, `students`, or `parents`; administrators may leave it empty. |
| `isActive` | Must be `true` for the profile to resolve. |

The API applies the following restrictions automatically: administrators can access school-wide sections; teachers are restricted to assigned classes and subjects; students are restricted to their own profile, attendance, and results; parents are restricted to their linked children. Do not grant a profile a different role merely to bypass these checks.

## 4. Re-test after setup

Run the complete verification commands after Atlas has been configured:

```bash
pnpm check
pnpm test
pnpm build
```

Then sign in with one account for each school role and confirm that the dashboard and permitted sections show only appropriate records. The project checklist in `todo.md` tracks these Atlas-dependent verification steps.

## Hosting note

The original project was prepared as a static Vite frontend for Vercel. The new version includes a Node/Express tRPC API and Manus OAuth session handling, so its backend needs a Node-capable deployment route. Manus built-in full-stack hosting supports this stack directly. If you choose Vercel, adapt the Express/tRPC server to a Vercel `/api` serverless function or deploy the backend separately; the prior static-only `vercel.json` setup is not sufficient for authenticated API traffic.
