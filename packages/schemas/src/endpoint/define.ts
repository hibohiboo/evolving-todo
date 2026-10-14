// API の一覧の1項目（メソッド・パス・状態コードごとの応答）の定義。
// 一覧から OpenAPI の文書を作り（api/openapi.ts）、モック（MSW）の応答が一覧どおりかを検査する（check.ts）。

import { z } from 'zod';

export type Method = 'get' | 'post' | 'patch' | 'delete';

/** 一覧に書ける状態コード。今のモックが返すものだけ（増やすときはここに足す） */
export type StatusCode = 200 | 201 | 404 | 422;

export interface EndpointResponse {
  /** その状態コードになるのはどんなときか */
  description: string;
  schema: z.ZodType;
}

/** 成功の応答（200 か 201）を必ず1つ持つ。失敗の応答は返しうるものだけを書く */
export type EndpointResponses = ({ 200: EndpointResponse } | { 201: EndpointResponse }) &
  Partial<Record<StatusCode, EndpointResponse>>;

export interface Endpoint {
  method: Method;
  /** `/todos/:id` の形（MSW のハンドラと同じ書き方。`/api` は付けない） */
  path: string;
  /** 画面の操作の言葉で短く（例：「TODO を追加する」） */
  summary: string;
  description?: string;
  responses: EndpointResponses;
}

export function defineEndpoint(endpoint: Endpoint): Endpoint {
  return endpoint;
}

/** 失敗の応答の本文。どの API も同じ形 */
export const errorBodySchema = z.strictObject({ message: z.string() });

/** 失敗の応答（本文は { message }） */
export const failure = (description: string): EndpointResponse => ({
  description,
  schema: errorBodySchema,
});

/** 成功の応答 */
export const success = (description: string, schema: z.ZodType): EndpointResponse => ({
  description,
  schema,
});

/** パスの引数の名前をそろえる（`:id` と `:tid` は同じルート）。一覧とハンドラの照合に使う */
export const routeKey = (e: Pick<Endpoint, 'method' | 'path'>): string =>
  `${e.method.toUpperCase()} ${e.path.replace(/:[^/]+/g, ':')}`;
