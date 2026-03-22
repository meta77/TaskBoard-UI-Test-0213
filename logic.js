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
  if (taskId === targetTaskId) return tasks;
  
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
 * 相対的な方向から移動先を特定する
 */
export const findTargetPosition = (tasks, taskId, direction, columns) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const currentStatus = task.status;
  const sameStatusTasks = tasks.filter(t => t.status === currentStatus);
  const currentIndex = sameStatusTasks.findIndex(t => t.id === taskId);

  if (direction === 'up') {
    if (currentIndex <= 0) return null;
    return { status: currentStatus, targetTaskId: sameStatusTasks[currentIndex - 1].id };
  }

  if (direction === 'down') {
    if (currentIndex >= sameStatusTasks.length - 1) return null;
    const nextTask = sameStatusTasks[currentIndex + 1];
    // 下に移動する場合「次の次のタスクの前」に挿入する必要があるため、さらに次を探す
    const nextNextTask = sameStatusTasks[currentIndex + 2];
    return { status: currentStatus, targetTaskId: nextNextTask ? nextNextTask.id : null };
  }

  // extract column ids for horizontal movement
  const columnFlow = columns.map(c => c.id);
  const colIndex = columnFlow.indexOf(currentStatus);
  
  if (direction === 'left') {
    if (colIndex <= 0) return null;
    return { status: columnFlow[colIndex - 1], targetTaskId: null };
  }

  if (direction === 'right') {
    if (colIndex >= columnFlow.length - 1) return null;
    return { status: columnFlow[colIndex + 1], targetTaskId: null };
  }

  return null;
};

/**
 * ステータスを遷移させる
 */
export const getNextStatus = (currentStatus, columns) => {
  const flow = columns.map(c => c.id);
  const index = flow.indexOf(currentStatus);
  // もし現在のステータスが見つからなければ先頭のステータスにする
  if (index === -1) return flow[0];
  return flow[(index + 1) % flow.length];
};

/**
 * 新しい列設定を追加する (最大7つ)
 */
export const addColumnSetting = (columns, newName) => {
  if (columns.length >= 7) return columns;
  const newId = `col_${Date.now()}`;
  return [...columns, { id: newId, name: newName }];
};

/**
 * 指定した列設定を削除する
 */
export const removeColumnSetting = (columns, colId) => {
  if (columns.length <= 1) return columns; // 最低1つは残す
  return columns.filter(c => c.id !== colId);
};

/**
 * 指定した列設定の名称を更新する
 */
export const updateColumnSetting = (columns, colId, newName) => {
  return columns.map(c => c.id === colId ? { ...c, name: newName } : c);
};

/**
 * 設定変更によって存在しなくなった列（ステータス）のタスクを
 * 強制的に一番左の列（先頭）に移動（サニタイズ）する
 */
export const sanitizeTaskStatuses = (tasks, columns) => {
  const validIds = new Set(columns.map(c => c.id));
  const fallbackStatus = columns[0].id;
  
  return tasks.map(task => {
    if (!validIds.has(task.status)) {
      return { ...task, status: fallbackStatus };
    }
    return task;
  });
};

/**
 * 新しい設定フィールドを追加する (最大3つ)
 */
export const addFieldSetting = (settings, newTitle) => {
  if (settings.length >= 3) return settings;
  const newId = `desc_${Date.now()}`;
  return [...settings, { id: newId, title: newTitle }];
};

/**
 * 指定した設定フィールドを削除する
 */
export const removeFieldSetting = (settings, fieldId) => {
  if (settings.length <= 1) return settings; // 最低1つは残す
  return settings.filter(s => s.id !== fieldId);
};

/**
 * 指定した設定フィールドのタイトルを更新する
 */
export const updateFieldSetting = (settings, fieldId, newTitle) => {
  return settings.map(s => s.id === fieldId ? { ...s, title: newTitle } : s);
};

/**
 * 現在のフィールド設定に基づいて、不要な Description を削減（サニタイズ）する
 */
export const sanitizeTaskDescriptions = (descriptions, settings) => {
  if (!descriptions) return {};
  const validIds = new Set(settings.map(s => s.id));
  const newDescriptions = {};
  for (const [key, value] of Object.entries(descriptions)) {
    if (validIds.has(key)) {
      newDescriptions[key] = value;
    }
  }
  return newDescriptions;
};

/**
 * ISO 形式（YYYY-MM-DD）の日付を「MM.DD」形式に変換する
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[1]}.${parts[2]}`;
};
