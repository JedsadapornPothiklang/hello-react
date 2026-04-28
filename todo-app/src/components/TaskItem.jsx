import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  function handleSave() {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setEditText(task.text);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  }

  if (isEditing) {
    return (
      <li className="task-item editing">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="edit-input"
          autoFocus
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? " completed" : ""}`}>
      <label className="task-label">
        <input type="checkbox" checked={task.completed}
          onChange={() => onToggle(task.id)} />
        <span>{task.text}</span>
      </label>
      <div className="task-actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(task.id)} className="delete-btn">✕</button>
      </div>
    </li>
  );
}

export default TaskItem;