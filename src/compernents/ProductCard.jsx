import RatingStars from "./RatingStar"
import Description from "./Description"

function ProductCard({ product }) {
    const { name, price, rating, reviews, inStock, category, image, description, discount } = product;
    
    const discountedPrice = discount ? price * (1 - discount / 100) : price;
    
    function handleAddToCart() {
    if (inStock) { alert(`Added "${name}" to cart! Price: $${discountedPrice.toFixed(2)}`); }
    }

    return (
        <div className={`product-card${!inStock ? " unavailable" : ""}`}>
            {discount && (
                <div className="discount-badge">
                    -{discount}%
                </div>
            )}
            <div className={`badge ${inStock ? "badge-green" : "badge-red"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
            </div>
                <img src={image} alt={name} className="product-img" />
                <span className="category">{category}</span>
                <h3>{name}</h3>
                <RatingStars rating={rating} reviews={reviews} />
                <Description description={description} />
                
            <div className="card-footer">
                <div className="price-container">
                    {discount ? (
                        <>
                            <span className="original-price">${price.toFixed(2)}</span>
                            <strong className="price discounted">${discountedPrice.toFixed(2)}</strong>
                        </>
                    ) : (
                        <strong className="price">${price.toFixed(2)}</strong>
                    )}
                </div>
                <button onClick={handleAddToCart} disabled={!inStock} className="add-btn">
                {inStock ? "Add to Cart" : "Unavailable"}
                </button>
            </div>
        </div>
    );
}
export default ProductCard;