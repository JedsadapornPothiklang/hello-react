function Skeleton({ count = 8 }) {
  return (
    <div className="country-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="country-card skeleton">
          <div className="skeleton-flag"></div>
          <div className="skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;