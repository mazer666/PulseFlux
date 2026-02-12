# Code Style Guide

## 1. Language and Readability

- Primary source code language: English.
- Variable/function names should be descriptive.
- Avoid abbreviations unless they are widely known.

## 2. Commenting Standard (Explainer Style)

- Add comments that explain **why** and **how**, not only what.
- Keep comments beginner-friendly.
- For complex functions, include a short step-by-step block comment.
- For API handlers, document input, validation, and output behavior.

## 3. Type Safety

- Use TypeScript strict mode.
- Avoid `any` unless justified with inline comment.
- Define shared types for puzzle data contracts.

## 4. Function Design

- Prefer small, single-purpose functions.
- Keep side effects explicit.
- Extract reusable utilities.

## 5. UI Standards

- Components should be accessible by default.
- Ensure keyboard and screen reader behavior is intentional.
- Keep visual states explicit (hover/focus/active/disabled).

## 6. Error Handling

- Provide user-friendly messages for recoverable failures.
- Log technical detail in developer-facing channels only.

## 7. Testing Expectations

- New logic must include tests.
- Bug fixes should include regression tests.

## 8. Documentation Synchronization

Whenever architecture or behavior changes:

- Update relevant files in `/docs`.
- Add an entry to `CHANGELOG.md`.
