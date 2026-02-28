# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm start` (runs `ng serve`, default port 4200)
- **Build:** `npm run build` (production) or `ng build --configuration development`
- **Tests:** `npm test` (uses Vitest via `@angular/build:unit-test`)
- **Run single test:** `npx vitest run src/app/pages/login/login.spec.ts`
- **SSR server:** `npm run serve:ssr:Plat-front`

## Architecture

Angular 21 application with SSR (Server-Side Rendering) using Express. Uses standalone components (no NgModules).

### Project Structure

- `src/app/config/app.config.ts` — App-wide providers (router, hydration)
- `src/app/routes/app.routes.ts` — Route definitions
- `src/app/pages/` — Page components (one folder per page: `login/`, `cadastro/`)
- `src/app/server/` — SSR config and server-side routes
- `src/server.ts` — Express SSR entry point

### Conventions

- **Styling:** SCSS (configured in angular.json schematics)
- **Component naming:** Classes use PascalCase without "Component" suffix (e.g., `Login`, `Cadastro`, `App`)
- **File naming:** Component files use just the name without `.component` (e.g., `login.ts`, `login.html`, `login.scss`)
- **Forms:** Reactive forms with `FormBuilder` and `Validators`
- **Formatting:** Prettier with single quotes, 100 char print width, Angular HTML parser (configured in package.json)
- **Language:** Portuguese for user-facing text and variable names (e.g., `cadastro`, `nome`, `Esqueceu a senha`)
