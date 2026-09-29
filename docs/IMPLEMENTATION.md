# Proof — Implementation Plan

Photo-verified checklists for multi-location operators.
Task → required photo → submit → manager reviews.

Repo name: `proof-app`
Public name: Proof
Do not call this PrismAudit.

---

## What you are building

Staff phone PWA + manager dashboard.

1. Manager creates a template (opening, closing, restroom, etc.)
2. Items can require a photo
3. Staff open today’s checklist
4. Check items, upload photos
5. Submit
6. Manager sees complete / missing / flagged

Do not sell this as covert employee surveillance. Tell staff photos are for the checklist. Location fields are optional in v1 if they create pushback — start with timestamp + photo only.

---

## Day 0 — Accounts

- GitHub private repo `proof-app`
- Vercel + Supabase (Auth + Storage)
- No Twilio required for v1

---

## GitHub first

```bash
mkdir proof-app && cd proof-app
git init
git add .
git commit -m "Proof implementation plan"
git branch -M main
git remote add origin https://github.com/YOUR_USER/proof-app.git
git push -u origin main
```

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*"
```

Import in Vercel. Create Storage bucket `proof-photos` (private).

---

## Schema

```sql
create extension if not exists pgcrypto;

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'staff',
  unique (org_id, user_id)
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  name text not null
);

create table checklist_templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create table template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references checklist_templates(id) on delete cascade,
  instruction text not null,
  requires_photo boolean default true,
  sort_order int default 0
);

create table checklist_submissions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references checklist_templates(id) on delete set null,
  org_id uuid references organizations(id) on delete cascade,
  location_id uuid references locations(id),
  submitted_by uuid references auth.users(id),
  status text default 'submitted',
  created_at timestamptz default now()
);

create table submission_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references checklist_submissions(id) on delete cascade,
  template_item_id uuid references template_items(id),
  is_completed boolean default false,
  photo_url text,
  taken_at timestamptz
);

alter table organizations enable row level security;
alter table memberships enable row level security;
alter table locations enable row level security;
alter table checklist_templates enable row level security;
alter table template_items enable row level security;
alter table checklist_submissions enable row level security;
alter table submission_answers enable row level security;
```

Storage policy: only members of the org can read/write objects prefixed with `org_id/`.

---

## Build order (10 days)

| Day | Ship |
|-----|------|
| 1 | Auth + org + roles owner vs staff |
| 2 | Create location + template + items |
| 3 | Staff “today’s checklist” screen |
| 4 | Camera / file upload, compress before upload |
| 5 | Save answers + photo URLs |
| 6 | Submit + lock the submission |
| 7 | Manager inbox: open a submission, view photos |
| 8 | Flag or approve |
| 9 | Simple cron later; v1 = staff taps “start checklist” |
| 10 | One store pilot on opening/closing |

Skip EXIF/GPS spoof-detection in v1 unless a pilot demands it. Timestamp from the server is enough to start.

---

## Routes

- `/login`
- `/app` manager home
- `/app/templates`
- `/app/submissions`
- `/app/submissions/[id]`
- `/m` staff checklist
- `/api/upload` signed upload if you do not upload straight to Supabase Storage from the client

---

## Costs until live

| Item | Cost |
|------|------|
| Free hosting + DB | $0 |
| Photo storage on free tier | $0 until a few GB |
| Domain | $0–16 |
| Time | ~40–50 hours |

Cash to first store demo: **under $20**.

## Everyday usage

- Photos are the meter: thousands of compressed images still cheap
- At 5 locations, budget **$25/mo** Supabase Pro when free storage/egress runs out
- Charge Proof **$49–129/mo** for a few locations, more for enterprise later

---

## Do not build in v1

pg_cron assignment engine, franchise scoreboards, GPS policing, native apps, training LMS.

## Done when

A staff user completes a 5-item list with 3 photos, a manager opens it on desktop, another org cannot see those photos.
