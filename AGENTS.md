# OneCity — Codex Project Guide

This file is the operational reference Codex must read before implementing any ticket in this repository.

## Project Context

- Repository: `Onecity`
- Application/package name: `onecity`
- Primary language: French (`app/layout.tsx` sets `<html lang="fr">`)
- Deployment: Vercel, with `main` intended for Production and feature branches / pull requests intended for Preview deployments.
- Keep secrets out of the repository. Use `.env.local` locally and Vercel environment variables for hosted environments.

## Technical Stack

- Next.js 16 with the App Router.
- React 19.
- TypeScript with `strict` enabled.
- Tailwind CSS 4 via `@import "tailwindcss"` in `app/globals.css`.
- ESLint 9 flat config with `@eslint/js` and `typescript-eslint`.
- Path alias: `@/*` maps to the repository root.

Do not add runtime or development dependencies unless the ticket genuinely needs them. Prefer the platform, React, Next.js, TypeScript, and Tailwind capabilities already present.

## Current Folder Architecture

The repository is intentionally small for now:

```text
/app
  globals.css
  layout.tsx
  page.tsx
/public
next.config.ts
tailwind.config.ts
tsconfig.json
eslint.config.mjs
package.json
```

Target folders may be introduced as the product grows:

```text
/components
  /ui
  /layout
  /sections
/data
/lib
```

Create these folders only when there is a real implementation need. Avoid empty architecture scaffolding.

## Component Reuse Rules

- Inspect existing files before creating new components.
- Reuse existing components, data structures, styles, and naming patterns before introducing new abstractions.
- Keep components scoped to their real responsibility:
  - `components/ui`: small reusable primitives.
  - `components/layout`: shared page or site structure.
  - `components/sections`: larger page sections.
  - `data`: repeated editorial content, navigation items, FAQs, services, or similar structured content.
  - `lib`: shared utilities that are not tied to rendering.
- Add an abstraction only when it reduces duplication or clarifies ownership across more than one usage.
- Keep ticket changes limited to the requested behavior. Avoid unrelated refactors.

## Naming Conventions

- Use TypeScript for application code: `.ts` for logic/config and `.tsx` for React components.
- Use PascalCase for component names.
- Use camelCase for functions, variables, props, and local data.
- Use kebab-case for route segments and static asset filenames.
- Name components by their product role, not by temporary visual treatment.
- Prefer clear, descriptive names over abbreviations.

## Next.js Conventions

- Use Server Components by default.
- Add `"use client"` only when a component needs browser state, effects, event handlers, refs, or browser-only APIs.
- Keep metadata in `app/layout.tsx` or route-level metadata exports when pages are added.
- Use `next/image` for meaningful raster images and remote/local media that are part of the UI. Use plain CSS backgrounds only for decorative treatments that do not need image optimization or semantic meaning.
- Keep route files thin when a page becomes complex: move reusable UI into `components` and repeated content into `data`.

## Styling And Responsive Rules

- Use Tailwind utilities as the default styling approach.
- Keep global CSS for base styles, CSS variables, resets, and genuinely global rules.
- Build mobile-first layouts, then add responsive variants for tablet and desktop.
- Every page or section must avoid horizontal overflow.
- Text must remain readable and must not overlap adjacent content across common mobile, tablet, and desktop widths.
- Use stable dimensions or responsive constraints for fixed-format UI elements such as toolbars, icon buttons, grids, tiles, media frames, counters, and cards.
- Do not use viewport-width font scaling. Use explicit responsive text sizes when needed.
- Prefer simple, purposeful layout over decorative wrappers.

## Accessibility Rules

- Use semantic HTML first: headings, landmarks, lists, buttons, links, forms, and labels should match their actual role.
- Maintain a logical heading order.
- Interactive controls must be keyboard reachable and have visible focus states.
- Buttons trigger actions; links navigate.
- Images that communicate content need meaningful `alt` text. Decorative images should use empty `alt`.
- Do not rely on color alone to communicate state.
- Keep color contrast readable for text and important UI.
- Respect reduced-motion expectations when adding animation.

## Data And Content

- Keep repeated editorial data in typed arrays or objects under `data` once repetition appears.
- Avoid hardcoding the same navigation item, FAQ, service, or card content in multiple components.
- Do not introduce a CMS, database, or external content service unless a ticket explicitly validates that need.

## Validation Commands

Run these before considering a ticket complete:

```bash
npm run lint
npm run build
```

For UI tickets, also run the app locally when visual verification is needed:

```bash
npm run dev
```

Then check the relevant page at mobile, tablet, and desktop widths.

## Git And Linear Workflow

- Use a dedicated branch for each meaningful Linear ticket.
- Prefer the Linear-provided branch name when available.
- Keep commits and file changes scoped to the ticket.
- Do not modify unrelated files unless needed to complete the ticket safely.
- If a ticket reveals a separate bug or larger follow-up, create or mention a new Linear issue rather than expanding the current scope.

## Definition Of Done

A ticket is done when:

- The requested scope is implemented.
- Existing components and conventions were reused where appropriate.
- The UI is responsive on mobile, tablet, and desktop when the ticket affects rendering.
- There is no visible horizontal overflow.
- Basic accessibility expectations are met.
- No unnecessary dependency was added.
- `npm run lint` passes.
- `npm run build` passes.
- Any remaining visual or product uncertainty is clearly called out in the final update.
