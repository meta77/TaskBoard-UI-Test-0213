import { describe, it, expect, vi } from 'vitest';
import { 
  filterTasksByStatus, getTaskKey, generateTaskKey, getNextStatus, moveTaskInArray, findTargetPosition, 
  addFieldSetting, removeFieldSetting, updateFieldSetting, sanitizeTaskDescriptions 
} from './logic.js';


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
  });

  describe('moveTaskInArray', () => {
    it('は、別ステータスの特定位置へ移動できること', () => {
      const tasks = [
        { id: 1, status: 'todo' },
        { id: 2, status: 'done' }
      ];
      const result = moveTaskInArray(tasks, 1, 'done', 2);
      expect(result[0].id).toBe(1);
      expect(result[0].status).toBe('done');
      expect(result[1].id).toBe(2);
    });

    it('は、同じステータス内で順序を入れ替えられること', () => {
      const tasks = [
        { id: 1, status: 'todo' },
        { id: 2, status: 'todo' }
      ];
      // 2を1の前に持ってくる
      const result = moveTaskInArray(tasks, 2, 'todo', 1);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
    });

    it('は、ターゲットがnullの場合、最後尾に追加されること', () => {
      const tasks = [
        { id: 1, status: 'todo' },
        { id: 2, status: 'todo' }
      ];
      const result = moveTaskInArray(tasks, 1, 'todo', null);
      expect(result[1].id).toBe(1);
    });

    it('は、移動対象とターゲットが同じIDの場合、元の配列を変更せずに返すこと', () => {
      const tasks = [
        { id: 1, status: 'todo' },
        { id: 2, status: 'todo' },
        { id: 3, status: 'done' }
      ];
      const result = moveTaskInArray(tasks, 2, 'todo', 2);
      expect(result).toEqual(tasks);
    });
  });


  describe('findTargetPosition', () => {
    const tasks = [
      { id: 1, status: 'backlog' },
      { id: 2, status: 'backlog' },
      { id: 3, status: 'todo' }
    ];

    it('は、上に移動するターゲットを正しく計算すること', () => {
      const target = findTargetPosition(tasks, 2, 'up');
      expect(target.status).toBe('backlog');
      expect(target.targetTaskId).toBe(1);
    });

    it('は、一番上のタスクをさらに上に移動できないこと', () => {
      expect(findTargetPosition(tasks, 1, 'up')).toBeNull();
    });

    it('は、右のステータスへの移動を正しく計算すること', () => {
      const target = findTargetPosition(tasks, 1, 'right');
      expect(target.status).toBe('todo');
      expect(target.targetTaskId).toBeNull(); // 列移動は最後尾へ
  });

  describe('Field Settings Logic', () => {
    describe('addFieldSetting', () => {
      it('は、新しいフィールドを追加すること', () => {
        const settings = [{ id: 'desc_1', title: 'Description 1' }];
        const newSettings = addFieldSetting(settings, 'New Field');
        expect(newSettings).toHaveLength(2);
        expect(newSettings[1].title).toBe('New Field');
        expect(newSettings[1].id).toMatch(/^desc_\d+$/);
      });

      it('は、最大3つまでしか追加しないこと', () => {
        const settings = [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' },
          { id: '3', title: 'C' }
        ];
        const newSettings = addFieldSetting(settings, 'D');
        expect(newSettings).toHaveLength(3);
        expect(newSettings).toEqual(settings);
      });
    });

    describe('removeFieldSetting', () => {
      it('は、指定したフィールドを削除すること', () => {
        const settings = [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' }
        ];
        const newSettings = removeFieldSetting(settings, '1');
        expect(newSettings).toHaveLength(1);
        expect(newSettings[0].id).toBe('2');
      });

      it('は、最低1つのフィールドを残すこと', () => {
        const settings = [{ id: '1', title: 'A' }];
        const newSettings = removeFieldSetting(settings, '1');
        expect(newSettings).toHaveLength(1);
        expect(newSettings).toEqual(settings);
      });
    });

    describe('updateFieldSetting', () => {
      it('は、指定したフィールドのタイトルを更新すること', () => {
        const settings = [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' }
        ];
        const newSettings = updateFieldSetting(settings, '2', 'Updated B');
        expect(newSettings[1].title).toBe('Updated B');
        expect(newSettings[0].title).toBe('A');
      });
    });

    describe('sanitizeTaskDescriptions', () => {
      it('は、現在の設定に含まれないdescriptionキーを削除すること', () => {
        const descriptions = { '1': 'foo', '2': 'bar', '3': 'baz' };
        const settings = [{ id: '1', title: 'A' }, { id: '3', title: 'C' }];
        const sanitized = sanitizeTaskDescriptions(descriptions, settings);
        expect(sanitized).toEqual({ '1': 'foo', '3': 'baz' });
        expect(sanitized).not.toHaveProperty('2');
      });

      it('は、descriptionsが未定義の場合、空オブジェクトを返すこと', () => {
        expect(sanitizeTaskDescriptions(undefined, [])).toEqual({});
      });
    });
  });

});
