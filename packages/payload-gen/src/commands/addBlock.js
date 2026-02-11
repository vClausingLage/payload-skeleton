import fs from "fs-extra";
import path from "node:path";
import { loadConfig, normalizeNaming } from "../config.js";

const toWords = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const toPascal = (value) => toWords(value).map(capitalize).join("");
const toCamel = (value) => {
  const pascal = toPascal(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};
const toSnake = (value) => toWords(value).join("_");

const formatByNaming = (value, naming) => {
  if (naming === "camel") return toCamel(value);
  if (naming === "snake") return toSnake(value);
  return toPascal(value);
};

const getTemplateComponent = ({ componentName }) => `import React from 'react'

export const ${componentName}: React.FC = () => {
  return <div>${componentName}</div>
}
`;

const getTemplateConfig = ({ blockExportName, blockSlug }) => `import type { Block } from 'payload'

export const ${blockExportName}: Block = {
  slug: '${blockSlug}',
  fields: [],
}
`;

const ensureInsertedLine = (source, line, anchorPattern) => {
  if (source.includes(line)) return source;

  const anchorMatch = source.match(anchorPattern);
  if (anchorMatch) {
    return source.replace(anchorPattern, `$&\n${line}`);
  }

  const importMatches = [...source.matchAll(/^import .+$/gm)];
  if (importMatches.length === 0) return source;

  const lastImport = importMatches[importMatches.length - 1][0];
  return source.replace(lastImport, `${lastImport}\n${line}`);
};

const ensureObjectEntry = (source, objectName, entryLine) => {
  if (source.includes(entryLine)) return source;

  const objectRegex = new RegExp(`const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = source.match(objectRegex);

  if (!match) return source;

  const fullMatch = match[0];
  const body = match[1];
  const trimmedBody = body.trimEnd();
  const hasEntries = trimmedBody.trim().length > 0;
  const insertion = hasEntries ? `${trimmedBody}\n  ${entryLine},` : `\n  ${entryLine},`;

  const updated = fullMatch.replace(body, insertion);
  return source.replace(fullMatch, updated);
};

const ensureArrayEntry = (source, arrayAnchorRegex, entry) => {
  const match = source.match(arrayAnchorRegex);
  if (!match) return source;

  const current = match[0];
  if (current.includes(entry)) return source;

  const updated = current.replace(/\]$/, `, ${entry}]`);
  return source.replace(current, updated);
};

const AddBlock = async (name, options = {}) => {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const naming = normalizeNaming(config.naming);

  const appPath = path.resolve(cwd, config.appPath || ".");
  const blocksPath = path.resolve(appPath, options.path || "src/blocks");
  const renderedBlocksPath = path.resolve(appPath, "src/blocks/RenderBlocks.tsx");
  const pagesCollectionPath = path.resolve(appPath, "src/collections/Pages/index.ts");

  const baseNamePascal = toPascal(name);
  const folderName = formatByNaming(name, naming);
  const blockSlug = toCamel(name);
  const componentName = `${baseNamePascal}Block`;
  const blockExportName = baseNamePascal;

  const blockDir = path.join(blocksPath, folderName);
  const componentFile = path.join(blockDir, "Component.tsx");
  const configFile = path.join(blockDir, "config.ts");

  await fs.ensureDir(blockDir);

  if (!(await fs.pathExists(componentFile))) {
    await fs.writeFile(componentFile, getTemplateComponent({ componentName }));
  }

  if (!(await fs.pathExists(configFile))) {
    await fs.writeFile(configFile, getTemplateConfig({ blockExportName, blockSlug }));
  }

  if (await fs.pathExists(renderedBlocksPath)) {
    let renderBlocksSource = await fs.readFile(renderedBlocksPath, "utf8");
    const componentImport = `import { ${componentName} } from '@/blocks/${folderName}/Component'`;
    renderBlocksSource = ensureInsertedLine(
      renderBlocksSource,
      componentImport,
      /import\s+\{\s*MediaBlock\s*\}\s+from\s+'@\/blocks\/MediaBlock\/Component'/
    );

    renderBlocksSource = ensureObjectEntry(
      renderBlocksSource,
      "blockComponents",
      `${blockSlug}: ${componentName}`
    );

    await fs.writeFile(renderedBlocksPath, renderBlocksSource);
  }

  if (await fs.pathExists(pagesCollectionPath)) {
    let pagesSource = await fs.readFile(pagesCollectionPath, "utf8");
    const pagesImport = `import { ${blockExportName} } from '../../blocks/${folderName}/config'`;

    pagesSource = ensureInsertedLine(
      pagesSource,
      pagesImport,
      /import\s+\{\s*MediaBlock\s*\}\s+from\s+'\.\.\/\.\.\/blocks\/MediaBlock\/config'/
    );

    pagesSource = ensureArrayEntry(
      pagesSource,
      /blocks:\s*\[[^\]]*\]/m,
      blockExportName
    );

    await fs.writeFile(pagesCollectionPath, pagesSource);
  }

  console.log(`Created block ${baseNamePascal} in ${path.relative(cwd, blockDir)}`);
};

export default AddBlock;
