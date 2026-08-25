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
    },
  },
});
