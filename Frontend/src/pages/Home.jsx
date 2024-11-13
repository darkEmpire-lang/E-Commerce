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
    <div className="home-container bg-light min-h-screen py-8">
      {/* Banner Section */}
      <div className="banner-section mb-4" style={{ marginTop: '20px', width: '100%' }}>
        <div className="banner-item" style={{ height: '250px', overflow: 'hidden' }}>
          <div className="banner-slider">
            <div className="banner-slide">
              <img
                src={bannerImages[currentBannerIndex]}
                alt={`Banner ${currentBannerIndex + 1}`}
                className="w-100"
                style={{
                  height: '250px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease-in-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container">
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-6 col-md-4 col-lg-2 mb-4 d-flex justify-content-center">
              <div className="card product-card shadow-sm rounded-lg" style={{ width: '170px', height: '280px' }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: '140px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }}
                />
                <div className="card-body p-2 d-flex flex-column justify-content-between">
                  <h6 className="card-title mb-1 text-truncate" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {product.name}
                  </h6>
                  <p className="card-text mb-2 text-muted" style={{ fontSize: '0.75rem' }}>
                    {product.description.length > 40 ? product.description.slice(0, 40) + '...' : product.description}
                  </p>
                  <p className="card-text mb-2 font-weight-bold" style={{ fontSize: '0.9rem' }}>Rs {product.price}</p>
                  <div className="d-flex gap-2">
                    <a href={product.darazLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm d-flex align-items-center justify-content-center flex-grow-1">
                      <FaShoppingCart className="mr-1" /> Buy Now
                    </a>
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center flex-grow-1"
                      onClick={() => handleShareClick(product.darazLink)}
                    >
                      <FaShareAlt className="mr-1" /> Share
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
