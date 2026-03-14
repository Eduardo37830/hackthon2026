# Frontend Agent Rules

This repository is optimized for AI coding agents.

## Stack

React + TypeScript + Vite

## Core Principles

Maintainability is more important than speed.

Components must be small and composable.

Business logic belongs in hooks.

Rendering belongs in components.

## TypeScript

Strict mode is mandatory.

Never use `any`.

Use explicit types.

## Labels

User-facing text must never be hardcoded.

Always import labels from:

`src/constants/labels.ts`

## Validation

Before any task is considered complete the following commands must pass:

`pnpm lint`

`pnpm tsc --noEmit`

If validation fails the agent must fix the errors.

## Agent Completion Policy

No implementation is considered finished unless:

- lint passes
- typescript passes
- no magic literals exist
- component props are typed
