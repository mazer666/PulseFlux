# Cloudflare Deployment Guide (Noob-Friendly)

If your site shows:

> "SwapPuzzle deployment is online. Configure a Next.js-compatible Cloudflare build step to serve the full app."

then Cloudflare deployed a placeholder Worker, not your built Next.js app.

## 1) What changed in this repo

This repo is now configured so Wrangler uploads the **real Next.js output**:

- `npm run cf:build` builds Next.js for Cloudflare (`@cloudflare/next-on-pages`) and writes `.vercel/output/static/.assetsignore` with `_worker.js`
- `wrangler.jsonc` points to the generated worker and assets:
  - `main: .vercel/output/static/_worker.js`
  - `assets.directory: .vercel/output/static`
- `wrangler.jsonc` now also has `build.command = "npm run cf:build"`, so `npx wrangler versions upload` first creates `.vercel/output` automatically.

## 2) Cloudflare settings you should use

In Cloudflare (Workers build/deploy command), simplest setting is:

```bash
npx wrangler versions upload
```

Why this works now: Wrangler runs `build.command` from `wrangler.jsonc` first, so the entry file exists before upload.

If you only want to test build+upload locally without publishing, use:

```bash
npm run cf:deploy:dry
```

## 3) Local test (copy/paste)

Run these commands in project root:

```bash
npm install
npm run cf:build
npx wrangler versions upload --dry-run
```

Expected result: no "Missing entry-point" / "entry-point file ... was not found" error and no `_worker.js directory as an asset` error; Wrangler reports upload size.

## 4) If deployment still serves old placeholder text

1. Confirm latest commit (with new `wrangler.jsonc`) is pushed.
2. Trigger a new Cloudflare deployment manually.
3. Open the newest deployment URL (not an older one).
4. Hard refresh browser (`Ctrl+Shift+R`).

## 5) Typical troubleshooting

- Build fails: verify Node version and build command.
- API fails: verify binding names exactly match code usage.
- DB errors: check migrations ran and schema exists.
- `wrangler versions upload` fails with "Missing entry-point": ensure `build.command` exists in `wrangler.jsonc` and `npm run cf:build` works locally.
- `Uploading a Pages _worker.js directory as an asset`: ensure `.vercel/output/static/.assetsignore` contains `_worker.js` (this repo now writes that automatically in `cf:build`).
