// TODO のドメイン型と純粋関数。用語と決まりの正は docs/spec/todo.md

/** やること1件 */
export interface Todo {
  id: string;
  title: string;
  /** 完了したか */
  done: boolean;
}

/** まだ完了していない TODO の件数 */
export function remainingCount(todos: readonly Todo[]): number {
  return todos.filter((t) => !t.done).length;
}
