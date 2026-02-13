# Security Hardening Pass

## API protections
- Added strict query validation for `size`.
- Added in-memory rate limiting by source IP for edge route.
- Added response hardening headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Content-Security-Policy` for API JSON responses.

## CI security scanning
- Added `Security` GitHub Actions workflow with:
  - `npm audit --audit-level=high`
  - CodeQL analysis for JavaScript/TypeScript.
