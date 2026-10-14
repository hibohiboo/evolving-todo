// TODO のドメイン型と純粋関数。用語と決まりの正は docs/spec/todo.md
// 型は zod のスキーマから作る（API の一覧と OpenAPI の文書が同じスキーマを使う。packages/schemas）
import { z } from 'zod';

/** やること1件 */
export const todoSchema = z.strictObject({
  id: z.string(),
  title: z.string().describe('やることの内容'),
  done: z.boolean().describe('完了したか'),
});

export type Todo = z.infer<typeof todoSchema>;

/** まだ完了していない TODO の件数 */
export function remainingCount(todos: readonly Todo[]): number {
  return todos.filter((t) => !t.done).length;
}
