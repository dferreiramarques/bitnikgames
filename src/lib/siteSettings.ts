import { getEntry } from "astro:content";

// Interruptor "Blog visível no site" (separador Blog do CMS). Guardado na
// coleção singleton "settings" (entrada "home", par pt/en com o mesmo valor)
// — lê-se sempre a versão pt. Sem entrada, o blog fica visível (default).
export async function isBlogEnabled(): Promise<boolean> {
  const entry = await getEntry("settings", "pt/home");
  return entry?.data.blogEnabled ?? true;
}
