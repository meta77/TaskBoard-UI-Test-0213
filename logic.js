/**
 * ビジネスロジックをまとめたモジュール
 */

/**
 * 指定したステータスのタスクをフィルタリングする
 */
export const filterTasksByStatus = (tasks, status) => {
  return tasks.filter(t => t.status === status);
};

/**
 * タスクのキーを取得する（なければ 'NEW'）
 */
export const getTaskKey = (task) => {
  return task.key || 'NEW';
};

/**
 * 新しいタスク ID を生成する
 */
export const generateTaskId = () => {
  return Date.now();
};

/**
 * 新しいタスクキーを生成する
 */
export const generateTaskKey = (taskCount) => {
  return `TAS-${taskCount + 100}`;
};

/**
 * ステータスを遷移させる（古いメソッドの移植）
 */
export const getNextStatus = (currentStatus) => {
  const flow = ['backlog', 'todo', 'in-progress', 'review', 'done'];
  const index = flow.indexOf(currentStatus);
  return flow[(index + 1) % flow.length];
};
