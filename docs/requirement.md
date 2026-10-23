# Requirements — Project Submission & Review Dashboard

Status: Implementation checklist
Scope: Shared requirements for the frontend, backend, database, videos, and submission.
Source: Associate Web Instructor - Hiring Task (3-page assessment).

## How to use this file

- Keep this file at the repository root or in `docs/`.
- Frontend and backend teams use this same checklist; each section identifies its owner.
- `[PDF]` means explicitly required by the assessment.
- `[PROJECT]` means an implementation requirement adopted in `decisions.md`, not an explicit PDF instruction.
- `[DELIVERY]` means a project quality/reproducibility practice.
- Mark a checkbox only after verifying its acceptance criteria.
- Refer to `decisions.md` for ambiguity resolutions, limits, security choices, and scope boundaries.

## 1. Required stack [PDF]

- [ ] TypeScript in frontend and backend.
- [ ] Next.js frontend.
- [ ] TailwindCSS styling.
- [ ] ShadCN UI components.
- [ ] Express.js backend; do not replace the required backend with only Next.js route handlers.
- [ ] PostgreSQL database accessed through Prisma ORM.
- [ ] JWT-based role-based access control (RBAC).

## 2. Authentication and roles

### Frontend

- [ ] [PDF] Student signup page.
- [ ] [PDF] Login page.
- [ ] [PROJECT] Inline input errors and understandable authentication errors.
- [ ] [PROJECT] Disable repeated submits while a request is pending.
- [ ] [PROJECT] Restore current-user UI using the authenticated-user endpoint.
- [ ] [PROJECT] Student and mentor navigation appropriate to the current role.
- [ ] [PROJECT] Logout action and expired-session handling.

### Backend and database

- [ ] [PDF] JWT authentication and role-based permission enforcement.
- [ ] [PDF] Seed an administrative account directly in the database.
- [ ] [PROJECT] Use STUDENT and MENTOR roles; the seeded admin is the mentor account.
- [ ] [PROJECT] Signup always creates STUDENT; request fields cannot assign elevated roles.
- [ ] [PROJECT] Email normalization plus a database unique constraint.
- [ ] [PROJECT] Store a password hash, never plaintext; never return the hash.
- [ ] [PROJECT] Verify JWT signature, configured algorithm, expiration, issuer, and audience.
- [ ] [PROJECT] Load the current database user from the verified token subject before protected actions.
- [ ] [PROJECT] Enforce role and resource permissions on the server, regardless of UI visibility.
- [ ] [PROJECT] Use the cookie and CSRF policy in decisions.md.
- [ ] [PROJECT] Clear the auth cookie on logout; document token-revocation limitations.

Acceptance: anonymous requests cannot use protected endpoints; students cannot review projects, including through manually crafted API requests.

## 3. Student submission portal

### Frontend

- [ ] [PDF] Form fields: Project name, Repo URL, Live Link, Description.
- [ ] [PDF] Robust validation and useful error presentation.
- [ ] [PROJECT] All four fields required under the adopted project policy.
- [ ] [PROJECT] Frontend and backend validation rules agree.
- [ ] [PROJECT] Show pending, success, field-error, duplicate-conflict, rate-limit, and server-error states.
- [ ] [PROJECT] Clear/reset the form only after confirmed success.
- [ ] [PROJECT] Small list of the current student's own submissions and statuses.

### Backend and database

- [ ] [PDF] Validate submissions on the server.
- [ ] [PDF] Prevent duplicate submissions.
- [ ] [PDF] Apply a basic anti-spam rate limit.
- [ ] [PROJECT] Derive studentId from authentication, never from submitted ownership fields.
- [ ] [PROJECT] Store new submissions as PENDING.
- [ ] [PROJECT] Parse and normalize repository identity according to decisions.md.
- [ ] [PROJECT] Enforce database uniqueness on (studentId, repoKey).
- [ ] [PROJECT] Translate duplicate-constraint failures into HTTP 409, including concurrent requests.
- [ ] [PROJECT] Enforce text lengths, URL protocols, and accepted repository URL policy.
- [ ] [PROJECT] Return only the authenticated student's records from the own-submissions endpoint.

Acceptance: valid input creates one PENDING submission; malformed input creates none; repeated equivalent repository submissions by the same student return a clear conflict.

## 4. Mentor review dashboard

### Frontend

- [ ] [PDF] Paginated data table.
- [ ] [PDF] Approve and Reject actions.
- [ ] [PDF] Approved and Rejected filters backed by server filtering.
- [ ] [PDF] Aggregated statistics, including Total Pending and Total Approved.
- [ ] [PROJECT] Also provide All and Pending filters, and Total/Rejected statistics.
- [ ] [PROJECT] Show project/student context, status, and submission time in the table.
- [ ] [PROJECT] Reset page to 1 when changing filters.
- [ ] [PROJECT] Show loading, empty, fetch-error, and mutation-error states.
- [ ] [PROJECT] Disable an action while its request is pending and on already reviewed records.
- [ ] [PROJECT] Refresh/refetch table and global statistics after a successful review.
- [ ] [PROJECT] Do not hide a failed refresh as though the displayed data were confirmed current.

### Backend and database

- [ ] [PDF] Return paginated records from the server.
- [ ] [PDF] Apply status filtering in the database query, not only in the browser.
- [ ] [PDF] Aggregate dashboard statistics on the server.
- [ ] [PROJECT] Validate page, limit, and allowed status values.
- [ ] [PROJECT] Use the same filter for records and filtered total count.
- [ ] [PROJECT] Order by createdAt DESC, id DESC for deterministic pagination.
- [ ] [PROJECT] Only MENTOR can list all submissions, fetch global statistics, or review.
- [ ] [PROJECT] Accept only APPROVED or REJECTED as review targets.
- [ ] [PROJECT] Permit only PENDING -> APPROVED/REJECTED.
- [ ] [PROJECT] Perform a conditional update that cannot overwrite another completed review.
- [ ] [PROJECT] Store reviewedById and reviewedAt on successful review.
- [ ] [PROJECT] Return 404 for a missing mentor-visible resource and 409 for an already reviewed resource.

Acceptance: changing a filter changes the server query; a review changes the record and counts; competing review attempts cannot both overwrite the same PENDING record.

## 5. API contract [PROJECT]

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | /api/auth/csrf | Public | Obtain CSRF token bound to a protected cookie |
| POST | /api/auth/signup | Public + CSRF | Register a student |
| POST | /api/auth/login | Public + CSRF | Authenticate and set JWT cookie |
| POST | /api/auth/logout | Authenticated + CSRF | Clear authentication cookie |
| GET | /api/auth/me | Authenticated | Return safe current-user fields |
| POST | /api/submissions | STUDENT + CSRF | Create submission |
| GET | /api/submissions/mine | STUDENT | List own submissions, paginated |
| GET | /api/mentor/submissions | MENTOR | Filtered, paginated submissions |
| GET | /api/mentor/stats | MENTOR | Global counts |
| PATCH | /api/mentor/submissions/:id/review | MENTOR + CSRF | Review a pending submission |

List query: `?page=1&limit=10&status=APPROVED`. Omit status for All.

List response: `{ data: [...], pagination: { page, limit, total, totalPages } }`.

Statistics response: `{ total, pending, approved, rejected }`.

Error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted information.",
    "fieldErrors": { "repoUrl": ["Enter an accepted repository URL."] }
  }
}
```

Status policy: 400 invalid input; 401 invalid/missing authentication; 403 forbidden/CSRF failure; 404 missing resource; 409 conflict; 429 rate limit; 500 unexpected failure. Successful creation: 201. Other JSON successes: 200.

## 6. Security and performance [PROJECT]

- [ ] Production HTTPS and secure cookie attributes.
- [ ] CSRF protection on all state-changing browser requests, including login/signup.
- [ ] Strict accepted-origin checks; never treat CORS alone as authorization or CSRF protection.
- [ ] Rate limits for submission, login, and signup; document single-instance store limitations.
- [ ] Correct trusted-proxy configuration for the actual deployment, not blindly trusting arbitrary forwarding headers.
- [ ] Helmet/security headers and bounded JSON request body size.
- [ ] Secrets loaded from environment; no production secret in git, browser bundles, logs, or videos.
- [ ] Safe output fields, plain-text description rendering, safe external links.
- [ ] No server-side fetching of arbitrary submitted URLs.
- [ ] Central error handler; no production stack traces or raw database errors to clients.
- [ ] Paginated database access and bounded page size.
- [ ] Database-side counts/grouping rather than downloading all records for statistics.
- [ ] Query-appropriate indexes and limited selected fields.
- [ ] Avoid one additional user query for every dashboard row (N+1).
- [ ] Do not publicly/shared-cache authenticated dashboard responses.

## 7. Verification [DELIVERY]

- [ ] Signup/login success and failure.
- [ ] Forged role/ownership fields cannot elevate access.
- [ ] Missing, invalid, and expired token cases.
- [ ] Direct student call to mentor endpoint returns forbidden.
- [ ] Invalid URLs, invalid lengths, invalid query parameters, and invalid review status.
- [ ] Duplicate URL variants and concurrent duplicate requests.
- [ ] Rate-limit response and visible frontend feedback.
- [ ] Missing submission and already reviewed submission.
- [ ] Concurrent review conflict.
- [ ] Pagination, filtered totals, empty datasets, and global statistics.
- [ ] Loading/error states and post-review refresh.
- [ ] Frontend/backend type checks and production builds pass.
- [ ] Fresh database migration, seed, and README setup work.
- [ ] At minimum manually verify every required flow; automate high-risk API cases where possible.

## 8. Teaching videos [PDF]

- [ ] Exactly two Bengali videos: one from Category 1 and one from Category 2.
- [ ] Each video is 10–12 minutes; aim around 11 minutes.
- [ ] Record with OBS.
- [ ] Face visible, facecam in lower-right corner.
- [ ] Use this project as teaching material, not an unrelated demo.
- [ ] Theoretical video explains why, not just syntax; implementation is not obligatory.
- [ ] Hands-on video includes live coding, reasoning, and beginner mistakes.
- [ ] Selected topics: 1C (Authentication vs Authorization/RBAC) and 2A (Securing a Route).
- [ ] Topic 1C distinguishes identity and permissions and discusses secure, efficient student/mentor checks.
- [ ] Topic 2A extracts user ID from a verified token, queries the database, and verifies resource access before status update.
- [ ] Upload to Unlisted YouTube or open-view Google Drive.
- [ ] Check playback, voice, facecam, readable code, duration, and anonymous link access.

Available alternatives (select one per category, not all):
- Category 1: 1A N+1 Query Problem; 1B Architecture of Caching; 1C Authentication vs Authorization; 1D Next.js Rendering Strategies.
- Category 2: 2A Securing a Route; 2B Database Schema & Relations (Users, Submissions, Feedback); 2C State Management & Data Fetching; 2D Defensive Form Validation.

## 9. Repository and final submission [PDF unless noted]

- [ ] Repository may start private; make it public after the submission deadline as instructed.
- [ ] Repository is reachable; an unreachable repository causes disqualification.
- [ ] Confirm deadline/timezone and public-visibility timing with organizers; the PDF does not specify an exact deadline.
- [ ] Submit GitHub link and two video links in the organizer-provided Google Form.
- [ ] Do not submit two topics from one category; that causes immediate disqualification.
- [ ] Complete all required work; omissions result in point deduction.
- [ ] [DELIVERY] README contains setup, env names, migrations, seed, scripts, roles, API, decisions, limitations, and video links.
- [ ] [DELIVERY] Commit migrations and lockfiles; provide `.env.example` without real secrets.
- [ ] [DELIVERY] Keep the submission branch working; use a separate teaching branch for live-coding preparation.

## 10. Completion rule

The project is complete when all PDF requirements are met, adopted project requirements are verified or transparently documented as limitations, the application is reproducible, and both videos plus repository links meet submission rules. A live deployment is useful but is not explicitly required by the supplied PDF. No claim of absolute security or unmeasured production performance is made.
