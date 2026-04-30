import { createContext, useContext, useEffect, useReducer } from 'react';

const ExpenseContext = createContext();
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];

function parseDateValue(value) {
  const date = new Date(value);
  if (!Number.isNaN(date.valueOf())) {
    return date;
  }

  const normalized = value.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, '$3-$2-$1');
  return new Date(normalized);
}

function normalizeExpenses(expenses) {
  return expenses.map((expense) => ({
    ...expense,
    date: expense.date || new Date().toISOString().slice(0, 10),
  }));
}

function expenseReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload }
            : expense
        ),
      };
    case 'LOAD':
      return { ...state, expenses: normalizeExpenses(action.payload) };
    case 'LOAD_ALL':
      return {
        ...state,
        expenses: normalizeExpenses(action.payload.expenses || []),
        budget: action.payload.budget || 0,
      };
    case 'DELETE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case 'FILTER':
      return { ...state, filter: action.payload };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    default:
      return state;
  }
}

const initialState = {
  expenses: [],
  filter: 'All',
  budget: 0,
};

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const stored =
      localStorage.getItem('expenseTrackerData') || localStorage.getItem('expenses');

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        dispatch({ type: 'LOAD', payload: parsed });
      } else if (parsed && typeof parsed === 'object') {
        dispatch({ type: 'LOAD_ALL', payload: parsed });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'expenseTrackerData',
      JSON.stringify({
        expenses: state.expenses,
        budget: state.budget,
      })
    );
  }, [state.expenses, state.budget]);

  const sortedExpenses = [...state.expenses].sort((a, b) => {
    const dateA = parseDateValue(a.date).getTime();
    const dateB = parseDateValue(b.date).getTime();
    return dateB - dateA;
  });

  const filteredExpenses =
    state.filter === 'All'
      ? sortedExpenses
      : sortedExpenses.filter((e) => e.category === state.filter);

  const totalAmount = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetUsagePercent = state.budget > 0 ? Math.min(100, (totalAmount / state.budget) * 100) : 0;

  function addExpense(name, amount, category, date) {
    const newExpense = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      category,
      date,
    };

    dispatch({ type: 'ADD', payload: newExpense });
  }

  function updateExpense(expense) {
    dispatch({ type: 'UPDATE', payload: expense });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function setFilter(cat) {
    dispatch({ type: 'FILTER', payload: cat });
  }

  function setBudget(amount) {
    dispatch({ type: 'SET_BUDGET', payload: amount });
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses: state.expenses,
        filteredExpenses,
        totalAmount,
        filter: state.filter,
        categories: CATEGORIES,
        budget: state.budget,
        budgetUsagePercent,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilter,
        setBudget,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}
