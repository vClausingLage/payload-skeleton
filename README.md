# Payload

## Dev Docker (Postgres + Nginx)

The dev stack lives in `docker/compose.yml` and exposes the app at `http://localhost:8080`.

1. Create `.env` from `.env.example` and set `PAYLOAD_SECRET`.
2. Start the stack:

```bash
docker compose -f docker/compose.yml up
```

### Notes

- Postgres is available on `localhost:5432`
- Nginx proxies to the Next/Payload dev server

## Tailwind + shadcn/ui

- Tailwind config: `tailwind.config.ts`
- PostCSS: `postcss.config.cjs`
- shadcn config: `components.json`
- Globals: `src/app/(frontend)/globals.css`

## Localization

1. enable in `payload.config.ts`:

```ts
export default buildConfig({
  localization: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
  // ...
})
```
2. add translations to your fields:

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  fields: [
    {
      name: 'Name',
      type: 'text',
      localized: true,
    },
    // ...
  ],
}
```
## Internationalization (i18n)

1. install `pnpm install @payloadcms/translations`
2. enable in `payload.config.ts`:
```ts
export default buildConfig({
  i18n: {
    supportedLanguages: ['en', 'de'],
    fallbackLocale: 'en',
  },
  // ...
})
```
3. add translations to your fields:

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  fields: [
    {
      name: 'Bio',
      type: 'textarea',
      labels: {
        en: 'Biography',
        de: 'Biografie',
      },
      i18n: true,
    },
    // ...
  ],
}
```

## Hybrid i18n (JSON + Payload)

- UI strings live in `src/i18n/dictionaries/*.json`
- Marketing/content strings live in Payload collections with `localized: true`
- Locale routing is prefix-based (e.g. `/en`, `/de`) via `src/middleware.ts`
- Locale switcher: `src/components/LocaleSwitcher.tsx`
- Hreflang alternates are set in `src/app/(frontend)/[locale]/layout.tsx`
