import { filterTasksByStatus, getTaskKey, generateTaskId, generateTaskKey, getNextStatus, moveTaskInArray, findTargetPosition } from './logic.js';

export const useTaskApp = () => {
  const { ref } = Vue;
  const columns = [
    { id: 'backlog', name: 'Backlog' },
    { id: 'todo', name: 'To Do' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'review', name: 'Review' },
    { id: 'done', name: 'Done' }
  ];

  const tasks = ref([
    { id: 1, key: 'SYS-101', title: 'Database schema migration for v2', status: 'backlog', priority: 'high', assignee: 'JD', dueDate: '02.20' },
    { id: 2, key: 'UI-204', title: 'Refactor zinc color variables', status: 'in-progress', priority: 'low', assignee: 'SK', dueDate: '02.13' },
    { id: 3, key: 'SEC-042', title: 'OAuth2 implementation check', status: 'todo', priority: 'medium', assignee: 'AN', dueDate: '02.18' },
    { id: 4, key: 'DOC-001', title: 'API Documentation v1.0', status: 'done', priority: 'medium', assignee: 'JD', dueDate: '02.10' },
    { id: 5, key: 'TEST-09', title: 'E2E testing with Playwright', status: 'in-progress', priority: 'high', assignee: 'TW', dueDate: '02.12' },
    { id: 6, key: 'SYS-102', title: 'S3 Bucket policy auditing', status: 'backlog', priority: 'low', assignee: 'SK', dueDate: '02.25' },
    { id: 7, key: 'UI-205', title: 'Mobile responsive grid fix', status: 'review', priority: 'medium', assignee: 'AN', dueDate: '02.14' },
    { id: 8, key: 'API-08', title: 'GraphQL rate limiting', status: 'todo', priority: 'high', assignee: 'JD', dueDate: '02.19' },
    { id: 9, key: 'SEC-043', title: 'Secret rotation automation', status: 'in-progress', priority: 'medium', assignee: 'TW', dueDate: '02.15' },
    { id: 10, key: 'SEC-043', title: 'Secret rotation automation', status: 'in-progress', priority: 'medium', assignee: 'TW', dueDate: '02.15' },
    { id: 11, key: 'SEC-043', title: 'Secret rotation automation', status: 'in-progress', priority: 'medium', assignee: 'TW', dueDate: '02.15' },
    { id: 12, key: 'SEC-043', title: 'Secret rotation automation', status: 'in-progress', priority: 'medium', assignee: 'TW', dueDate: '02.15' }
  ]);

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
    description: ''
  });

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
    const target = findTargetPosition(tasks.value, taskId, direction);
    if (!target) return;
    tasks.value = moveTaskInArray(tasks.value, taskId, target.status, target.targetTaskId);
  };

  const openModal = (task = null) => {
    if (task) {
      isEditing.value = true;
      currentTask.value = { ...task };
    } else {
      isEditing.value = false;
      currentTask.value = {
        id: null,
        key: `NEW-${tasks.value.length + 1}`,
        title: '',
        status: 'backlog',
        priority: 'medium',
        assignee: 'ME',
        dueDate: '',
        description: ''
      };
    }
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const saveTask = () => {
    if (!currentTask.value.title) return alert('Title is required');
    if (isEditing.value) {
      const index = tasks.value.findIndex(t => t.id === currentTask.value.id);
      if (index !== -1) {
        tasks.value[index] = { ...currentTask.value };
      }
    } else {
      tasks.value.push({
        ...currentTask.value,
        id: generateTaskId(),
        key: generateTaskKey(tasks.value.length)
      });
    }
    closeModal();
  };

  const nextStatus = (task) => {
    task.status = getNextStatus(task.status);
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
    quickMove
  };
};
