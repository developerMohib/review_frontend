# Decisions — Project Submission & Review Dashboard

Status: Proposed implementation baseline, ready to adopt.
Applies to: Frontend, Express backend, Prisma/PostgreSQL, and delivery.
Source: Associate Web Instructor - Hiring Task and the implementation plan.

These decisions resolve intentional ambiguities. They are not additional claims about what the PDF explicitly requires. Keep this document aligned with code; record changes before implementing behavior that contradicts it.

## D01 — Scope and priority

Build all required assessment features first, then harden, verify, document, and record two teaching videos. Use a three-day timebox. Prefer a small working system over extra infrastructure.

Do not add Redis, social login, file uploads, email verification, password reset, real-time sockets, elaborate analytics, or a separate feedback-thread system in this version. Live deployment is a useful extra, not an explicit PDF requirement.

## D02 — Architecture and ownership

- Frontend: Next.js App Router, TypeScript, TailwindCSS, ShadCN.
- Backend: Express.js + TypeScript; owns validation, JWT verification, permission checks, business logic, and Prisma access.
- Database: PostgreSQL through Prisma.
- Frontend calls `/api/*` through a same-origin reverse proxy/rewrite to Express.
- Do not move the business API into Next.js as a replacement for Express.
- Keep database credentials and Prisma usage out of client bundles.
- API authentication remains mandatory even if Express is reachable directly.
- Prefer two simple folders, `frontend/` and `backend/`, without a new monorepo tool.
- Pin compatible dependency versions and commit lockfiles. Use documentation matching the installed Prisma version; do not mix version-specific setup instructions.

## D03 — Roles and seeded admin

Use exactly `STUDENT` and `MENTOR` for this version. Treat the PDF's directly seeded admin as the mentor/reviewer account and state this mapping in README.

Public signup can create only STUDENT. The backend rejects or excludes client-supplied role, status, studentId, and reviewer fields using explicit validated input schemas. Role never comes from editable browser state.

Seed a mentor idempotently using environment-provided credentials. Hash the password. Do not publish real production credentials in the repository or videos.

## D04 — Access matrix

| Capability | Anonymous | STUDENT | MENTOR |
|---|---|---|---|
| Signup/login and CSRF bootstrap | Yes | Yes | Yes |
| View own authenticated identity/logout | No | Yes | Yes |
| Create project submission | No | Yes | No |
| List own student submissions | No | Yes | No |
| List all submissions/global stats | No | No | Yes |
| Approve/reject pending submission | No | No | Yes |

Server checks are authoritative. Frontend guards improve navigation but are not a security boundary.

## D05 — Database model

`User`: id, name, email (unique), passwordHash, role, createdAt.

`Submission`: id, projectName, repoUrl, repoKey, liveUrl, description, status (default PENDING), studentId, reviewedById (nullable), reviewNote (nullable), reviewedAt (nullable), createdAt, updatedAt.

Relations:
- One User submits many Submissions through studentId.
- One User reviews many Submissions through reviewedById.
- Name Prisma relations explicitly because both foreign keys reference User.

Constraints/indexes:
- Unique normalized email.
- Compound unique `(studentId, repoKey)`.
- Starting indexes `(studentId, createdAt)` and `(status, createdAt)`; verify against actual queries.
- No user deletion workflow in scope; avoid cascading away reviewed history by accident.

A separate Feedback model is unnecessary for selected video 2A. If switching to topic 2B, revisit its Users/Submissions/Feedback teaching requirements.

## D06 — Submission and duplicate policy

Students may submit multiple projects. A student cannot submit the same repository twice, regardless of review status. Different students may submit the same repository; this is a deliberate policy, not a PDF requirement.

Accepted Repo URL policy for this version:
- GitHub repositories only; explain this restriction in the form and README.
- Accept HTTPS URLs on exactly `github.com` with two non-empty owner/repository segments.
- Reject embedded credentials, unexpected ports, non-repository paths, and additional path segments such as `/tree/main`.
- Normalize a trailing slash and a single `.git` suffix.
- Ignore query/hash when deriving repository identity; save a clean canonical URL.
- Use a lowercase GitHub owner/repository key for duplicate identity; do not apply this rule indiscriminately to arbitrary URL paths.
- Validate repository-path characters according to the adopted GitHub-only policy; do not claim the repository exists or is accessible.

Enforce `(studentId, repoKey)` in PostgreSQL. An application pre-check is optional for UX, not the concurrency guarantee. Catch the relevant Prisma unique-constraint error and return `409 DUPLICATE_SUBMISSION`.

Do not automatically fetch repository or live URLs on the server.

## D07 — Validation policy

Use Zod (or an equivalent explicit schema validator); validate all inputs on the backend. Client validation mirrors the rules for UX.

| Field | Adopted rule |
|---|---|
| name | Trimmed, 2–80 characters |
| email | Trimmed, lowercased, valid email syntax; document this identity policy |
| password | 12–128 characters; never silently trim; hash with Argon2id |
| projectName | Trimmed, 3–100 characters |
| repoUrl | Required, maximum 2048 characters, GitHub repository policy in D06 |
| liveUrl | Required, maximum 2048 characters, http/https, no embedded credentials |
| description | Trimmed, 20–2000 characters, plain text |
| reviewNote | Optional, trimmed, at most 1000 characters |
| review status | Exactly APPROVED or REJECTED |
| page | Integer >= 1; default 1 |
| limit | Integer 1–50; default 10 |
| list status | PENDING, APPROVED, REJECTED; absent means All |

All four project fields are required under this policy. Invalid or unknown request-body fields are rejected; frontend fields are not automatically spread into Prisma writes. Use a bounded JSON body, initially 32 KB, and handle oversized bodies clearly.

## D08 — JWT authentication

- After successful login, issue a JWT with `sub` (user ID), `iat`, `exp`, `iss`, and `aud`.
- Use an explicitly allowed signing algorithm, initially HS256 with a strong environment-provided random secret.
- Token lifetime: 30 minutes for this assessment version.
- Verify token signature and required claims; decoding alone is not verification.
- Load the current user by verified `sub`; use the current database role for authorization.
- Do not depend on a token role claim as the current source of truth.
- Return only safe user fields from `/api/auth/me`.
- No refresh-token flow in this version; expiration requires login again.

Trade-off: a database user lookup on protected requests adds a round-trip but makes current role checks straightforward. Do not claim this is stateless authorization or zero database cost.

## D09 — Cookie, origin, CSRF, and private caching

Production authentication cookie: HttpOnly, Secure, SameSite=Lax, Path=/, no Domain attribute. Use a host-only cookie, with an optional `__Host-` name where requirements are satisfied. Cookie expiration aligns with token expiration. Local HTTP development may disable Secure only in development.

Browser requests use the same-origin API path. If deploying across origins instead, revise cookie/CORS/CSRF configuration explicitly before launch; do not casually change to wildcard credentialed CORS.

CSRF implementation baseline:
1. Use a maintained signed double-submit CSRF implementation, not an improvised token comparison.
2. `GET /api/auth/csrf` issues the protected CSRF cookie and returns a token to frontend memory.
3. Send the token in a custom header on every state-changing request, including login, signup, and logout.
4. Backend validates the token and checks Origin against the exact configured frontend origin; reject unexpected or missing origins for these browser mutation endpoints.
5. Refresh the CSRF token if authentication/session binding changes.
6. Tests/API tools must obtain the CSRF token and supply the expected origin.

SameSite and CORS are not the only CSRF defenses. Configure any cross-origin access narrowly; no cross-origin access is required by the baseline.

Send `Cache-Control: private, no-store` on authenticated data and CSRF-bootstrap responses; do not place per-user responses into a shared cache.

## D10 — Logout and limitations

Logout clears the auth cookie with matching cookie scope/options. It does not revoke a copied JWT immediately. This version has no token denylist or refresh-token rotation; a copied valid JWT may remain usable until expiration unless the database user no longer passes checks. Document this rather than claiming instant global logout.

## D11 — Review state machine and concurrency

Allowed transitions:
```
PENDING -> APPROVED
PENDING -> REJECTED
```

Do not reopen or switch an already reviewed submission in this version.

Review flow:
1. Verify JWT and load current user.
2. Require MENTOR role.
3. Validate submission ID and review body.
4. Query the submission; return 404 if missing.
5. Update conditionally on both ID and `status=PENDING`.
6. Write status, reviewedById, reviewedAt, and optional reviewNote together.
7. If zero records were updated, return 409 (it is no longer pending).

A prior status check alone is not race protection. Keep the mutation conditional so competing reviewers cannot overwrite a completed review. Use a transaction if later changes introduce multiple dependent writes.

## D12 — Pagination, filtering, and statistics

- Use Prisma offset pagination (`skip`/`take`) for this small page-number dashboard.
- Default page size 10, maximum 50.
- Sort `createdAt DESC, id DESC`.
- Apply status in the database query.
- Reuse the same `where` condition for list results and filtered total.
- Out-of-range positive page returns an empty list with correct pagination metadata; do not silently rewrite the requested page.
- `totalPages = ceil(total / limit)`; zero records means zero totalPages.
- Frontend disables navigation when no next/previous page exists.
- Changing filter or page size resets page to 1.
- Stats are GLOBAL across all submissions, unaffected by table filter/page.
- Stats return total, pending, approved, rejected using database aggregation.
- Rows/count and stats are not promised to be a single globally consistent snapshot during concurrent writes; refetch after mutation and handle transient differences honestly.

Offset pagination can become costly at very deep offsets. Cursor pagination and caching are future scaling options, not claims of current implementation.

## D13 — Frontend fetching and mutation behavior

Use one simple data-fetching approach consistently. Baseline: TanStack Query for authenticated client-side table/stats/own-submission requests; ordinary Next.js components for static page structure.

Suggested query keys:
- `['mentor-submissions', { status, page, limit }]`
- `['mentor-stats']`
- `['my-submissions', { page, limit }]`
- `['current-user']`

After successful review, invalidate mentor list and stats. After submission, invalidate the student's own list. Clear authenticated query data on logout or user change. Do not optimistically change review counts in this version. Show success only after server confirmation; expose refresh errors rather than silently showing stale data as current.

Distinguish first-load UI, background refetch, empty results, API errors, field errors, and unexpected rendering errors. Route error boundaries handle rendering failures; query/API failures need their own visible states.

## D14 — Rate limiting and production safeguards

Initial configurable policies, not universal performance guarantees:
- Submission: 5 attempts / 10 minutes / authenticated student.
- Signup: 10 attempts / hour / IP.
- Login: 20 attempts / 15 minutes / IP, plus 5 failed attempts / 15 minutes / normalized email + IP; clear that pair's failure counter after successful login.
- CSRF bootstrap: basic IP limit to avoid unbounded abuse.

Return 429 with understandable retry information. Enforce submission limits after authentication. Use a maintained limiter; test its actual success/failure counting behavior.

Single-instance in-memory store is acceptable for the assessment baseline, but resets on restart and is not shared across replicas. A shared store is required before relying on these limits in multi-instance deployment. Configure `trust proxy` to the known hosting topology; do not blindly trust forwarded IP headers.

Use Helmet, production HTTPS, safe log handling, environment validation at startup, centralized error handling, and parameterized Prisma operations. Avoid unsafe raw SQL. Never expose passwords, tokens, secrets, or raw DB errors.

## D15 — API errors and safe serialization

Use the endpoint contract in requirements.md. Errors follow:
```
{ error: { code, message, fieldErrors? } }
```

Use 400/401/403/404/409/429/500 consistently. Return 201 for created users/submissions and 200 for other JSON successes. A 500 response gives a generic message; log diagnostic details safely on the server. Do not reveal whether email or password was wrong during login. Return explicitly selected fields, never entire User records.

## D16 — Videos and teaching preparation

Selected topics:
- Category 1: 1C Authentication vs Authorization (RBAC).
- Category 2: 2A Securing a Route.

Both videos are Bengali, 10–12 minutes each, recorded with OBS and visible lower-right facecam, using this project. Topic 1C teaches the why and role/performance trade-offs. Topic 2A live-codes verified identity extraction, database lookup, mentor/resource permissions, conditional status update, and failure cases.

Prepare an isolated teaching branch/start point without breaking the submission branch. Rehearse using test data only. Keep secrets out of screen capture. Check audio, facecam position, readability, duration, upload processing, and anonymous view permissions.

## D17 — Three-day execution order

Day 1: requirement decisions -> schema/API contract -> setup/migration/seed -> signup/login -> secure submission with validation, duplicate constraint, rate limit -> minimal working form.

Day 2: mentor list/filter/pagination/stats -> conditional review -> frontend integration and states -> security/concurrency checks -> early deployment smoke test if deploying.

Day 3: blocking bug fixes -> clean setup/build verification -> README -> two video recordings -> playback/upload/link checks -> final submission. Freeze new features.

Learn just enough for the current feature, implement it, test it, and explain it before moving on. Reserve video/upload buffer; coding is not the entire task.

## D18 — Delivery and unresolved organizer details

The PDF permits a private repository initially but requires it to be public after the deadline, with disqualification if unreachable. Verify the exact deadline, timezone, and visibility timing with organizers. Do not invent an exact deadline from this document.

Submit the GitHub repository and two video links through their Google Form. Use Unlisted YouTube or Google Drive with open-view permission. All required tasks must be completed; two videos from the same category cause immediate disqualification.

README must explain setup, environment names, migrations, mentor seed, scripts, roles, duplicate rules, API, security limitations, and video topics/links. Commit migrations and dependency lockfiles. Verify from a fresh database. Never commit real secrets, even to a repository that will later be made public.

## Change log

| Revision | Change |
|---|---|
| Initial | Shared frontend/backend baseline; separates explicit PDF requirements from adopted decisions. |
