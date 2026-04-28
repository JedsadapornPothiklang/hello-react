function CountryCard({ country, onClick, isFavorite, onToggleFavorite }) {
  const pop = country.population.toLocaleString();
  const cap = country.capital ? country.capital[0] : 'N/A';
  const lang = country.languages
    ? Object.values(country.languages).slice(0, 2).join(', ')
    : 'N/A';

  return (
    <div className='country-card' onClick={onClick}>
      <img src={country.flags.svg}
        alt={'Flag of ' + country.name.common}
        className='country-flag' />
      <div className='country-info'>
        <div className="card-header">
          <h3>{country.name.common}</h3>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        <p><strong>Capital:</strong> {cap}</p>
        <p><strong>Population:</strong> {pop}</p>
        <p><strong>Languages:</strong> {lang}</p>
      </div>
    </div>
  );
}

export default CountryCard;