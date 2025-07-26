// @ts-check
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import { readFileSync } from 'node:fs';
import { name as packageName } from './package.json';
import autoprefixer from 'autoprefixer';
import browserslistToEsbuild from '../../scripts/browserslist_to_esbuild';

export default defineConfig(({ command }) => {
  return {
    // This only works when fed to esbuild
    esbuild: {
      banner: readFileSync('../../assets/intro.js').toString().trim(),
      footer: readFileSync('../../assets/outro.js').toString().trim(),
    },

    resolve:
      command === 'serve'
        ? {
            alias: {
              'ext.gadget.HanAssist': 'hanassist',
              'ext.gadget.ilhpp': `${import.meta.dirname}/../ilhpp/src/index`,
              'ext.gadget.ilhpp-settings': `${import.meta.dirname}/src/index`,
              vue: `${import.meta.dirname}/server/mockup_vue`,
              '@wikimedia/codex': `${import.meta.dirname}/server/mockup_codex`,
              'mobile.startup': `${import.meta.dirname}/../../server/mockup_mobile_startup`,
            },
          }
        : undefined,

    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
      preprocessorOptions: {
        less: {
          strictUnits: true,
        },
      },
    },

    build: {
      outDir: '../../dist',
      emptyOutDir: false,
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs'],
      },
      minify: false, // Let MediaWiki do its job
      target: ['es2017'], // See https://www.mediawiki.org/wiki/Project:Tech_News#Tech_News:_2025-23, since 1.45.0-wmf.6
      cssTarget: browserslistToEsbuild(), // Tell esbuild not to use too modern CSS features
      rollupOptions: {
        output: {
          entryFileNames: `Gadget-${packageName}.js`,
          chunkFileNames: `Gadget-${packageName}-[name].js`,
          assetFileNames: `Gadget-${packageName}.css`,
        },
      },
    },

    plugins: [
      vue(),
      {
        enforce: 'pre',
        ...mwGadget({
          gadgetDef: '.gadgetdefinition',
        }),
      },
    ],
  };
});
