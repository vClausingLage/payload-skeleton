# Payload Gen

## Config

- create config with `payload-gen init:config`
- file: `payload-gen.config.json`
- supported config:
  - `appPath` path to payload app root (default: `.`)
  - `naming` naming convention for block folder naming (`pascal`, `camel`, `snake`)

## Block

- blocks must be a) imported and b) added to blockComponents in **src/blocks/RenderBlocks.tsx** to be rendered in the app
- blocks must be added to the list of blocks in **src/collections/Pages/index.ts** to be available in the respective collection (Page)
- `payload-gen add:block <Name>` creates:
  - `src/blocks/<Name>/Component.tsx` (minimal TSX baseline template)
  - `src/blocks/<Name>/config.ts` (minimal Payload block config)
  - registration in `src/blocks/RenderBlocks.tsx`
  - import and block list entry in `src/collections/Pages/index.ts`
