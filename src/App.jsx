import "./App.css";
import products from "./data/products";
import ProductCard from "./compernents/ProductCard";

function App() {
  const availableCount = products.filter(p => p.inStock).length;
  return (
   <div className="app">
      <header className="app-header">
        <h1>Tech Shop</h1>
          <p>{products.length} products | {availableCount} available</p>
      </header>
      <div className="gallery-grid">
          {products.map(product => (<ProductCard key={product.id} product={product} />))}
      </div>
    </div>
  )
}

export default App
