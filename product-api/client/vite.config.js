import { defineConfig } from 'vite';
export default defineConfig({
  // Automatic JSX runtime keeps components concise without a global React import.
  esbuild: { jsx: 'automatic' },
  server: { proxy: { '/products': 'http://127.0.0.1:3000' } },
});
