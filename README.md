# ANGEL ONE DOCUMENTS

Single Next.js application (App Router, TypeScript, Tailwind CSS, MongoDB) for the public website, service-request workflow, and admin portal.

## Requirements

- Node.js 20+
- MongoDB (local or Atlas)
- SMTP credentials for office notifications and client acknowledgements
- Private document storage: local filesystem (development) or S3-compatible bucket (production)

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Set at minimum:

   - `MONGODB_URI`
   - `SESSION_SECRET` (32+ random characters)
   - `NEXT_PUBLIC_SITE_URL`
   - `OFFICE_EMAIL` (defaults to servicerequests@angelonedocuments.com)
   - SMTP variables when you are ready to send email

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the first admin (no public registration):

   ```bash
   npm run create:admin -- you@example.com "YourSecurePassword"
   ```

5. Start development:

   ```bash
   npm run dev
   ```

   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Document uploads

- Combined PDF limit: **10 MB** (enforced client- and server-side).
- PDFs are stored privately (`STORAGE_DRIVER=local` uses `.data/private-uploads`, not served as static files).
- Production: set `STORAGE_DRIVER=s3` and configure S3 variables.
- On platforms with a smaller serverless body limit (e.g. Vercel ~4.5 MB), deploy with S3 direct upload or a host that allows 10 MB request bodies. This project submits multipart form data to `/api/service-requests`; increase platform limits or extend with presigned uploads if needed.

## Email behaviour

- Office summary → `OFFICE_EMAIL` / servicerequests@angelonedocuments.com with `Reply-To` set to the requester.
- Requester receives a short acknowledgement with reference number only (no matter details or attachments).
- If the request is saved but SMTP fails, the booking remains in MongoDB with `officeEmailStatus: failed`. Retry from **Admin → Bookings → [request] → Retry office email**.

## Admin portal

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin` | Dashboard counts and recent requests |
| `/admin/content` | Edit the text of the one-page website (hero, who we serve, contact details) |
| `/admin/bookings` | Search, filter, and manage service requests |
| `/admin/testimonials` | Add/edit testimonials (unpublished by default) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run create:admin` | Create first admin user |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## Production

1. Set all production environment variables on your host (see `.env.example`). **Use only the host’s env UI** — do not rely on a different `MONGODB_URI` in your shell than the one the app reads.
2. Use MongoDB Atlas (or managed MongoDB). Run once against **the same** `MONGODB_URI` the app uses:
   ```bash
   npm run create:admin -- admin@yourdomain.com "long-secure-password" --reset
   ```
3. Set `STORAGE_DRIVER=s3` with a private bucket for PDFs.
4. Configure verified SMTP (`SMTP_FROM`, `SMTP_*`).
5. Set `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS URL (sitemap, metadata, emails).
6. Build and start:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   npm run start
   ```

Dev-only helpers (`/api/auth/seed-admin`, `/api/auth/db-check`) return **404** in production.

Admin routes are excluded from indexing via `robots.txt`.

## Verification checklist

- [ ] `npm run create:admin` succeeds
- [ ] Submit a valid request on the homepage contact form → appears in admin with reference number
- [ ] Invalid PDF / oversize file rejected by API
- [ ] `/api/admin/documents` and admin pages return 401 when logged out
- [ ] Publish a testimonial → visible on homepage; unpublish → section hidden when empty

Without SMTP or S3 credentials, core flows still work locally; email states will show as failed until SMTP is configured.
