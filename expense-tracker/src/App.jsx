import { ExpenseProvider } from './context/ExpenseContext';
import ExpenseSummary from './components/ExpenseSummary';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <div className="app">
        <header>
          <h1>Expense Tracker</h1>
        </header>

        <div className="main-layout">
          <aside>
            <ExpenseSummary />
          </aside>

          <main>
            <AddExpenseForm />
            <ExpenseList />
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;