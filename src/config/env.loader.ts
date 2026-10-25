import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';

const envFiles = [
  '.env.' + nodeEnv + '.local',
  ...(nodeEnv === 'test' ? [] : ['.env.local']),
  '.env.' + nodeEnv,
  '.env',
];

export function loadEnvironment() {
  for (const file of envFiles) {
    const path = resolve(process.cwd(), file);

    // Skip if doesn't exist
    if (!existsSync(path)) continue;

    // Load .env file, but do not override existing environment variables.
    loadDotenv({ path, override: false });
  }
}
