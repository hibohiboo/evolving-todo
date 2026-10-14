import type { Todo } from '@evolving-todo/domain/todo';
import { useQuery } from '@tanstack/react-query';

export const todosKey = ['todos'] as const;

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error(`GET /api/todos: ${res.status}`);
  return (await res.json()) as Todo[];
}

export function useTodos() {
  return useQuery({ queryKey: todosKey, queryFn: fetchTodos });
}
