#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/addBlock.js
import fs2 from "fs-extra";
import path2 from "path";

// src/config.js
import fs from "fs-extra";
import path from "path";
var DEFAULT_CONFIG = {
  appPath: ".",
  naming: "pascal"
};
var CONFIG_FILE = "payload-gen.config.json";
var getConfigPath = (cwd = process.cwd()) => path.join(cwd, CONFIG_FILE);
var loadConfig = async (cwd = process.cwd()) => {
  const configPath = getConfigPath(cwd);
  const hasConfig = await fs.pathExists(configPath);
  if (!hasConfig) {
    return { ...DEFAULT_CONFIG };
  }
  const userConfig = await fs.readJson(configPath);
  return {
    ...DEFAULT_CONFIG,
    ...userConfig
  };
};
var normalizeNaming = (naming) => {
  if (naming === "camel" || naming === "snake" || naming === "pascal") {
    return naming;
  }
  return DEFAULT_CONFIG.naming;
};

// src/commands/addBlock.js
var toWords = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_\-\s]+/g, " ").trim().split(/\s+/).filter(Boolean).map((part) => part.toLowerCase());
var capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
var toPascal = (value) => toWords(value).map(capitalize).join("");
var toCamel = (value) => {
  const pascal = toPascal(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};
var toSnake = (value) => toWords(value).join("_");
var formatByNaming = (value, naming) => {
  if (naming === "camel") return toCamel(value);
  if (naming === "snake") return toSnake(value);
  return toPascal(value);
};
var getTemplateComponent = ({ componentName }) => `import React from 'react'

export const ${componentName}: React.FC = () => {
  return <div>${componentName}</div>
}
`;
var getTemplateConfig = ({ blockExportName, blockSlug }) => `import type { Block } from 'payload'

export const ${blockExportName}: Block = {
  slug: '${blockSlug}',
  fields: [],
}
`;
var ensureInsertedLine = (source, line, anchorPattern) => {
  if (source.includes(line)) return source;
  const anchorMatch = source.match(anchorPattern);
  if (anchorMatch) {
    return source.replace(anchorPattern, `$&
${line}`);
  }
  const importMatches = [...source.matchAll(/^import .+$/gm)];
  if (importMatches.length === 0) return source;
  const lastImport = importMatches[importMatches.length - 1][0];
  return source.replace(lastImport, `${lastImport}
${line}`);
};
var ensureObjectEntry = (source, objectName, entryLine) => {
  if (source.includes(entryLine)) return source;
  const objectRegex = new RegExp(`const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = source.match(objectRegex);
  if (!match) return source;
  const fullMatch = match[0];
  const body = match[1];
  const trimmedBody = body.trimEnd();
  const hasEntries = trimmedBody.trim().length > 0;
  const insertion = hasEntries ? `${trimmedBody}
  ${entryLine},` : `
  ${entryLine},`;
  const updated = fullMatch.replace(body, insertion);
  return source.replace(fullMatch, updated);
};
var ensureArrayEntry = (source, arrayAnchorRegex, entry) => {
  const match = source.match(arrayAnchorRegex);
  if (!match) return source;
  const current = match[0];
  if (current.includes(entry)) return source;
  const updated = current.replace(/\]$/, `, ${entry}]`);
  return source.replace(current, updated);
};
var AddBlock = async (name, options = {}) => {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const naming = normalizeNaming(config.naming);
  const appPath = path2.resolve(cwd, config.appPath || ".");
  const blocksPath = path2.resolve(appPath, options.path || "src/blocks");
  const renderedBlocksPath = path2.resolve(appPath, "src/blocks/RenderBlocks.tsx");
  const pagesCollectionPath = path2.resolve(appPath, "src/collections/Pages/index.ts");
  const baseNamePascal = toPascal(name);
  const folderName = formatByNaming(name, naming);
  const blockSlug = toCamel(name);
  const componentName = `${baseNamePascal}Block`;
  const blockExportName = baseNamePascal;
  const blockDir = path2.join(blocksPath, folderName);
  const componentFile = path2.join(blockDir, "Component.tsx");
  const configFile = path2.join(blockDir, "config.ts");
  await fs2.ensureDir(blockDir);
  if (!await fs2.pathExists(componentFile)) {
    await fs2.writeFile(componentFile, getTemplateComponent({ componentName }));
  }
  if (!await fs2.pathExists(configFile)) {
    await fs2.writeFile(configFile, getTemplateConfig({ blockExportName, blockSlug }));
  }
  if (await fs2.pathExists(renderedBlocksPath)) {
    let renderBlocksSource = await fs2.readFile(renderedBlocksPath, "utf8");
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
    await fs2.writeFile(renderedBlocksPath, renderBlocksSource);
  }
  if (await fs2.pathExists(pagesCollectionPath)) {
    let pagesSource = await fs2.readFile(pagesCollectionPath, "utf8");
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
    await fs2.writeFile(pagesCollectionPath, pagesSource);
  }
  console.log(`Created block ${baseNamePascal} in ${path2.relative(cwd, blockDir)}`);
};
var addBlock_default = AddBlock;

// src/commands/addPage.js
var AddPage = () => {
  console.log("AddPage command executed");
};
var addPage_default = AddPage;

// src/commands/initConfig.js
import fs3 from "fs-extra";
var InitConfig = async () => {
  const configPath = getConfigPath(process.cwd());
  const exists = await fs3.pathExists(configPath);
  if (exists) {
    console.log(`Config already exists at ${configPath}`);
    return;
  }
  await fs3.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
  console.log(`Created ${configPath}`);
};
var initConfig_default = InitConfig;

// src/cli.ts
var program = new Command();
program.name("payload-gen").description("Generate Payload CMS pages/blocks").version("0.1.0");
program.command("init:config").description("Create payload-gen.config.json in the current working directory").action(initConfig_default);
program.command("add:block").argument("<name>", "Block name, e.g. NewBlock").option("-p, --path <path>", "Target path", "src/blocks").action(addBlock_default);
program.command("add:page").argument("<name>", "Page name, e.g. LandingPage").option("-p, --path <path>", "Target path", "src/pages").action(addPage_default);
program.parse();
