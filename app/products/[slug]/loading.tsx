
export default function ProductLoading() {
    return (
        <div className="premium-product-page">
            <div className="product-loading-hero">
                <div className="product-loading-hero__content">
                    <div className="product-skeleton product-loading-kicker" />
                    <div className="product-skeleton product-loading-title" />
                    <div className="product-skeleton product-loading-title short" />
                    <div className="product-skeleton product-loading-description" />
                    <div className="product-skeleton product-loading-button" />
                </div>
            </div>

            <div className="page-shell product-loading-details">
                <div className="product-skeleton product-loading-image" />

                <div className="product-loading-info">
                    <div className="product-skeleton product-loading-heading" />
                    <div className="product-skeleton product-loading-line" />
                    <div className="product-skeleton product-loading-line" />
                    <div className="product-skeleton product-loading-line short" />
                </div>
            </div>
        </div>
    );
}
