import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Cada coleção tem uma subpasta por idioma (pt/en) com o MESMO slug de
// ficheiro para a mesma obra — é assim que conseguimos, por exemplo, ligar
// /pt/catalogo/rio-de-flores a /en/catalog/rio-de-flores sem adivinhar nada.

const games = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/games" }),
  schema: z
    .object({
      title: z.string(),
      shortDescription: z.string(),
      players: z.object({ min: z.number(), max: z.number() }),
      duration: z.number(), // minutos
      age: z.number(),
      status: z.enum(["buy-now", "buy-external", "coming-soon"]),
      price: z.string().optional(),
      externalUrl: z.string().url().optional(),
      externalLabel: z.string().optional(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      publishedDate: z.coerce.date(),
    })
    // status "buy-external" sem externalUrl faz o botão de compra desaparecer
    // silenciosamente na página do jogo — falhar aqui em vez de em produção.
    .refine((data) => data.status !== "buy-external" || Boolean(data.externalUrl), {
      message: "externalUrl é obrigatório quando status é \"buy-external\"",
      path: ["externalUrl"],
    }),
});

const pnp = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pnp" }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    access: z.enum(["free", "paid", "pwyw"]),
    price: z.string().optional(),
    fileUrl: z.string().default("#"),
    players: z.object({ min: z.number(), max: z.number() }).optional(),
    duration: z.number().optional(),
    tags: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    readingMinutes: z.number().default(4),
    tags: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
  }),
});

export const collections = { games, pnp, posts };
