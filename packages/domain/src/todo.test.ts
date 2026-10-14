import { describe, expect, it } from 'vitest';
import { remainingCount, type Todo } from './todo';

const todo = (id: string, done: boolean): Todo => ({ id, title: `TODO ${id}`, done });

describe('remainingCount', () => {
  it('完了していない TODO だけを数える', () => {
    expect(remainingCount([todo('1', false), todo('2', true), todo('3', false)])).toBe(2);
  });

  it('TODO が無ければ 0', () => {
    expect(remainingCount([])).toBe(0);
  });

  it('全部完了なら 0', () => {
    expect(remainingCount([todo('1', true), todo('2', true)])).toBe(0);
  });
});
