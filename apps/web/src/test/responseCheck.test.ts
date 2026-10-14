import { HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { initialTodos } from '../mocks/fixtures';
import { checkMockedResponse } from './responseCheck';

const get = (path: string) => new Request(new URL(path, location.origin));

describe('checkMockedResponse', () => {
  it('一覧どおりの応答なら誤りは無い', async () => {
    expect(await checkMockedResponse(get('/api/todos'), HttpResponse.json(initialTodos))).toEqual(
      [],
    );
  });

  it('一覧に無い API は誤り', async () => {
    expect(await checkMockedResponse(get('/api/unknown'), HttpResponse.json({}))).toEqual([
      'GET /api/unknown：API の一覧（packages/schemas の api/endpoints.ts）に無い',
    ]);
  });

  it('形の違う本文は誤り', async () => {
    const [error] = await checkMockedResponse(
      get('/api/todos'),
      HttpResponse.json([{ ...initialTodos[0], done: 'yes' }]),
    );
    expect(error).toMatch(/^GET \/todos → 200：0\.done が一覧の形と違う/);
  });

  it('JSON でない本文は誤り', async () => {
    expect(await checkMockedResponse(get('/api/todos'), new Response(''))).toEqual([
      'GET /todos → 200：本文が JSON でない（空）',
    ]);
  });
});
