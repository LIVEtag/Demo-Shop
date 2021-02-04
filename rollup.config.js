import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import html from 'rollup-plugin-generate-html-template';

require('./env');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const production = process.env.NODE_ENV === 'production';

const envVars = {
  '__DEV__': JSON.stringify(production),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.APP_JS_SDK_URL': JSON.stringify(process.env.APP_JS_SDK_URL),
  'process.env.APP_WIDGET_SHOP_URI': JSON.stringify(process.env.APP_WIDGET_SHOP_URI),
  'process.env.APP_WIDGET_URL': JSON.stringify(process.env.APP_WIDGET_URL),
};

function serve() {
  let server;

  function toExit() {
    if (server) {
      server.kill(0);
    }
  }

  return {
    writeBundle() {
      if (server) {
        return;
      }
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'umd',
    name: 'Livetag',
    file: 'public/build/main.js',
  },
  plugins: [
    replace({ ...envVars }),
    html({
      template: 'src/index.html',
      target: 'public/index.html',
      attrs: ['async'],
      replaceVars: { ...envVars },
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    postcss({ inject: true }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
