# Employee Management System - Technical Notes

## Architecture Overview

### Frontend Architecture
I chose a **feature-first architecture** where code is organized by domain (employees) rather than by type (components, hooks, etc.). This keeps related code together and makes it easier to understand the full picture of a feature.

```
src/
├── app/                    # App entry, routing, layout
├── features/employees/     # Feature module
│   ├── __types__/         # Feature-specific types
│   ├── detail/            # Employee detail view
│   ├── form/              # Create/edit form
│   └── list/              # Employee list + filtering
├── shared/                # Cross-cutting concerns
│   ├── components/        # Reusable UI (Modal, FormFields)
│   ├── hooks/             # Reusable hooks
│   └── lib/               # API, queries, utilities
└── test/                  # Test utilities
```

### Backend Architecture
The server is a simple Express API with:
- File-based persistence (JSON)
- Zod validation for request bodies
- Multer for avatar uploads
- Clear separation between routes and business logic

## Key Technical Decisions

### 1. State Management: URL + React Query

**Decision:** Filter state lives in URL query parameters, server state in React Query.

**Why:**
- Filters in URL enable sharing, bookmarking, and browser history
- React Query handles caching, background refetching, and loading states
- No Redux/Context needed - each tool does one job well

**Tradeoff:** URL parsing adds complexity, but the UX benefits outweigh it.

### 2. Form Handling: Plain React

**Decision:** Used useState + Zod instead of React Hook Form or Formik.

**Why:**
- The form is straightforward (8 fields, no dynamic arrays)
- Full control over validation timing and error display
- Smaller bundle, fewer abstractions to learn

**Tradeoff:** More boilerplate for field wiring, but manageable at this scale.

### 3. Styling: Tailwind CSS

**Decision:** Tailwind with a custom dark theme and utility function (`cn`).

**Why:**
- Rapid prototyping with consistent spacing/colors
- No CSS file management
- Easy responsive design with breakpoint prefixes

**Tradeoff:** Long class strings can be hard to read; mitigated by extracting components.

### 4. Type Safety: TypeScript + Zod

**Decision:** Zod schemas define the source of truth for types.

**Why:**
- Single definition for both TypeScript types and runtime validation
- Form validation uses the same schema as API contracts
- Catches type mismatches at the boundary (user input)

**Tradeoff:** Zod adds bundle size (~12kb), but type safety is worth it.

## Features Implemented

### Core Requirements
- [x] Employee list with department grouping
- [x] Search filtering (debounced, by name/email/title)
- [x] Department filter (multi-select)
- [x] Status filter (active/inactive)
- [x] Empty departments hidden when filtering
- [x] Edit employee with form validation
- [x] Create employee with redirect to list
- [x] Delete employee with confirmation modal

### Bonus Features
- [x] Sorting by first/last name (asc/desc)
- [x] Pagination with configurable page size
- [x] Loading skeletons and error states
- [x] Responsive design (mobile-friendly)
- [x] Avatar upload with drag-and-drop
- [x] Unit and integration tests (161 tests)
- [x] Grid/list view toggle
- [x] Active filter chips with clear-all

### API Endpoints
- `GET /employees` - List with filtering, sorting, pagination
- `GET /employees/:id` - Single employee
- `POST /employees` - Create (also aliased as `/employees/new`)
- `PUT /employees/:id` - Update (supports partial updates)
- `DELETE /employees/:id` - Delete
- `GET /departments` - Reference data
- `POST /upload` - Avatar upload

## Testing Strategy

**Philosophy:** Test behavior, not implementation.

- **API tests:** Mock fetch, verify URL construction and error handling
- **Component tests:** User interactions via Testing Library
- **Integration tests:** Page-level tests with mocked queries

**Coverage:** ~50% code is tests (2,240 lines tests / 2,318 lines code)

## Tradeoffs Made

| Decision | Tradeoff | Reasoning |
|----------|----------|-----------|
| No global state | Props passed through layers | App is small enough; avoids premature abstraction |
| Client-side grouping | Won't scale to 10k+ employees | Server-side grouping would add API complexity |
| Modal without focus trap | Accessibility gap | Scope tradeoff; would add for production |
| Validation on submit only | All errors shown at once | Simpler implementation; errors clear on fix |
| File-based persistence | Not production-ready | Sufficient for demo; easy to swap for real DB |

## What I'd Add With More Time

### Immediate Improvements
1. **Accessibility audit** - Focus management, ARIA labels, keyboard navigation
2. **Optimistic updates** - Delete/update without waiting for server
3. **Request cancellation** - Abort in-flight requests on filter change
4. **E2E tests** - Playwright tests for critical user flows

### Production Readiness
1. **Authentication** - JWT/session-based auth
2. **Error tracking** - Sentry integration
3. **Performance monitoring** - Core Web Vitals tracking
4. **Rate limiting** - Prevent API abuse
5. **Database** - PostgreSQL/MongoDB instead of JSON file

### Feature Ideas
1. **Bulk operations** - Select multiple employees for delete/status change
2. **Export** - CSV/PDF export of filtered results
3. **Audit log** - Track who changed what and when
4. **Undo delete** - Soft delete with recovery option

## Performance Considerations

- **Debounced search** (300ms) prevents API spam during typing
- **React Query caching** (5 min staleTime) reduces redundant fetches
- **Skeleton loading** improves perceived performance
- **Pagination** limits data transfer per request

## Lessons Learned

1. **URL state is powerful** - More work upfront, but great UX payoff
2. **Zod is excellent** - Single source of truth for types and validation
3. **React Query simplifies a lot** - Caching, loading states, error handling
4. **Feature-first > type-first** - Easier to navigate and understand

---

*Built with React 19, TypeScript, TailwindCSS, React Query, Zod, and Express*
