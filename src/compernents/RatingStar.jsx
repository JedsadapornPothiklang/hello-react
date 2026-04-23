function RatingStars({ rating, reviews }) {
  
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="rating">
        <span>{"★".repeat(fullStars)}{hasHalf ? "☆" : ""}{"☆".repeat(5 - fullStars - (hasHalf ? 1 : 0))}</span>
        <span className="review-count">({reviews} reviews)</span>
    </div>
    );
  }
export default RatingStars;