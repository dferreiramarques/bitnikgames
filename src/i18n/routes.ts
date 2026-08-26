// Mapa de segmentos de rota por idioma. Mantemos os slugs traduzidos
// (ex. "catalogo" vs "catalog") em vez de forçar o mesmo texto nos dois
// idiomas, porque isso é mais correto para SEO e para o visitante — mas
// para isso funcionar, qualquer link entre idiomas tem de passar por este
// mapa em vez de andar a montar paths à mão.

export type Locale = "pt" | "en";

export const locales: Locale[] = ["pt", "en"];
export const defaultLocale: Locale = "pt";

export const routes = {
  home: { pt: "", en: "" },
  catalog: { pt: "catalogo", en: "catalog" },
  printAndPlay: { pt: "print-and-play", en: "print-and-play" },
  playOnline: { pt: "jogar-online", en: "play-online" },
  blog: { pt: "blog", en: "blog" },
  tools: { pt: "ferramentas", en: "designer-tools" },
  about: { pt: "sobre", en: "about" },
} as const;

export type RouteKey = keyof typeof routes;

/** Constrói o path absoluto para uma secção, num dado idioma. */
export function pathTo(locale: Locale, key: RouteKey, slug?: string): string {
  const segment = routes[key][locale];
  const parts = [`/${locale}`, segment, slug].filter(Boolean);
  return parts.join("/").replace(/\/+$/, "") + (slug ? "" : "/");
}
