import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.PAGES_BUILD === 'true' ? '/payment-journey/' : '/',
  server: { host: '127.0.0.1' },
  build: { target: 'es2023' },
  plugins: [
    {
      name: 'development-only-csp',
      transformIndexHtml(html, context) {
        // Vite HMR uses local websocket/style injection; production stays restrictive.
        return context.server
          ? html
              .replace(
                "connect-src 'none'",
                "connect-src 'self' ws://127.0.0.1:*",
              )
              .replace("style-src 'self'", "style-src 'self' 'unsafe-inline'")
          : html;
      },
    },
  ],
});
