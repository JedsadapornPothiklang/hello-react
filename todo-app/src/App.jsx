import { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import './App.css';

const STORAGE_KEY = 'todo-tasks';

function App() {
const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { id: 1, text: 'Complete React Session 3', completed: true },
    { id: 2, text: 'Read React docs', completed: false },
    { id: 3, text: 'Read React documentation', completed: false },
  ];
});
const [filter, setFilter] = useState('all');
let nextId = 4;

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}, [tasks]);

function handleAddTask(text) {
  setTasks([...tasks, { id: nextId++, text, completed: false }]);
}

function handleToggle(id) {
  setTasks(tasks.map(t => t.id===id ? {...t, completed:!t.completed} : t));
}

function handleDelete(id) {
  setTasks(tasks.filter(t => t.id !== id));
}

function handleEdit(id, newText) {
  setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
}

function handleSelectAll() {
  const allCompleted = tasks.every(t => t.completed);
  setTasks(tasks.map(t => ({ ...t, completed: !allCompleted })));
}

const filteredTasks = tasks.filter((task) => {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true;
});

const remainingCount = tasks.filter(t => !t.completed).length;

return (
<div className="app-container">
<h1>Todo List</h1>
<TaskInput onAddTask={handleAddTask} />
<div className="header-row">
  <label className="select-all">
    <input type="checkbox" checked={tasks.length > 0 && tasks.every(t => t.completed)} onChange={handleSelectAll} />
    Select All
  </label>
  <span className="task-count">{remainingCount} task{remainingCount !== 1 ? 's' : ''} remaining</span>
</div>
<div className="filters">
<button onClick={() => setFilter('all')} className={filter==='all' ? 'active' : ''}>All</button>
<button onClick={() => setFilter('active')} className={filter==='active' ? 'active' : ''}>Active</button>
<button onClick={() => setFilter('completed')} className={filter==='completed' ? 'active' : ''}>Completed</button>
</div>
<ul className="task-list">
{filteredTasks.map(task => (
<TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
))}
</ul>
</div>
);
}


export default App;
