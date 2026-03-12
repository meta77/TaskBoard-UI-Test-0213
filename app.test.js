import { describe, it, expect, vi, beforeEach } from 'vitest';

// Vueのモックをグローバルに設定
global.Vue = {
  ref: (val) => ({
    value: val,
    // シンプルな .value の挙動のみをシミュレート
  })
};

// ブラウザの alert をモック
global.alert = vi.fn();

// モーション（移動）のテスト用にインポート
import { useTaskApp } from './app.js';

describe('App Logic (useTaskApp)', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = useTaskApp();
  });

  it('初期状態でタスクがロードされていること', () => {
    expect(app.tasks.value.length).toBeGreaterThan(0);
  });

  it('openModalを呼ぶとisModalOpenがtrueになること', () => {
    expect(app.isModalOpen.value).toBe(false);
    app.openModal();
    expect(app.isModalOpen.value).toBe(true);
    expect(app.isEditing.value).toBe(false);
  });

  it('既存のタスクを渡してopenModalを呼ぶと編集モードになること', () => {
    const task = app.tasks.value[0];
    app.openModal(task);
    expect(app.isEditing.value).toBe(true);
    expect(app.currentTask.value.id).toBe(task.id);
  });

  it('タイトルが空でsaveTaskを呼ぶとアラートが出て保存されないこと', () => {
    app.openModal(); // 新規作成
    app.currentTask.value.title = '';
    app.saveTask();

    expect(global.alert).toHaveBeenCalledWith('Title is required');
    expect(app.isModalOpen.value).toBe(true); // モーダルは開いたまま
  });

  it('正しいタイトルでsaveTaskを呼ぶとタスクが追加されモーダルが閉じること', () => {
    const initialCount = app.tasks.value.length;
    app.openModal();
    app.currentTask.value.title = '新しいテストタスク';
    app.saveTask();

    expect(app.tasks.value.length).toBe(initialCount + 1);
    expect(app.tasks.value[app.tasks.value.length - 1].title).toBe('新しいテストタスク');
    expect(app.isModalOpen.value).toBe(false);
  });

  it('ドラッグ＆ドロップでタスクのステータスと順序を更新できること', () => {
    const taskToMove = app.tasks.value[0]; // SYS-101 (backlog)
    const targetTask = app.tasks.value[2]; // SEC-042 (todo)

    app.onDragStart(taskToMove.id);
    // targetTaskの前にドロップ
    app.onDrop({ preventDefault: () => {} }, 'todo', targetTask.id);

    const movedTask = app.tasks.value.find(t => t.id === taskToMove.id);
    expect(movedTask.status).toBe('todo');
    // SEC-042 の前に挿入されているはず
    const todoTasks = app.tasks.value.filter(t => t.status === 'todo');
    expect(todoTasks[0].id).toBe(taskToMove.id);
  });
});
