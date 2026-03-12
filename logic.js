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
 * 配列内のタスクを並び替える（純粋関数）
 * @param {Array} tasks - 元のタスク一覧
 * @param {number} taskId - 移動させるタスクのID
 * @param {string} targetStatus - 移動後のステータス
 * @param {number|null} targetTaskId - どのタスクの前に挿入するか（nullなら一番後ろ）
 */
export const moveTaskInArray = (tasks, taskId, targetStatus, targetTaskId) => {
  const newTasks = [...tasks];

  // 1. 移動対象のタスクを取得して一時削除
  const taskIndex = newTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return tasks;

  const [task] = newTasks.splice(taskIndex, 1);

  // 2. ステータスを更新（副作用を避けるためコピーを更新）
  const updatedTask = { ...task, status: targetStatus };

  // 3. 挿入位置を決定
  let insertIndex;
  if (targetTaskId === null) {
    insertIndex = newTasks.length; // 最後へ
  } else {
    insertIndex = newTasks.findIndex(t => t.id === targetTaskId);
    if (insertIndex === -1) insertIndex = newTasks.length;
  }

  // 4. 挿入して完了
  newTasks.splice(insertIndex, 0, updatedTask);
  return newTasks;
};

/**
 * ステータスを遷移させる
 */
export const getNextStatus = (currentStatus) => {
  const flow = ['backlog', 'todo', 'in-progress', 'review', 'done'];
  const index = flow.indexOf(currentStatus);
  return flow[(index + 1) % flow.length];
};
