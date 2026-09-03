import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/routes";

type PublishableCollection = "games" | "pnp" | "posts";

// Wraps getCollection() with the two filters every listing/detail page for
// games, pnp and posts needs together: só a entrada do idioma pedido, e nunca
// uma marcada draft:true no CMS (ver checkbox "Rascunho" — entrada fica
// guardada e editável lá, mas nunca ganha URL pública no site).
export function getPublished<C extends PublishableCollection>(collection: C, locale: Locale) {
  return getCollection(collection, (entry: CollectionEntry<C>) => entry.id.startsWith(`${locale}/`) && !entry.data.draft);
}
