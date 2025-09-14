  # FurShield

**Every Paw/Wing Deserves a Shield of Love**

---

## Team Introduction

**Team Name: Tech Gurus**

* **Himesh** – Backend Developer, responsible for coordination and database design.
* **Muhammad Talha** – Frontend Developer, focused on UI, UX, and React implementation.
* **Muhammad Nabeel** – Frontend Developer, also responsible for UI, UX, and React implementation.
* **Shameer Ali Shah** – Backend Developer, handling Eloquent queries and API implementation.

---

FurShield is a full-stack pet care web application that helps users manage pet profiles, set feeding/grooming/vaccine reminders, and track pet-related tasks. The project uses a TypeScript frontend (Vite/React) and a Laravel PHP backend.

---

## Table of contents

* [Features](#features)
* [Tech stack](#tech-stack)
* [Repository structure](#repository-structure)
* [Prerequisites](#prerequisites)
* [Environment variables](#environment-variables)
* [Installation & local setup](#installation--local-setup)

  * [Backend (Laravel)](#backend-laravel)
  * [Frontend (Vite / React / TypeScript)](#frontend-vite--react--typescript)
* [Running the app](#running-the-app)
* [Database & seeding](#database--seeding)
* [Testing](#testing)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [Authors / Team](#authors--team)
* [License](#license)
* [Troubleshooting](#troubleshooting)

---

## Features

* User authentication (register/login)
* Create and manage pet profiles
* Set reminders for feeding, grooming, and vaccinations
* Basic notifications/reminders (local or email — depending on backend config)
* Admin / management endpoints (API-ready)

---

## Tech stack

* Frontend: React + TypeScript + Vite.
* Backend: Laravel (PHP).
* Database: MySQL / MariaDB (configurable in `.env`).

---

## Repository structure (high level)

```
/app                # Laravel app code
/bootstrap
/config
/database           # migrations & seeders
/public             # built frontend (for production) + Laravel public assets
/resources          # views, frontend entry if any
/routes
/tests
/package.json       # frontend scripts & deps
/composer.json      # backend deps
/.env.example       # example env vars
vite.config.ts
tsconfig.json
...
```

---

## Prerequisites

* Git
* PHP >= 8.x
* Composer
* Node.js (>= 16 recommended) and npm
* MySQL or compatible DB
* (Optional) Redis for queueing, Mail server credentials for notifications

---

## Environment variables

Copy the example file and update secrets:

```bash
cp .env.example .env
# or on Windows (PowerShell)
copy .env.example .env
```

Open `.env` and set:

* `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
* `APP_URL`, `MAIL_*` (if email is used)
* Any API keys you may need

---

## Installation & local setup

> These are standard steps for a Laravel + Vite project. Run them from your project root.

### Backend (Laravel)

1. Install PHP dependencies:

   ```bash
   composer install
   ```
2. Create `.env` from example and generate app key:

   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan storage:link
   ```
3. Set database credentials in `.env`.
4. Run migrations & seeders:

   ```bash
   php artisan migrate --seed
   ```
5. (Optional) If using queues:

   ```bash
   php artisan queue:work
   ```

### Frontend (Vite / React / TypeScript)

1. Install Node dependencies:

   ```bash
   npm install
   ```
2. Start dev server:

   ```bash
   npm run dev
   ```
3. To build for production:

   ```bash
   npm run build
   ```

---

## Running the app (development)

Open two terminals:

**Terminal 1: Backend**

```bash
# in project root
php artisan serve --host=127.0.0.1 --port=8000
# or use Valet / Sail / custom server
```

**Terminal 2: Frontend**

```bash
npm run dev
# Vite typically runs on http://localhost:5173 (or the port printed by Vite)
```

If the frontend is configured to proxy API requests, dev server will forward to Laravel. If not, update frontend API base URL to point to `http://127.0.0.1:8000` (or your chosen backend host).

---

## Database & seeding

To create the DB and populate sample data:

```bash
# create database (mysql)
# then:
php artisan migrate
php artisan db:seed
```

If migrations fail, confirm DB credentials in `.env` and that your DB server is running.

---

## Testing

**PHP / Laravel**

```bash
php artisan test
# or vendor/bin/phpunit
```

**Frontend (if tests exist)**

```bash
npm test
```

Adjust commands if your repo uses different test runners.

---

## Deployment (quick notes)

* Build frontend: `npm run build` and deploy the dist to a static host or copy into `public/` for Laravel to serve.
* Set `APP_ENV=production` and configure your web server (Nginx/Apache) document root to Laravel `public/`.
* Run `php artisan migrate --force` for production migrations.
* Use proper secrets management for `.env` (do not commit it).

---

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feat/my-change`
3. Make changes, add tests where appropriate.
4. Commit & push, then open a PR with a clear description.

Please follow the existing code style and run linters/tests before opening PRs.

---

## Authors / Team

* Himesh – Backend Developer (Coordination, DB design)
* Muhammad Talha – Frontend Developer (UI/UX, React)
* Muhammad Nabeel – Frontend Developer (UI/UX, React)
* Shameer Ali Shah – Backend Developer (Eloquent queries & API implementation)

---

## License

This repository currently does not include a license file. Add a `LICENSE` file (e.g., MIT) if you want to clarify reuse/redistribution.

---

## Troubleshooting & tips

* **Composer memory issues**: `COMPOSER_MEMORY_LIMIT=-1 composer install`
* **Node / npm issues**: delete `node_modules` and `package-lock.json` then `npm install`.
* **Missing **\`\`** keys**: copy from `.env.example`.
* **CORS / API errors**: ensure the frontend's API base URL matches Laravel `APP_URL` and configure CORS in `app/Http/Middleware` or `config/cors.php`.

---

If you want, I can also add a `LICENSE` (MIT) and a short `CONTRIBUTING.md`, or generate simple GitHub Actions CI badges. Let me know which you prefer.
