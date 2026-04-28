import { useState } from 'react';
import useFetch from './hooks/useFetch';
import CountryCard from './components/CountryCard';
import SearchBar from './components/SearchBar';
import Skeleton from './components/Skeleton';
import './App.css';

const API = 'https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,languages,cca3,area,currencies,timezones';

function App() {
  const { data: countries, loading, error } = useFetch(API);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const filtered = (countries || []).filter(c =>
    c.name.common.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRegion === 'All' || c.region === selectedRegion)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.common.localeCompare(b.name.common);
    if (sortBy === 'population') return b.population - a.population;
    return 0;
  });

  const getRegionCount = (region) => {
    if (!countries) return 0;
    return region === 'All'
      ? countries.length
      : countries.filter(c => c.region === region).length;
  };

  const toggleFavorite = (cca3) => {
    setFavorites(prev =>
      prev.includes(cca3)
        ? prev.filter(id => id !== cca3)
        : [...prev, cca3]
    );
  };

  const isFavorite = (cca3) => favorites.includes(cca3);

  if (loading) return (
    <div className="app">
      <h1>Country Explorer</h1>
      <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />
      <Skeleton count={8} />
    </div>
  );

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className='app'>
      <h1>Country Explorer</h1>
      <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />

      <div className="controls">
        <div className="region-buttons">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={selectedRegion === r ? 'active' : ''}
            >
              {r}
              <span className="badge">{getRegionCount(r)}</span>
            </button>
          ))}
        </div>

        <div className="sort-select">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="population">Population</option>
          </select>
        </div>
      </div>

      <p className="results-count">Showing {sorted.length} of {countries.length} countries</p>

      <div className='country-grid'>
        {sorted.map(c => (
          <CountryCard
            key={c.name.common}
            country={c}
            onClick={() => setSelectedCountry(c)}
            isFavorite={isFavorite(c.cca3)}
            onToggleFavorite={() => toggleFavorite(c.cca3)}
          />
        ))}
      </div>

      {selectedCountry && (
        <div className="modal-overlay" onClick={() => setSelectedCountry(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCountry(null)}>×</button>
            <img src={selectedCountry.flags.svg} alt={selectedCountry.name.common} className="modal-flag" />
            <h2>{selectedCountry.name.common}</h2>
            <div className="modal-details">
              <p><strong>Official Name:</strong> <span>{selectedCountry.name.official}</span></p>
              <p><strong>Capital:</strong> <span>{selectedCountry.capital?.[0] || 'N/A'}</span></p>
              <p><strong>Population:</strong> <span>{selectedCountry.population.toLocaleString()}</span></p>
              <p><strong>Area:</strong> <span>{selectedCountry.area?.toLocaleString() || 'N/A'} km²</span></p>
              <p><strong>Region:</strong> <span>{selectedCountry.region}</span></p>
              <p><strong>Subregion:</strong> <span>{selectedCountry.subregion || 'N/A'}</span></p>
              <p><strong>Languages:</strong> <span>{selectedCountry.languages ? Object.values(selectedCountry.languages).join(', ') : 'N/A'}</span></p>
              <p><strong>Currencies:</strong> <span>{selectedCountry.currencies ? Object.values(selectedCountry.currencies).map(c => c.name).join(', ') : 'N/A'}</span></p>
              <p><strong>Timezones:</strong> <span>{selectedCountry.timezones?.join(', ') || 'N/A'}</span></p>
              <p><strong>Country Code:</strong> <span>{selectedCountry.cca3}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;