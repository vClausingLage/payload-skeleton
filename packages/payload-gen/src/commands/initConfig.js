import fs from "fs-extra";
import { DEFAULT_CONFIG, getConfigPath } from "../config.js";

const InitConfig = async () => {
  const configPath = getConfigPath(process.cwd());
  const exists = await fs.pathExists(configPath);

  if (exists) {
    console.log(`Config already exists at ${configPath}`);
    return;
  }

  await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
  console.log(`Created ${configPath}`);
};

export default InitConfig;
