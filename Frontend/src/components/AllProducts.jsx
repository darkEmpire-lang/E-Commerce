import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
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

  return (
    <div className="home-container bg-light min-h-screen py-8">
      {/* Search and Filter Section */}
      <div className="container d-flex justify-content-center align-items-center flex-column mb-4" style={{ marginTop: '20px' }}>
        <div className="flex items-center gap-3 mb-4">
          <select
            className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-medium shadow-sm hover:bg-gray-200 transition-colors"
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
            className="flex-grow p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="button"
            className="p-2 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-all"
            onClick={() => console.log('Search triggered')}
          >
            Search
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-3 mt-4">
          <label htmlFor="price-range" className="block text-sm font-medium text-gray-900">
            Min Price: Rs {minPrice}
          </label>
          <input
            id="price-range"
            type="range"
            min="0"
            max="500000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />

          <label htmlFor="price-range-max" className="block text-sm font-medium text-gray-900">
            Max Price: Rs {maxPrice}
          </label>
          <input
            id="price-range-max"
            type="range"
            min="0"
            max="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="product-grid">
              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                    <div className="card product-card shadow-sm rounded-lg overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="card-img-top"
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                        }}
                      />
                      <div className="card-body p-3">
                        <h6 className="card-title" style={{
                          fontSize: '1rem', 
                          fontWeight: 'bold', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          maxWidth: '100%'
                        }}>
                          {product.name}
                        </h6>
                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                          {product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="card-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            Rs {product.price}
                          </p>
                        </div>
                        <a href={product.darazLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3 w-100">
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
