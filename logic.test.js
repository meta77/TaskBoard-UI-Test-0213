import { describe, it, expect } from 'vitest';
import { filterTasksByStatus, getTaskKey, generateTaskKey, getNextStatus } from './logic.js';

describe('TaskBoard Logic', () => {

  describe('filterTasksByStatus', () => {
    it('は、指定されたステータスのタスクのみを抽出すること', () => {
      const tasks = [
        { id: 1, status: 'todo' },
        { id: 2, status: 'done' },
        { id: 3, status: 'todo' }
      ];
      const result = filterTasksByStatus(tasks, 'todo');
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id)).toContain(1);
      expect(result.map(t => t.id)).toContain(3);
    });

    it('該当するタスクがない場合は空の配列を返すこと', () => {
      const tasks = [{ id: 1, status: 'todo' }];
      expect(filterTasksByStatus(tasks, 'done')).toEqual([]);
    });
  });

  describe('getTaskKey', () => {
    it('は、キーが存在する場合そのキーを返すこと', () => {
      expect(getTaskKey({ key: 'SYS-101' })).toBe('SYS-101');
    });

    it('は、キーが空または存在しない場合 "NEW" を返すこと', () => {
      expect(getTaskKey({ title: 'test' })).toBe('NEW');
      expect(getTaskKey({ key: '' })).toBe('NEW');
    });
  });

  describe('generateTaskKey', () => {
    it('は、タスク数に応じた動的なキーを生成すること', () => {
      expect(generateTaskKey(5)).toBe('TAS-105');
      expect(generateTaskKey(0)).toBe('TAS-100');
    });
  });

  describe('getNextStatus', () => {
    it('は、ステータスを次の段階へ進めること', () => {
      expect(getNextStatus('backlog')).toBe('todo');
      expect(getNextStatus('review')).toBe('done');
    });

    it('は、最後のステータスの次は最初に戻ること', () => {
      expect(getNextStatus('done')).toBe('backlog');
    });
  });

});
