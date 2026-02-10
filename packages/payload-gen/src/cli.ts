#!/usr/bin/env node
import { Command } from "commander";
import { addBlock } from "./commands/addBlock.js";
import { addPage } from "./commands/addPage.js";

const program = new Command();

program
  .name("payload-gen")
  .description("Generate Payload CMS pages/blocks")
  .version("0.1.0");

program
  .command("add:block")
  .argument("<name>", "Block name, e.g. NewBlock")
  .option("-p, --path <path>", "Target path", "src/blocks")
  .action(addBlock);

program
  .command("add:page")
  .argument("<name>", "Page name, e.g. LandingPage")
  .option("-p, --path <path>", "Target path", "src/pages")
  .action(addPage);

program.parse();
