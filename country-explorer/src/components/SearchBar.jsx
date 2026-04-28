import { useRef } from 'react';

function SearchBar({ onSearch, searchTerm }) {
  const inputRef = useRef(null);

  function handleClear() {
    onSearch('');
    inputRef.current.focus();
  }

  return (
    <div className='search-bar'>
      <input
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder='🔍 Search for a country...'
      />
      {searchTerm && (
        <button className='clear-btn' onClick={handleClear}>✕</button>
      )}
    </div>
  );
}

export default SearchBar;