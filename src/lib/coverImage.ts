import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// public/cards/<slug>.png é opcional — enquanto não existir (jogo novo
// ainda sem arte final), o placeholder gradiente+título mantém-se, sem
// precisar de tocar em código nenhum (só o .md do jogo).
export function hasCoverImage(slug: string): boolean {
  const path = fileURLToPath(new URL(`../../public/cards/${slug}.png`, import.meta.url));
  return existsSync(path);
}
