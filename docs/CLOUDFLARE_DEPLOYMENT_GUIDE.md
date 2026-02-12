# Cloudflare Deployment Guide (Beginner Friendly)

This guide explains how to deploy SwapPuzzle with Cloudflare Pages + Functions + D1.

## 1. What You Need

1. A GitHub account.
2. A Cloudflare account.
3. Node.js LTS installed locally.
4. `npm` available in terminal.

## 2. Connect Repository to Cloudflare Pages

1. Push your code to GitHub.
2. In Cloudflare dashboard, open **Workers & Pages**.
3. Click **Create application** → **Pages** → **Connect to Git**.
4. Select your `SwapPuzzle` repository.
5. Set build command and output directory according to the final frontend setup.

## 3. Create D1 Database

1. In Cloudflare dashboard, go to **D1**.
2. Click **Create Database**.
3. Name it, e.g., `swappuzzle-db`.
4. Save the Database ID for bindings.

## 4. Configure Bindings

1. In your Pages project settings, open **Functions** / **Bindings**.
2. Add D1 binding, e.g., variable `DB` linked to `swappuzzle-db`.
3. Add any environment variables required by the app.

## 5. Deploy and Verify

1. Commit and push to `main`.
2. Cloudflare Pages builds automatically.
3. Open the deployment URL.
4. Verify core pages load and puzzle API endpoints respond.

## 6. Typical Troubleshooting

- Build fails: verify Node version and build command.
- API fails: verify binding names exactly match code usage.
- DB errors: check migrations ran and schema exists.

## 7. Next Step (Recommended)

Automate validation via GitHub Actions so every push runs lint/tests/build before Cloudflare deployment.
