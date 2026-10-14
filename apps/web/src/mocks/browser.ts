import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export async function startMockWorker() {
  const worker = setupWorker(...handlers);
  // GitHub Pages では /evolving-todo/app/ の下に置くので、Service Worker の場所も base に合わせる
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass',
  });
}
