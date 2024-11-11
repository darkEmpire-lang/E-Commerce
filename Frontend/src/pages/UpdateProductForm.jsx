import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateProductForm = () => {
  const { id } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    darazLink: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    // Fetch the product details to populate the form
    axios.get(`/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('darazLink', product.darazLink);

    // Append new images to formData
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product updated:', response.data);
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleInputChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="description"
        value={product.description}
        onChange={handleInputChange}
        placeholder="Product Description"
        required
      />
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleInputChange}
        placeholder="Product Price"
        required
      />
      <input
        type="text"
        name="darazLink"
        value={product.darazLink}
        onChange={handleInputChange}
        placeholder="Daraz Link"
        required
      />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        accept="image/*"
      />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default UpdateProductForm;
