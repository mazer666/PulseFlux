# ADR 0001: Select Next.js + Cloudflare Pages/Functions/D1 for MVP

- **Status:** Accepted
- **Date:** 2026-02-12

## Context

The project requires:

- Mobile-first performant web delivery.
- Strong developer ecosystem for open-source collaboration.
- Simple deployment path for beginners.
- Backend support for puzzle generation and future extensibility.

## Decision

Use:

- Next.js + TypeScript for frontend.
- Cloudflare Pages for frontend hosting.
- Cloudflare Functions for API/backend logic.
- Cloudflare D1 for puzzle metadata and future player/account schema.

## Consequences

### Positive

- End-to-end JavaScript/TypeScript consistency.
- Fast global edge distribution.
- Good path for future auth and multiplayer services.
- Beginner-friendly deployment with documented CLI/workflow.

### Trade-Offs

- D1 constraints require careful SQL/query planning.
- Cloudflare-specific adapters/configuration add platform coupling.

## Alternatives Considered

1. Vercel + serverless DB
2. Netlify + Fauna/Supabase
3. AWS full custom stack

These were rejected for now due to preference alignment and operational simplicity targets.
