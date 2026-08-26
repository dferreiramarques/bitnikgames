# bitnikgames — contexto para trabalhar neste repo

Site da bitnikgames (publisher independente de jogos de tabuleiro): catálogo, print & play, blog. Ver `README.md` para o assessment de UX completo e a lista do que ainda é placeholder — este ficheiro é só as regras práticas para não partir nada ao editar.

## Stack
Astro 5 (content collections + i18n routing), sem framework de UI (componentes `.astro` puros). Sem backend — 100% estático, publicado na Vercel a partir do branch `main`.

## Regra mais importante: pt/en andam sempre a par

Cada jogo, print & play ou post existe como DOIS ficheiros com o MESMO nome, um em `pt/` e outro em `en/`:

```
src/content/games/pt/nome-do-jogo.md
src/content/games/en/nome-do-jogo.md
```

O nome do ficheiro (sem extensão) é o slug — é o que liga as duas versões e permite ao seletor de idioma (`Nav.astro`) saltar da página em PT para a mesma página em EN sem se perder. **Nunca cries conteúdo só num dos dois idiomas** — parte o language switcher nessa página (fica a apontar para uma página que não existe). Se só tiveres o texto num idioma, cria os dois ficheiros na mesma e traduz depois — não deixes um em falta.

O mesmo vale para `src/content/pnp/` e `src/content/posts/`.

## Rotas: os segmentos são traduzidos, não hardcoded

`/pt/catalogo` mas `/en/catalog`. `/pt/sobre` mas `/en/about`. Isto está centralizado em `src/i18n/routes.ts` — qualquer link interno deve ser construído com `pathTo(locale, "catalog", slug)`, nunca escrito à mão como string. Se adicionares uma secção nova ao site, adiciona-a primeiro a `routes.ts` (e ao dicionário em `src/i18n/ui.ts`) antes de criares as páginas.

## Os hrefs são caminhos absolutos a partir da raiz

`pathTo()` gera `/pt/...` e `/en/...`, sempre a partir da raiz do domínio. **Isto só funciona se o site estiver publicado na raiz de um domínio** (é o caso da Vercel: `bitnikgames.vercel.app/pt/...`). Se algum dia mudares para hosting num subcaminho (ex. GitHub Pages sem domínio próprio, `user.github.io/bitnikgames/`), estes links partem-se todos — ou usa um domínio próprio nesse hosting, ou ajusta `pathTo()` para ter em conta um `base`.

## Onde mexer para cada tipo de mudança

- **Adicionar/editar um jogo, print & play ou post** → só ficheiros `.md` em `src/content/`, nenhum código. Ver `src/content/config.ts` para os campos disponíveis (ex. `status: "buy-now" | "buy-external" | "coming-soon"` em jogos).
- **Mudar cor, tipografia, espaçamento geral** → `src/styles/global.css` (tokens em `:root`).
- **Mudar texto fixo da interface** (labels de nav, botões, badges) → `src/i18n/ui.ts`, nunca hardcoded dentro dos componentes.
- **Mudar layout de uma página** (ex. a página de detalhe de um jogo) → o componente `*Page.astro` correspondente em `src/components/` (ex. `CatalogDetailPage.astro`). As páginas reais em `src/pages/pt/...` e `src/pages/en/...` são só wrappers de 3 linhas — não dupliques lógica lá.

## Antes de fazer push

```bash
npm run build   # corre astro check (tipos) + astro build — apanha a maioria dos erros
```

Cada push para uma branch que não seja `main` gera um preview deploy automático na Vercel (link nos checks do PR/commit no GitHub) — útil para veres a alteração antes de ires para produção.

## Ficheiros de print & play: GitHub Release assets, não `public/`

Os PDFs de print & play não vivem em `public/` — ficam como assets da release [`pnp-files`](https://github.com/dferreiramarques/bitnikgames/releases/tag/pnp-files) neste repo. Isto dá tracking de downloads de borla (contador visível no GitHub, sem analytics nem backend) e mantém PDFs grandes fora do histórico do site.

Para publicar um ficheiro novo: `gh release upload pnp-files caminho/para/ficheiro.pdf --repo dferreiramarques/bitnikgames` (ou arrasta o PDF para a release na UI do GitHub), depois copia o link do asset para o campo `fileUrl` da entrada correspondente em `src/content/pnp/{pt,en}/<slug>.md` (substitui o `"#"` placeholder). `PnpDetailPage.astro` já trata isto automaticamente — o botão "Descarregar" fica ativo assim que `fileUrl !== "#"`.

## O que ainda é placeholder (ver README secção 5 para a lista completa)

Checkout dos jogos "Comprar" (botão desativado), ficheiros de print & play (`fileUrl: "#"` — ver secção acima para o fluxo de publicar), imagens dos jogos (gradiente com o nome em vez de arte real). A newsletter já está ligada a sério (Buttondown, `buttondown.com/bitnikgames`) — ver o `<form>` em `HomePage.astro`.
