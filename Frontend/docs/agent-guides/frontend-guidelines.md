# Frontend Guidelines

## Component Architecture

- Keep components small, composable, and focused on rendering.
- Every component must define a typed `Props` interface.
- Move non-render logic out of components into hooks.
- Do not hardcode user-facing text in components.

## Hook Patterns

- Use hooks for business logic, side effects, and state transitions.
- Keep hooks pure in signature and return typed values.
- Prefer feature-specific hooks under `src/hooks` or feature-local hook files.

## Folder Rules

- `src/components`: shared presentational components.
- `src/features`: feature-oriented UI modules.
- `src/hooks`: reusable logic hooks.
- `src/services`: API/integration boundaries.
- `src/constants`: labels and other centralized constants.
- `src/types`: shared TypeScript types and interfaces.

## State Management Recommendations

- Use local state for isolated UI concerns.
- Use custom hooks to encapsulate domain behavior.
- Promote state up only when multiple siblings require it.
- Introduce external state libraries only when complexity requires it.

## Validation Workflow

- Run `pnpm lint` before completing any task.
- Run `pnpm typecheck` before completing any task.
- Run `pnpm verify` for final validation.
- Fix all errors before marking implementation as done.
