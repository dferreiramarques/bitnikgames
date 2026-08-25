// Garante que cada coleção de conteúdo (games, pnp, posts) tem o mesmo
// conjunto de slugs em pt/ e en/ — ver a regra "pt/en andam sempre a par"
// em CLAUDE.md. Um slug só num dos dois idiomas parte o language switcher
// nessa página (fica a apontar para uma página que não existe).

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const collections = ["games", "pnp", "posts"];
const contentRoot = join(import.meta.dirname, "..", "src", "content");

const slugsIn = (dir) =>
  existsSync(dir)
    ? new Set(readdirSync(dir).filter((f) => f.endsWith(".md")))
    : new Set();

let hasErrors = false;

for (const collection of collections) {
  const ptDir = join(contentRoot, collection, "pt");
  const enDir = join(contentRoot, collection, "en");
  const ptSlugs = slugsIn(ptDir);
  const enSlugs = slugsIn(enDir);

  const onlyInPt = [...ptSlugs].filter((s) => !enSlugs.has(s));
  const onlyInEn = [...enSlugs].filter((s) => !ptSlugs.has(s));

  if (onlyInPt.length > 0) {
    hasErrors = true;
    console.error(`✗ ${collection}: só existe em pt/, falta en/ — ${onlyInPt.join(", ")}`);
  }
  if (onlyInEn.length > 0) {
    hasErrors = true;
    console.error(`✗ ${collection}: só existe em en/, falta pt/ — ${onlyInEn.join(", ")}`);
  }
}

if (hasErrors) {
  console.error("\nAdiciona o ficheiro em falta antes de fazer build (ver CLAUDE.md).");
  process.exit(1);
} else {
  console.log("✓ pt/en em paridade em games, pnp e posts.");
}
