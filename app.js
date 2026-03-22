import { 
  filterTasksByStatus, getTaskKey, generateTaskId, generateTaskKey, getNextStatus, 
  moveTaskInArray, findTargetPosition, addFieldSetting, removeFieldSetting, 
  updateFieldSetting, sanitizeTaskDescriptions,
  addColumnSetting, removeColumnSetting, updateColumnSetting, sanitizeTaskStatuses,
  formatDisplayDate
} from './logic.js';

export const useTaskApp = () => {
  const { ref } = Vue;
  const columns = ref([
    { id: 'backlog', name: 'Backlog' },
    { id: 'todo', name: 'To Do' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'review', name: 'Review' },
    { id: 'done', name: 'Done' }
  ]);

  const tasks = ref([
    { id: 1, key: 'SYS-101', title: 'v2に向けたデータベースのスキーマ移行', status: 'backlog', priority: 'high', assignee: 'JD', dueDate: '2026-02-20', descriptions: { desc_1: '新しい形式にマッピングされた以前の説明文' } },
    { id: 2, key: 'UI-204', title: 'Zincカラー変数のリファクタリング', status: 'in-progress', priority: 'low', assignee: 'SK', dueDate: '2026-02-13', descriptions: { desc_1: '' } },
    { id: 3, key: 'SEC-042', title: 'OAuth2実装状況の確認', status: 'todo', priority: 'medium', assignee: 'AN', dueDate: '2026-02-18', descriptions: { desc_1: '' } },
    { id: 4, key: 'DOC-001', title: 'APIドキュメント v1.0の作成', status: 'done', priority: 'medium', assignee: 'JD', dueDate: '2026-02-10', descriptions: { desc_1: '' } },
    { id: 5, key: 'TEST-09', title: 'PlaywrightによるE2Eテストの実施', status: 'in-progress', priority: 'high', assignee: 'TW', dueDate: '2026-02-12', descriptions: { desc_1: '' } },
    { id: 6, key: 'SYS-102', title: 'S3バケットポリシーの監査', status: 'backlog', priority: 'low', assignee: 'SK', dueDate: '2026-02-25', descriptions: { desc_1: '' } },
    { id: 7, key: 'UI-205', title: 'モバイル・レスポンシブ・グリッドの修正', status: 'review', priority: 'medium', assignee: 'AN', dueDate: '2026-02-14', descriptions: { desc_1: '' } },
    { id: 8, key: 'API-08', title: 'GraphQLのレート制限の実装', status: 'todo', priority: 'high', assignee: 'JD', dueDate: '2026-02-19', descriptions: { desc_1: '' } },
    { id: 9, key: 'SEC-043', title: 'シークレットローテーションの自動化', status: 'in-progress', priority: 'medium', assignee: 'TW', dueDate: '2026-02-15', descriptions: { desc_1: '' } },
    { id: 10, key: 'UI-206', title: 'ダークモードのカラーコントラスト調整', status: 'review', priority: 'low', assignee: 'SK', dueDate: '2026-02-16', descriptions: { desc_1: '' } },
    { id: 11, key: 'API-09', title: '認証エンドポイントのユニットテスト追加', status: 'todo', priority: 'medium', assignee: 'JD', dueDate: '2026-02-22', descriptions: { desc_1: '' } },
    { id: 12, key: 'DOC-002', title: 'READMEのデプロイガイド更新', status: 'done', priority: 'low', assignee: 'AN', dueDate: '2026-02-11', descriptions: { desc_1: '' } },
    { id: 13, key: 'SYS-103', title: 'Redisキャッシュの有効期限ポリシー設定', status: 'backlog', priority: 'high', assignee: 'TW', dueDate: '2026-02-28', descriptions: { desc_1: '' } },
    { id: 14, key: 'FE-301', title: 'ダッシュボードのグラフコンポーネント実装', status: 'in-progress', priority: 'high', assignee: 'SK', dueDate: '2026-02-14', descriptions: { desc_1: '' } },
    { id: 15, key: 'SEC-044', title: '脆弱性スキャン結果の修正対応', status: 'todo', priority: 'high', assignee: 'AN', dueDate: '2026-02-17', descriptions: { desc_1: '' } },
    { id: 16, key: 'TEST-10', title: '負荷テストのシナリオ作成', status: 'backlog', priority: 'medium', assignee: 'JD', dueDate: '2026-03-01', descriptions: { desc_1: '' } },
    { id: 17, key: 'UI-207', title: 'フォントサイズのアクセシビリティ改善', status: 'review', priority: 'low', assignee: 'TW', dueDate: '2026-02-15', descriptions: { desc_1: '' } },
    { id: 18, key: 'API-10', title: '外部通知サービスとの連携実装', status: 'in-progress', priority: 'medium', assignee: 'SK', dueDate: '2026-02-18', descriptions: { desc_1: '' } },
    { id: 19, key: 'DOC-003', title: '開発環境構築フローの動画マニュアル作成', status: 'todo', priority: 'low', assignee: 'JD', dueDate: '2026-02-24', descriptions: { desc_1: '' } },
    { id: 20, key: 'SYS-104', title: 'ログ出力の構造化（JSON形式）対応', status: 'done', priority: 'medium', assignee: 'AN', dueDate: '2026-02-12', descriptions: { desc_1: '' } }
  ]);


  // 設定状態の管理
  const descriptionSettings = ref([
    { id: 'desc_1', title: 'Description' }
  ]);
  const isSettingsModalOpen = ref(false);
  const settingsDraft = ref([]);
  const columnsDraft = ref([]);

  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const draggedTaskId = ref(null);
  const currentTask = ref({
    id: null,
    key: '',
    title: '',
    status: 'backlog',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    descriptions: {}
  });

  // Settings Modal Functions
  const openSettingsModal = () => {
    // ディープコピーでドラフトを作成
    settingsDraft.value = JSON.parse(JSON.stringify(descriptionSettings.value));
    columnsDraft.value = JSON.parse(JSON.stringify(columns.value));
    isSettingsModalOpen.value = true;
  };

  const closeSettingsModal = () => {
    isSettingsModalOpen.value = false;
  };

  const saveSettings = () => {
    descriptionSettings.value = [...settingsDraft.value];
    columns.value = [...columnsDraft.value];
    
    // 既存タスクのサニタイズ（不要なDescriptionを削除する）
    let updatedTasks = tasks.value.map(task => ({
      ...task,
      descriptions: sanitizeTaskDescriptions(task.descriptions, descriptionSettings.value)
    }));

    // 列設定の変更によるサニタイズ（削除された列のタスクを左端へ移動）
    tasks.value = sanitizeTaskStatuses(updatedTasks, columns.value);

    closeSettingsModal();
  };

  const draftAddField = () => {
    settingsDraft.value = addFieldSetting(settingsDraft.value, `New Field ${settingsDraft.value.length + 1}`);
  };

  const draftRemoveField = (id) => {
    settingsDraft.value = removeFieldSetting(settingsDraft.value, id);
  };

  const draftUpdateField = (id, newTitle) => {
    settingsDraft.value = updateFieldSetting(settingsDraft.value, id, newTitle);
  };

  const draftAddColumn = () => {
    columnsDraft.value = addColumnSetting(columnsDraft.value, `New Column`);
  };

  const draftRemoveColumn = (id) => {
    columnsDraft.value = removeColumnSetting(columnsDraft.value, id);
  };

  const draftUpdateColumn = (id, newTitle) => {
    columnsDraft.value = updateColumnSetting(columnsDraft.value, id, newTitle);
  };


  const getTasksByStatus = (status) => filterTasksByStatus(tasks.value, status);

  const onDragStart = (taskId) => {
    draggedTaskId.value = taskId;
  };

  const onDrop = (event, status, targetTaskId = null) => {
    event.preventDefault();
    if (draggedTaskId.value === null) return;
    tasks.value = moveTaskInArray(tasks.value, draggedTaskId.value, status, targetTaskId);
    draggedTaskId.value = null;
  };

  const quickMove = (taskId, direction) => {
    const target = findTargetPosition(tasks.value, taskId, direction, columns.value);
    if (!target) return;
    tasks.value = moveTaskInArray(tasks.value, taskId, target.status, target.targetTaskId);
  };

  const openModal = (task = null) => {
    if (task) {
      isEditing.value = true;
      // descriptionsがない古いデータへの後方互換
      const taskDescriptions = task.descriptions || {};
      if (task.description && Object.keys(taskDescriptions).length === 0) {
          taskDescriptions['desc_1'] = task.description;
      }

      currentTask.value = { 
        ...task,
        descriptions: { ...taskDescriptions }
      };
    } else {
      isEditing.value = false;
      
      const newDescriptions = {};
      descriptionSettings.value.forEach(s => {
        newDescriptions[s.id] = '';
      });

      currentTask.value = {
        id: null,
        key: `NEW-${tasks.value.length + 1}`,
        title: '',
        status: 'backlog',
        priority: 'medium',
        assignee: 'ME',
        dueDate: '',
        descriptions: newDescriptions
      };
    }
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const saveTask = () => {
    if (!currentTask.value.title) return alert('Title is required');
    
    // 保存前に設定に存在しない不要なDescriptionをサニタイズ
    const sanitizedDescriptions = sanitizeTaskDescriptions(currentTask.value.descriptions, descriptionSettings.value);
    const taskToSave = { ...currentTask.value, descriptions: sanitizedDescriptions };
    // 古いフィールドがあれば削除
    delete taskToSave.description;

    if (isEditing.value) {
      const index = tasks.value.findIndex(t => t.id === taskToSave.id);
      if (index !== -1) {
        tasks.value[index] = taskToSave;
      }
    } else {
      tasks.value.push({
        ...taskToSave,
        id: generateTaskId(),
        key: generateTaskKey(tasks.value.length)
      });
    }
    closeModal();
  };


  const nextStatus = (task) => {
    task.status = getNextStatus(task.status, columns.value);
  };

  const addTask = () => {
    openModal();
  };

  return {
    columns,
    tasks,
    getTasksByStatus,
    nextStatus,
    addTask,
    isModalOpen,
    isEditing,
    currentTask,
    openModal,
    closeModal,
    saveTask,
    getTaskKey,
    onDragStart,
    onDrop,
    draggedTaskId,
    quickMove,
    descriptionSettings,
    isSettingsModalOpen,
    settingsDraft,
    openSettingsModal,
    closeSettingsModal,
    saveSettings,
    draftAddField,
    draftRemoveField,
    draftUpdateField,
    columnsDraft,
    draftAddColumn,
    draftRemoveColumn,
    draftUpdateColumn,
    formatDisplayDate
  };
};
