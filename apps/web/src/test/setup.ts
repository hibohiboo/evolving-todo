import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetDb } from '../mocks/handlers';
import { server } from '../mocks/node';
import { settleResponseChecks, throwIfResponseErrors, watchResponses } from './responseCheck';

// MSW の応答は、すべて API の一覧（packages/schemas）と照らす。ずれたら、そのテストを落とす（responseCheck.ts）
watchResponses(server);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(async () => {
  try {
    await settleResponseChecks();
  } finally {
    // 応答の誤りで落とすときも、後片付けは必ず行う
    cleanup();
    server.resetHandlers();
    resetDb();
  }
  throwIfResponseErrors();
});
afterAll(async () => {
  await settleResponseChecks();
  server.close();
  throwIfResponseErrors();
});
