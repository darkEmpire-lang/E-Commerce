import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaShoppingCart, FaShareAlt } from 'react-icons/fa';
import '../styles/Home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const bannerImages = [banner1, banner2, banner3];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://e-commerce-one-livid-92.vercel.app/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, minPrice, maxPrice, category, products]);

  const handleShareClick = (link) => {
    setShareLink(link);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  return (
    <div className="home-container bg-light min-vh-100 py-4">
      {/* Banner Section */}
      <div className="container d-flex flex-column align-items-center mb-5" style={{ marginTop: '20px' }}>
        <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-4 w-100">
          <select
            className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-medium shadow-sm w-100 w-md-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search for products..."
            className="p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 shadow-sm w-100 w-md-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="button"
            className="btn btn-primary p-2 shadow-md w-100 w-md-auto"
            onClick={() => console.log('Search triggered')}
          >
            Search
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="d-flex flex-column flex-md-row align-items-center gap-3 mt-4 w-100">
          <label htmlFor="min-price" className="text-muted">Min Price: Rs {minPrice}</label>
          <input
            id="min-price"
            type="range"
            min="0"
            max="500000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="form-range"
          />
          <label htmlFor="max-price" className="text-muted">Max Price: Rs {maxPrice}</label>
          <input
            id="max-price"
            type="range"
            min="0"
            max="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="form-range"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="container">
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
              <div className="card product-card shadow-sm rounded-lg w-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: '250px',
                    objectFit: 'cover',
                  }}
                />
                <div className="card-body p-3">
                  <h6 className="card-title mb-1 text-truncate font-weight-bold">
                    {product.name}
                  </h6>
                  <p className="card-text text-muted small">
                    {product.description.length > 80 ? product.description.slice(0, 80) + '...' : product.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="card-text font-weight-bold">Rs {product.price}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <a href={product.darazLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center">
                      <FaShoppingCart className="mr-2" />
                      Buy Now
                    </a>
                    <button
                      className="btn btn-secondary flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={() => handleShareClick(product.darazLink)}
                    >
                      <FaShareAlt className="mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Share Product</h4>
            <div className="d-flex justify-content-around">
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={32} color="#25D366" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={32} color="#4267B2" />
              </a>
              <a href={`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={32} color="#E1306C" />
              </a>
            </div>
            <button onClick={closeShareModal} className="btn btn-danger mt-4 w-100">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
