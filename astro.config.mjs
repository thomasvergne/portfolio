// @ts-check
import { defineConfig, envField } from 'astro/config';
import sectionize from '@hbsnow/rehype-sectionize';
import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [sectionize, rehypeKatex],
    remarkPlugins: [remarkMath],
    shikiConfig: {
      theme: {
        bg: '#1b1a17',
        fg: '#e8e2d9',
      }
    }
  },

  site: 'https://thomas-vergne.fr',

  env: {
    schema: {
      EMAIL_PASSWORD: envField.string({
        context: 'server',
        access: 'secret',
      }),

      EMAIL_USERNAME: envField.string({
        context: 'server',
        access: 'secret',
      }),

      EMAIL_HOST: envField.string({
        context: 'server',
        access: 'secret',
      }),

      EMAIL_PORT: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },

  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon()],

  adapter: node({
    mode: 'standalone'
  })
});