# Notes

## Project structure

Went with feature-first organization (`features/employees/`) rather than grouping by type (`components/`, `hooks/`, etc). Keeps related code together - when I'm working on the employee list, everything I need is in one folder.

```
src/
├── features/employees/    # all employee stuff lives here
│   ├── detail/
│   ├── form/
│   └── list/
└── shared/               # truly reusable bits (Modal, API client)
```

## Why I made certain choices

**Filters in URL params** - More work than just useState, but you can share links, use back button, refresh without losing state. Worth it.

**React Query for server state** - Handles caching, refetching, loading/error states. Didn't need Redux or Context for anything.

**Plain React for the form** - Could've used React Hook Form but the form is simple (8 fields). useState + Zod validation was fine and one less dependency.

**Zod everywhere** - Defines types and validates at runtime. Form validation and API responses use the same schemas.

## What's implemented

Core assignment: list view with filters (search, department, status), create/edit/delete employees, department grouping.

Bonus assignment: sorting, pagination, avatar upload with drag-drop, grid/list toggle, filter chips, loading skeletons, 161 tests.

## Known tradeoffs

- Department grouping happens client-side. Fine for hundreds of employees, wouldn't scale to thousands. Would need server-side grouping for that.
- Modal doesn't trap focus. Should add that for accessibility.
- No optimistic updates on delete - waits for server response. Would be snappier with optimistic UI.
- File-based storage on the backend. Obviously not production-ready, but easy to swap for a real database.

## More features that could be implemented

E2E tests with Playwright or CircleCI
Full database implementation
Additional Features: - Org Chart: based off Supervisor relationship allowing for an org-tree - Org chart Drafts - Revision cards - Backend CTE to prevent N + 1 - Jira Integration
Sync with permissions to sync tickets - Time off requests - Invitations for employees + other users - Resend for programatic emails - Add squad data: many-to-many relationship with junction table
Make the app enterprise level to accept black box data - Auth: Auth0, SSO - Cloud Storage: Azure Blob Storage, S3, Google Cloud Storage
Observation - DataDog or Sentry
Hosting - Frontend Vercel - Backend ECS - Cloudfront for proxies

For actual production: auth, error tracking, rate limiting, real database.

## Random notes

- Search is debounced 300ms so we're not hammering the API on every keystroke
- React Query caches for 5 min which cuts down on refetches
- Tests are about half the codebase (~2200 lines each)
