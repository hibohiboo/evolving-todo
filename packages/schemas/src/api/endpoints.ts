// API の一覧のすべて。OpenAPI の文書（openapi.ts）と、モックのハンドラとの1対1・応答の検査（apps/web のテスト）が使う。
// 並びは文書のタグの並び。

import type { Endpoint } from '../endpoint/define';
import { todoEndpoints } from '../todos/endpoints';

export const endpoints: readonly Endpoint[] = [...todoEndpoints];
