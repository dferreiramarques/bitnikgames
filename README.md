# bitnikgames — esqueleto do site

Protótipo funcional para a bitnikgames, publisher independente de jogos de tabuleiro. Construído em [Astro](https://astro.build), bilingue (PT/EN), com catálogo de jogos, print & play e blog de game design.

Este documento serve dois propósitos: (1) registar o assessment de UX/UI que guiou as decisões deste protótipo, para que fique claro *porquê* está construído desta forma, e (2) explicar como correr e estender o projeto no editor de código.

---

## 1. Assessment de UX/UI — resumo da entrevista

### Objetivos e prioridade das secções
As três áreas — **catálogo**, **print & play** e **blog** — têm peso igual. Isto teve impacto direto na estrutura da home: em vez de escolher uma área "hero" e empurrar as outras para menus secundários, a home tem três secções de igual dimensão (jogos em destaque, print & play em destaque, últimos posts do blog), cada uma com o seu próprio CTA para a página completa. A navegação principal lista as quatro secções (Catálogo, Print & Play, Blog, Sobre) na mesma ordem em todo o site, sem hierarquia visual entre elas.

### Estilo visual
Pedido: **colorido e lúdico**. Paleta construída a partir de três tons pedidos — amarelo torrado, laranja, laranja tijolo — com uma base creme/tinta (ver secção 2) para garantir contraste e legibilidade de texto, já que uma paleta 100% quente sem esses dois neutros teria problemas de contraste em botões e texto longo. Tipografia: **Baloo 2** (arredondada, lúdica) para títulos, **Inter** para corpo de texto — combinação comum em marcas de jogos/brinquedos que precisam de manter alguma seriedade no texto longo (regras, posts de blog).

### Modelo de venda: "depende do jogo"
Esta resposta moldou a arquitetura de dados mais do que qualquer outra. Cada jogo no catálogo tem um campo `status` com três valores possíveis:

- `buy-now` — botão de compra próprio (atualmente um placeholder desativado — ver secção 4, "o que falta a sério")
- `buy-external` — botão que leva a uma loja externa (BGG Store, itch.io, Kickstarter, etc.)
- `coming-soon` — sem CTA de compra, apenas um estado visual

Isto significa que podes ter os três tipos de jogo no catálogo ao mesmo tempo, e adicionar um jogo novo com qualquer um dos três comportamentos só de mudar um campo no ficheiro de conteúdo — não é preciso tocar em código.

### Print & Play: mistura de grátis e pago
Estrutura equivalente à dos jogos: campo `access` com `free`, `paid` ou `pwyw` (pay-what-you-want), cada um com o seu badge visual próprio. O botão de download está sempre visível — a diferença entre grátis/pago fica só na comunicação (badge + preço), não numa barreira de acesso, porque isso não foi pedido nesta fase (nada de paywall, checkout ou captura de email antes do download).

### Bilingue (PT/EN)
Em vez de duplicar rotas ingenuamente (`/pt/catalogo` a apontar para o mesmo texto que `/en/catalogo`), os segmentos de URL estão traduzidos por idioma (`/pt/catalogo` vs `/en/catalog`, `/pt/sobre` vs `/en/about`) através de um mapa central em `src/i18n/routes.ts`. Isto é mais correto para SEO e para quem lê o URL, ao custo de mais uma linha de configuração — decisão alinhada com o pedido de "mais fácil de manter" a prazo, mesmo que a primeira configuração seja ligeiramente mais trabalhosa.

### Stack: Astro
Escolhido depois de comparar HTML/CSS/JS puro, React (Vite), Next.js e Astro (resumo completo foi enviado na conversa). Motivo principal: o site é maioritariamente conteúdo (jogos, print & play, posts) que vai crescer com o tempo, bilingue, e precisa de bom SEO — é exatamente o caso de uso para que as *content collections* do Astro foram desenhadas. Cada jogo, print & play ou post de blog é um ficheiro Markdown com campos estruturados (`título`, `preço`, `estado`, etc.) — adicionar conteúdo novo é criar um ficheiro `.md`, não escrever código.

---

## 2. Sistema de design

### Cor
Definida em `src/styles/global.css` como variáveis CSS (`:root`). A paleta pedida ("entre amarelo torrado, laranja e laranja tijolo") tornou-se três cores de marca, mais dois neutros funcionais que não fazem parte do pedido original mas foram acrescentados por necessidade de contraste — ajusta-os à vontade, são só suporte:

| Token | Cor | Uso |
|---|---|---|
| `--color-yellow` | `#E8A93B` (amarelo torrado) | badges, gradientes, destaques |
| `--color-orange` | `#EA7C2E` (laranja) | gradientes, hover states |
| `--color-brick` | `#B8461F` (laranja tijolo) | botões primários, links ativos |
| `--color-cream` | `#FBF3E4` | fundo principal *(neutro de apoio)* |
| `--color-ink` | `#2B1B12` | texto principal, footer *(neutro de apoio)* |

### Tipografia
- Títulos: **Baloo 2** (Google Fonts), 500–800
- Corpo: **Inter** (Google Fonts), 400–700

### Componentes reutilizáveis (`src/components/`)
`Nav`, `Footer`, `Badge` (estados: grátis/pago/pwyw/brevemente/externo), `GameCard`, `PnpCard`, `PostCard` — mais os componentes "`*Page`" que montam páginas completas (ver secção 3).

---

## 3. Estrutura do projeto

```
src/
  content/            → conteúdo (Markdown), uma pasta por coleção, uma subpasta por idioma
    games/pt/*.md      games/en/*.md
    pnp/pt/*.md        pnp/en/*.md
    posts/pt/*.md      posts/en/*.md
  content/config.ts   → esquema/validação de cada coleção (Zod)
  i18n/
    routes.ts         → mapa de rotas por idioma (pt/en)
    ui.ts             → dicionário de strings da interface (nav, botões, labels)
  components/         → componentes de UI (cards, nav, footer, badges)
    HomePage.astro, CatalogIndexPage.astro, CatalogDetailPage.astro,
    PnpIndexPage.astro, PnpDetailPage.astro, BlogIndexPage.astro,
    BlogDetailPage.astro, AboutPage.astro
                      → cada um destes monta UMA página completa (com <Layout>);
                        as páginas reais em src/pages/ são wrappers finos que só
                        escolhem o idioma — isto evita duplicar a mesma lógica
                        de layout duas vezes (uma por idioma)
  layouts/Layout.astro → esqueleto HTML comum (head, nav, footer, fontes)
  pages/
    index.astro        → redireciona "/" para "/pt/"
    pt/…  en/…          → rotas reais, espelhadas nos dois idiomas
  styles/global.css    → tokens de design + estilos base
```

### Como adicionar um jogo novo
Cria `src/content/games/pt/nome-do-jogo.md` **e** `src/content/games/en/nome-do-jogo.md` (mesmo nome de ficheiro nos dois — é o que liga as duas versões). Preenche os campos do topo (ver `src/content/config.ts` para a lista completa) e escreve a descrição longa em baixo, em Markdown normal. O jogo aparece automaticamente no catálogo — nenhum código a alterar.

O mesmo processo aplica-se a print & play (`src/content/pnp/`) e posts do blog (`src/content/posts/`).

---

## 4. Como correr o projeto

```bash
npm install
npm run dev       # servidor de desenvolvimento em http://localhost:4321
npm run build     # build de produção (com verificação de tipos) em /dist
npm run preview   # pré-visualiza o build de produção
```

Requer Node.js 18.20.8+, 20.3.0+ ou 22.0.0+.

---

## 5. O que é protótipo e o que falta a sério

Para seres honesto contigo próprio (e com quem vir o site) sobre o que já está pronto e o que é só esqueleto visual:

- **Checkout dos jogos "Comprar"** — o botão está desenhado mas desativado (`disabled`). Falta decidir e integrar um fornecedor de pagamentos (ex. Stripe) quando/se avançares para loja própria nalgum jogo.
- ~~**Newsletter**~~ — ligada ao Buttondown (`buttondown.com/bitnikgames`) via o método de embed sem backend deles; o `<form>` em `src/components/HomePage.astro` submete a sério.
- **Ficheiros de print & play reais** — os links de download apontam para `#`. Substitui `fileUrl` no frontmatter de cada `.md` pelo link real do PDF (ou aloja-os em `public/downloads/` e aponta para lá).
- **Imagens reais** — todos os cards e páginas de detalhe usam um gradiente com o nome do jogo em vez de arte real. Substitui `.card-media` / `.detail-media` por `<img>` quando tiveres capas.
- **Redes sociais** — os links no footer (Instagram, BGG, itch.io) são placeholders a apontar para os domínios genéricos. Editáveis via CMS (coleção `footer`, `src/content/footer/{pt,en}/home.md`) ou diretamente nesses ficheiros.
- **Acessibilidade e SEO** — os fundamentos estão lá (`lang`, `hreflang`, `alt`/`aria-hidden` onde relevante, contraste verificado a olho), mas vale a pena passar um Lighthouse antes de publicar a sério.

Nenhum destes pontos foi pedido nesta fase — ficam aqui só para que sejam decisões conscientes mais tarde, não esquecimentos.
