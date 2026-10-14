// /api/* のモック。バックエンドは無く、状態はメモリ上にだけあり、リロードで消える
import type { Todo } from '@evolving-todo/domain/todo';
import { HttpResponse, http } from 'msw';
import { initialTodos } from './fixtures';

let todos: Todo[] = structuredClone([...initialTodos]);

/** テストの後に初期データへ戻す（src/test/setup.ts） */
export function resetDb() {
  todos = structuredClone([...initialTodos]);
}

export const handlers = [http.get('/api/todos', () => HttpResponse.json(todos))];
