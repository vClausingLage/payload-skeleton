import fs from "fs-extra";
import path from "node:path";

export const DEFAULT_CONFIG = {
  appPath: ".",
  naming: "pascal",
};

const CONFIG_FILE = "payload-gen.config.json";

export const getConfigPath = (cwd = process.cwd()) => path.join(cwd, CONFIG_FILE);

export const loadConfig = async (cwd = process.cwd()) => {
  const configPath = getConfigPath(cwd);
  const hasConfig = await fs.pathExists(configPath);

  if (!hasConfig) {
    return { ...DEFAULT_CONFIG };
  }

  const userConfig = await fs.readJson(configPath);
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
};

export const normalizeNaming = (naming) => {
  if (naming === "camel" || naming === "snake" || naming === "pascal") {
    return naming;
  }

  return DEFAULT_CONFIG.naming;
};
