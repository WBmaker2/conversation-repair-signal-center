import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const folders = ['src', 'scripts', 'tests'];
const extensions = new Set(['.ts', '.tsx', '.css', '.mjs']);
const oversized = [];

async function visit(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!extensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
      continue;
    }
    const contents = await readFile(path, 'utf8');
    const lines = contents.split(/\r?\n/).length;
    if (lines >= 500) {
      oversized.push({ path: relative(root, path), lines });
    }
  }
}

for (const folder of folders) {
  try {
    await visit(join(root, folder));
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

if (oversized.length > 0) {
  for (const file of oversized) {
    console.error(`${file.path}: ${file.lines} lines`);
  }
  process.exitCode = 1;
} else {
  console.log('All source files are under 500 lines.');
}
