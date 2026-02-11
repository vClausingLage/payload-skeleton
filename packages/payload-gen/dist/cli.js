#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/addBlock.js
var AddBlock = () => {
  console.log("AddBlock command executed");
};
var addBlock_default = AddBlock;

// src/commands/addPage.js
var AddPage = () => {
  console.log("AddPage command executed");
};
var addPage_default = AddPage;

// src/cli.ts
var program = new Command();
program.name("payload-gen").description("Generate Payload CMS pages/blocks").version("0.1.0");
program.command("add:block").argument("<name>", "Block name, e.g. NewBlock").option("-p, --path <path>", "Target path", "src/blocks").action(addBlock_default);
program.command("add:page").argument("<name>", "Page name, e.g. LandingPage").option("-p, --path <path>", "Target path", "src/pages").action(addPage_default);
program.parse();
