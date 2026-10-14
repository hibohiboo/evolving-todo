// /todos の API の一覧

import { todoSchema } from '@evolving-todo/domain/todo';
import { z } from 'zod';
import { defineEndpoint, success } from '../endpoint/define';

export const todoEndpoints = [
  defineEndpoint({
    method: 'get',
    path: '/todos',
    summary: 'TODO の一覧を取得する',
    description: '完了したものも含めて、すべての TODO を返す',
    responses: { 200: success('TODO の一覧', z.array(todoSchema)) },
  }),
];
