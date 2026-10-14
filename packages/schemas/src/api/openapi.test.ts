// OpenAPI の文書。一覧と自分を比べるだけでなく、参照が解決すること・型の厳しさを、文書の側から確かめる。

import { describe, expect, it } from 'vitest';
import { endpoints } from './endpoints';
import { buildOpenApiDocument } from './openapi';

type Json = Record<string, unknown>;

const doc = buildOpenApiDocument();
const paths = doc.paths as Record<string, Record<string, Json>>;
const schemas = (doc.components as { schemas: Record<string, Json> }).schemas;
const text = JSON.stringify(doc);

describe('OpenAPI の文書', () => {
  it('一覧のすべての API が paths に出る', () => {
    const count = Object.values(paths).reduce((n, p) => n + Object.keys(p).length, 0);
    expect(count).toBe(endpoints.length);
    expect(doc.openapi).toBe('3.1.0');
  });

  it('TODO の一覧は Todo の配列を返し、todos のタグに入る', () => {
    const o = paths['/todos']?.get as Json;
    expect(o.tags).toEqual(['todos']);
    expect(o.operationId).toBe('getTodos');
    const responses = o.responses as Record<string, { content: Record<string, { schema: Json }> }>;
    expect(responses['200']?.content['application/json']?.schema).toEqual({
      type: 'array',
      items: { $ref: '#/components/schemas/Todo' },
    });
  });

  it('Todo は余分なキーを許さず、必須のキーを持つ', () => {
    expect(schemas.Todo).toMatchObject({
      type: 'object',
      additionalProperties: false,
      required: ['id', 'title', 'done'],
    });
  });

  it('参照はすべて components.schemas にあり、$defs は残らない', () => {
    const refs = [...text.matchAll(/"\$ref":"#\/components\/schemas\/([^"]+)"/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const id of refs) expect(schemas[id as string], id).toBeDefined();
    expect(text).not.toContain('$defs');
  });
});
