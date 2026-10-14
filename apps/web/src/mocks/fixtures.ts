// モックの初期データ。テストやページの中で独自の値を作らず、ここから引く（docs/process/rules/testing.md「シードデータ」）
import type { Todo } from '@evolving-todo/domain/todo';

export const initialTodos: readonly Todo[] = [
  { id: 'todo-1', title: '牛乳を買う', done: false },
  { id: 'todo-2', title: 'LT の資料を作る', done: false },
  { id: 'todo-3', title: '部屋の掃除', done: true },
];
