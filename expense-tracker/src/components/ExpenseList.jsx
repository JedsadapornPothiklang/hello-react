import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const COLORS = {
  Food: '#ff9500',
  Transport: '#0077cc',
  Entertainment: '#8b5cf6',
  Shopping: '#f97316',
  Health: '#10b981',
  Other: '#64748b',
};

function ExpenseList() {
  const {
    filteredExpenses,
    deleteExpense,
    filter,
    setFilter,
    categories,
    updateExpense,
  } = useExpenses();

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState(categories[0] || 'Food');
  const [editDate, setEditDate] = useState(new Date().toISOString().slice(0, 10));
  const [editError, setEditError] = useState('');

  function startEdit(expense) {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDate(expense.date);
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError('');
  }

  function saveEdit(id) {
    if (!editName.trim()) {
      setEditError('Enter name');
      return;
    }

    if (!editAmount || parseFloat(editAmount) <= 0) {
      setEditError('Enter amount');
      return;
    }

    if (!editDate) {
      setEditError('Choose a date');
      return;
    }

    updateExpense({
      id,
      name: editName.trim(),
      amount: parseFloat(editAmount),
      category: editCategory,
      date: editDate,
    });

    setEditingId(null);
  }

  return (
    <div className="expense-list-section">
      <div className="tabs">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'tab active' : 'tab'}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="expense-list">
        {filteredExpenses.map((exp) => (
          <div
            key={exp.id}
            className={`expense-item ${editingId === exp.id ? 'editing' : ''}`}
          >
            <span
              className="expense-color"
              style={{ background: COLORS[exp.category] || COLORS.Other }}
            />

            {editingId === exp.id ? (
              <div className="expense-edit-form">
                {editError && <p className="form-error">{editError}</p>}
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className="expense-edit-row">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="expense-edit-actions">
                  <button type="button" className="save-button" onClick={() => saveEdit(exp.id)}>
                    Save
                  </button>
                  <button type="button" className="cancel-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="expense-details">
                  <b>{exp.name}</b>
                  <small>{new Date(exp.date).toLocaleDateString()}</small>
                </div>
                <span>${exp.amount.toFixed(2)}</span>
                <div className="expense-actions">
                  <button type="button" className="edit-button" onClick={() => startEdit(exp)}>
                    Edit
                  </button>
                  <button type="button" className="delete-button" onClick={() => deleteExpense(exp.id)}>
                    ✕
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;  