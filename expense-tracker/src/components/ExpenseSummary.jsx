import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const COLORS = {
  Food: '#ff9500',
  Transport: '#0077cc',
  Entertainment: '#8b5cf6',
  Shopping: '#f97316',
  Health: '#10b981',
  Other: '#64748b',
};

function ExpenseSummary() {
  const { expenses, totalAmount, categories, budget, budgetUsagePercent, setBudget } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(budget ? budget.toString() : '');

  useEffect(() => {
    setBudgetInput(budget ? budget.toString() : '');
  }, [budget]);

  const byCategory = categories.reduce((acc, cat) => {
    const total = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);

    if (total > 0) {
      acc[cat] = total;
    }

    return acc;
  }, {});

  const handleBudgetSave = () => {
    const value = parseFloat(budgetInput);
    if (!value || value < 0) {
      setBudgetInput('');
      setBudget(0);
      return;
    }

    setBudget(value);
  };

  const handleExportCSV = () => {
    const header = ['Name', 'Amount', 'Category', 'Date'];
    const rows = expenses
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((expense) => [
        expense.name.replace(/"/g, '""'),
        expense.amount.toFixed(2),
        expense.category,
        `'expense.date`,
      ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="summary">
      <h3>Total: ${totalAmount.toFixed(2)}</h3>
      <p>{expenses.length} transactions</p>

      <div className="budget-block">
        <div className="budget-row">
          <span>Monthly budget</span>
          <span>${budget > 0 ? budget.toFixed(2) : '0.00'}</span>
        </div>

        {budget > 0 && (
          <>
            <div className="progress-wrapper">
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{
                    width: `${budgetUsagePercent}%`,
                    background: budgetUsagePercent >= 100 ? '#dc2626' : '#10b981',
                  }}
                />
              </div>
              <span className="progress-label">{budgetUsagePercent.toFixed(0)}% used</span>
            </div>
          </>
        )}

        <div className="budget-input-row">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Set monthly budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />
          <button type="button" onClick={handleBudgetSave}>
            Set
          </button>
        </div>
      </div>

      <div className="chart-section">
        <h4>Spending by category</h4>

        {categories.map((cat) => {
          const amount = byCategory[cat] || 0;
          const percent = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

          return (
            <div className="chart-row" key={cat}>
              <div className="chart-label">
                <span className="chart-dot" style={{ background: COLORS[cat] || COLORS.Other }} />
                {cat}
              </div>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${percent}%`, background: COLORS[cat] || COLORS.Other }} />
              </div>
              <div className="chart-value">${amount.toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      <button type="button" className="export-button" onClick={handleExportCSV}>
        Export CSV
      </button>
    </div>
  );
}

export default ExpenseSummary;  