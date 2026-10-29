# Prototype Instructions

## Remi landing direction

- The user requests a close visual recreation of https://cindy.app/ under the name Remi, implemented in React.
- Preserve the palette (#0f0e15 ink, #f43d3f red, #f3ede2 cream), typography (Anton, Geist, Geist Mono), illustrated hero, numbered sections and angled tickers.
- Product copy must describe the actual Serguiales16/remi fork of OpenClaw. Remi-specific memory, behavior and security capabilities are still in design.
- The product and the landing are named Remi; no Lucy reference remains. The landing is self-contained at the repo root and lives in `Serguiales16/remi-web`; the agent fork lives in `Serguiales16/remi`. Spanish is the default, with an English alternative.
- The landing ships with a Docker setup (`Dockerfile`, `deploy/nginx.conf`, `docker-compose.yml`) that builds the site and serves `dist/client` with Nginx on port 8080.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
