import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint';

// Use an async config so we can safely dynamic-import ESM-only plugins.
export default defineConfig(async () => {
  let reactPlugin = null
  try {
    const mod = await import('@vitejs/plugin-react')
    const pluginFactory = mod && (mod.default ?? mod)
    reactPlugin = typeof pluginFactory === 'function' ? pluginFactory() : pluginFactory
  } catch (e) {
    // If the plugin isn't installed, continue without it. This allows
    // `vite`/`vitest` to run for non-React parts or to surface a clearer
    // install-time error later.
    reactPlugin = null
  }

  return {
    plugins: [reactPlugin, eslint()].filter(Boolean),
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})