import { remainingCount } from '@evolving-todo/domain/todo';
import { useTodos } from '@/shared/api/todos';

/** TODO の一覧の画面（docs/spec/todo.md） */
export function TodoPage() {
  const { data: todos, isPending, isError } = useTodos();

  return (
    <main>
      <h1>やること</h1>
      {isPending && <p>読み込み中…</p>}
      {isError && <p role="alert">TODO を読み込めませんでした。</p>}
      {todos && (
        <>
          <p className="summary">残り {remainingCount(todos)} 件</p>
          {todos.length === 0 ? (
            <p className="empty">やることはありません。</p>
          ) : (
            <ul className="todo-list">
              {todos.map((t) => (
                <li key={t.id} data-done={t.done}>
                  {t.title}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
