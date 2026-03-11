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
});
