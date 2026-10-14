import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TodoPage } from '@/pages/TodoPage';
import { startMockWorker } from './mocks/browser';
import './app/global.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

async function bootstrap() {
  // バックエンドは無いので、常に MSW を起動してから描画する
  await startMockWorker();
  const root = document.getElementById('root');
  if (!root) throw new Error('index.html に #root がありません');
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TodoPage />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
