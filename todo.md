# Full-Stack Integration Checklist

- [x] Upgrade the static portal to the full-stack project scaffold.
- [x] Configure the MongoDB connection and integrate the Mongoose model layer.
- [x] Implement secure session-based login and role-aware authorization contracts.
- [x] Build protected API endpoints for dashboard summaries and school records.
- [x] Connect the frontend login and dashboard views to authenticated live API data.
- [x] Verify access controls, loading/error states, and production build output.
- [x] Save a release checkpoint and document required environment variables.
- [x] Add graceful, authenticated dashboard loading states for unavailable MongoDB connectivity.
- [x] Enforce parent-to-child, student-to-self, and teacher-to-assignment record filters in protected procedures.
- [x] Add Vitest coverage for allowed and forbidden school-role access patterns.
- [x] Add the Atlas Network Access rule and rerun the live MongoDB connection test.
- [x] Verify a real linked SchoolUser resolves the correct role after sign-in.
- [x] Browser-test permitted overview and section data for each configured school role after Atlas access is enabled.

\n- [x] Implement comprehensive Student Profile page with RBAC, attendance summary, and admin actions\n