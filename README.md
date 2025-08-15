## codrandom monorepo

Monorepo with Next.js app and shared UI package.

## Usage

Uses pnpm workspaces and turbo.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

From repo root:

- Install: `pnpm install`
- Dev all: `pnpm dev`
- Build all: `pnpm build`
- Lint: `pnpm lint`

Add UI components to `packages/ui` using shadcn in the web app if needed.

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
