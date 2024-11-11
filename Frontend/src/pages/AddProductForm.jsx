import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: []
  });

  const categories = [
    "Electronics", "Clothing", "Home Appliances", "Books", "Sports Equipment", 
    "Toys & Games", "Health & Beauty", "Groceries", "Automotive", "Furniture", 
    "Jewelry", "Footwear", "Office Supplies", "Pet Supplies", "Video Games", 
    "Music Instruments", "Gardening", "Handmade Crafts", "Collectibles", "Travel Accessories", 
    "Outdoors & Camping"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProduct({
      ...product,
      images: e.target.files
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);

    for (let i = 0; i < product.images.length; i++) {
      formData.append('images', product.images[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product added:', response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="file"
            className="form-control"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
