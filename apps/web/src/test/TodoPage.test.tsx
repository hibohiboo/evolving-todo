import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { initialTodos } from '../mocks/fixtures';
import { server } from '../mocks/node';
import { TodoPage } from '../pages/TodoPage';
import { renderPage } from './renderPage';

describe('TodoPage', () => {
  it('TODO の一覧と残りの件数を出す', async () => {
    renderPage(<TodoPage />);
    for (const t of initialTodos) {
      expect(await screen.findByText(t.title)).toBeInTheDocument();
    }
    const remaining = initialTodos.filter((t) => !t.done).length;
    expect(screen.getByText(`残り ${remaining} 件`)).toBeInTheDocument();
  });

  it('TODO が無ければ、無いと出す', async () => {
    server.use(http.get('/api/todos', () => HttpResponse.json([])));
    renderPage(<TodoPage />);
    expect(await screen.findByText('やることはありません。')).toBeInTheDocument();
  });

  it('読み込めなければ、誤りを出す', async () => {
    server.use(http.get('/api/todos', () => HttpResponse.error()));
    renderPage(<TodoPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('読み込めませんでした');
  });
});
