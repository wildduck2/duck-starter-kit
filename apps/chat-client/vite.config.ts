import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
// import svg from 'imgit/svg'
// import imgit from 'imgit/vite'
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { FontaineTransform } from 'fontaine'
import svgr from 'vite-plugin-svgr'

// import postgresPlugin from '@neondatabase/vite-plugin-postgres'

const config = defineConfig({
  server: {
    port: 4000,
  },

  plugins: [
    FontaineTransform.vite({
      fallbacks: ['Arial'],
      resolvePath: (id) => new URL(`./public/fonts/${id}`, import.meta.url),
    }),
    // postgresPlugin({
    //   seed: {
    //     type: 'sql-script',
    //     path: 'db/init.sql',
    //   },
    //   referrer: 'create-tanstack',
    // }),

    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    svgr(),
    tailwindcss(),
    // compression({
    //   algorithms: ['gzip', 'brotliCompress'],
    // }),
    tanstackStart({
      target: 'cloudflare-module',
    }),
    // imgit({ width: 800, plugins: [svg()] }),
  ],
})

export default config
