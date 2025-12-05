# Manacheck: Web-based MTG decklist filter

Manacheck is a web app that lets you fetch and filter MTG decklists from supported sites.

"Searches the cards **you** want in the decklists some rando sent."

## 🌐 For normal users

If you just want to use the app, visit:

https://xdainz.github.io/manacheck/

This link is a ready-to-use build.

## ⚙️ Supported sources

-   ManaBox: `https://manabox.app/`
-   Moxfield: `https://moxfield.com/`

## 👨‍💻 Collaborating on this project

If you'd like to contribute or run a development instance for development/testing, follow these steps.

1. Fork and clone the repository, then install dependencies:

```bash
git clone https://github.com/xdainz/manacheck.git
cd manacheck
npm install
```

### (If you are not changing parser or workers behaviour you can skip steps 2 & 4)

2. Configure environment variables

-   Copy the example file and **do not commit** your `.env.production`:

```bash
cp .env.example .env.production
```

-   Edit `.env.production` and set at minimum:

```
VITE_WORKER_BASE=https://your-worker.your-account.workers.dev
```

This value is used when the frontend runs in production mode; in development the app uses the Vite dev proxy defined in `vite.config.ts`.

3. Run the app locally

```bash
npm run dev
```

4. Setting up and publishing the Cloudflare Worker

-   Follow the instructions in `workers/README.md`

5. Tests and contribution workflow

-   Run tests before opening a PR:

```bash
npm test
```
