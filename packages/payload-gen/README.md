# Payload Gen

## Config

- component and file name conventions : pascal camel snake

## create Block

1. /app/src/blocks/RenderBlocks.tsx -> 
  - ADD IMPORT: import { MediaBlock } from '@/blocks/MediaBlock/Component'
  - ADD NAMING: const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}
2. add Block (/app/src/blocks/BLOCK/BLOCK-NAME.tsx ./config.ts)