// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`); // Replace with actual API endpoint
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.images[0]} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <a href={product.darazLink} target="_blank" rel="noopener noreferrer">
        <button>Shop Now</button>
      </a>
      <Link to="/products">Back to Products</Link>
    </div>
  );
};

export default ProductDetails;
