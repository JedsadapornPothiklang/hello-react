import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

function AddExpenseForm() {
  const { addExpense, categories } = useExpenses();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Enter name');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter amount');
      return;
    }

    if (!date) {
      setError('Choose a date');
      return;
    }

    addExpense(name.trim(), amount, category, date);
    setName('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setError('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add expense</h2>
      {error && <p className="form-error">{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Expense name"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        min="0"
        step="0.01"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button type="submit">+ Add</button>
    </form>
  );
}

export default AddExpenseForm;  