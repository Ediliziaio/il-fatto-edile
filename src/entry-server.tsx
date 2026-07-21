import { renderToReadableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

export { ROUTES, headFor } from './lib/ssr-head';

// allReady attende la risoluzione dei componenti lazy (Suspense) prima di leggere lo stream
export async function render(url: string): Promise<string> {
  const stream = await renderToReadableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  await stream.allReady;
  return new Response(stream).text();
}
