import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { checkResponse } from './check';
import { defineEndpoint, failure, success } from './define';

const endpoint = defineEndpoint({
  method: 'get',
  path: '/items/:id',
  summary: '項目を取得する',
  responses: {
    200: success('項目', z.strictObject({ id: z.string() })),
    404: failure('項目が無い'),
  },
});

describe('checkResponse', () => {
  it('一覧どおりの応答なら誤りは無い', () => {
    expect(checkResponse(endpoint, 200, { id: 'a' })).toEqual([]);
    expect(checkResponse(endpoint, 404, { message: '無い' })).toEqual([]);
  });

  it('一覧に無い状態コードは誤り', () => {
    expect(checkResponse(endpoint, 422, { message: 'x' })).toEqual([
      'GET /items/:id → 422：一覧に無い状態コード（一覧にあるのは 200・404）',
    ]);
  });

  it('形が違えば、違う場所を誤りに書く', () => {
    const [error] = checkResponse(endpoint, 200, { id: 1 });
    expect(error).toMatch(/^GET \/items\/:id → 200：id が一覧の形と違う/);
  });

  it('余分なキーも誤り（strictObject）', () => {
    expect(checkResponse(endpoint, 200, { id: 'a', extra: true })).toHaveLength(1);
  });

  it('誤りは5件までで、残りは件数だけにする', () => {
    const many = defineEndpoint({
      ...endpoint,
      responses: { 200: success('一覧', z.array(z.string())) },
    });
    const errors = checkResponse(many, 200, [1, 2, 3, 4, 5, 6, 7]);
    expect(errors).toHaveLength(6);
    expect(errors[5]).toBe('GET /items/:id → 200：ほか 2 件');
  });
});
