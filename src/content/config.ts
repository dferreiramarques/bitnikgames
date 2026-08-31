import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Cada coleção tem uma subpasta por idioma (pt/en) com o MESMO slug de
// ficheiro para a mesma obra — é assim que conseguimos, por exemplo, ligar
// /pt/catalogo/bulbous a /en/catalog/bulbous sem adivinhar nada.

// Jogos e print & play partilham o mesmo vocabulário de campos — para que o
// mesmo frontmatter possa ser copiado de uma pasta para a outra sem editar
// nomes de campos. "status" cobre tanto o percurso de compra de um jogo
// físico (buy-now/buy-external/coming-soon) como o de acesso a um ficheiro
// PnP (free/paid/pwyw); cada coleção normalmente só usa o subconjunto que
// lhe interessa, mas nada impede um PnP "coming-soon" ou um jogo "free".
const entryStatus = z.enum(["buy-now", "buy-external", "coming-soon", "free", "paid", "pwyw"]);

const sharedFields = {
  title: z.string(),
  shortDescription: z.string(),
  players: z.object({ min: z.number(), max: z.number() }).optional(),
  duration: z.number().optional(), // minutos
  age: z.number().optional(),
  status: entryStatus,
  price: z.string().optional(),
  // Para itens vendidos fora do site (ex. itch.io) em vez de um checkout ou
  // download direto — quando presente, tem prioridade no botão de CTA (ver
  // CatalogDetailPage.astro / PnpDetailPage.astro).
  externalUrl: z.string().url().optional(),
  externalLabel: z.string().optional(),
  // Link do YouTube (qualquer formato: watch?v=, youtu.be/, /shorts/). Por
  // omissão fica só como link "Ver trailer"; com videoEmbed:true, o player
  // fica embutido a seguir à descrição (ver CatalogDetailPage.astro).
  video: z.string().url().optional(),
  videoEmbed: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  // Ordem manual (drag-and-drop no CMS); 0 = ainda ninguém mexeu, cai
  // para "mais recente primeiro" (ver src/lib/sortEntries.ts).
  order: z.number().default(0),
  publishedDate: z.coerce.date(),
};

// status "buy-external" sem externalUrl faz o botão de compra desaparecer
// silenciosamente na página — falhar aqui em vez de em produção.
const requiresExternalUrl = (data: { status: z.infer<typeof entryStatus>; externalUrl?: string }) =>
  data.status !== "buy-external" || Boolean(data.externalUrl);
const externalUrlRefinement = {
  message: 'externalUrl é obrigatório quando status é "buy-external"',
  path: ["externalUrl"],
};

const games = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/games" }),
  schema: z.object(sharedFields).refine(requiresExternalUrl, externalUrlRefinement),
});

const pnp = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pnp" }),
  schema: z
    .object({
      ...sharedFields,
      fileUrl: z.string().default("#"),
    })
    .refine(requiresExternalUrl, externalUrlRefinement),
});

// Texto do hero da homepage — coleção "singleton" (uma única entrada, slug
// fixo "home") só para que o CMS o edite com o mesmo fluxo pt/en que já usa
// para jogos/PnP/posts, em vez de ficar hardcoded em src/i18n/ui.ts.
const hero = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hero" }),
  schema: z.object({
    title: z.string(), // o H1 do hero
    eyebrow: z.string(),
    subtitle: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    readingMinutes: z.number().default(4),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    publishedDate: z.coerce.date(),
  }),
});

export const collections = { games, pnp, posts, hero };
