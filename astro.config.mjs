// @ts-check
import { defineConfig } from 'astro/config';

// bitnikgames — site bilingue (PT / EN)
// PT é o idioma por defeito, mas mantemos o prefixo /pt/ e /en/ em ambos
// para que as rotas sejam simétricas e claras (nada "escondido" na raiz).
export default defineConfig({
  site: 'https://bitnikgames.example',
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: {
      prefixDefaultLocale: true,
      // O Astro geraria sozinho o redirect "/" -> "/pt/" por causa do
      // prefixDefaultLocale, mas usa sempre um <meta refresh> de 2s sem
      // hipótese de o configurar. Desligamos isto para o nosso próprio
      // src/pages/index.astro (com status 307, sem atraso) assumir o
      // controlo — ver também vercel.json para o redirect real no edge.
      redirectToDefaultLocale: false,
    },
  },
});
