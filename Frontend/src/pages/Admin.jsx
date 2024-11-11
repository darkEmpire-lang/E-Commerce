import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import '../styles/Admin.css'; 
const Admin = () => {
  const [products, setProducts] = useState([]); // Initialize products as an empty array
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    darazLink: ''
  });
  const [editingProduct, setEditingProduct] = useState(null); // To track the product being edited

  // Fetch all products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        // Check if response data is an array, otherwise set an empty array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setProducts([]); // Ensure products is always an array
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // In case of error, ensure products is an array
      }
    };
    fetchProducts();
  }, []);

  // Add a new product
  const handleCreateProduct = async () => {
    try {
      const response = await axios.post('/api/products', newProduct);
      setProducts([...products, response.data]); // Add new product to list
      setNewProduct({ name: '', description: '', price: '', images: [], darazLink: '' }); // Reset form
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).map((file) => URL.createObjectURL(file)); // Preview images
    setNewProduct({ ...newProduct, images: imageArray });
  };

  // Delete a product by ID
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id)); // Remove product from list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Open edit mode with selected product's details
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  // Update a product
  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(`/api/products/${editingProduct._id}`, editingProduct);
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );
      setEditingProduct(null); // Close edit mode
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Form to add a new product */}
      <div className="product-form">
        <h2>Add a New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="product-input"
        />
        <textarea
          placeholder="Product Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="product-input"
        />
        <input
          type="text"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="product-input"
        />
        <input
          type="text"
          placeholder="Daraz Link"
          value={newProduct.darazLink}
          onChange={(e) => setNewProduct({ ...newProduct, darazLink: e.target.value })}
          className="product-input"
        />

        {/* Image upload */}
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="image-input"
          />
          <div className="image-preview">
            {newProduct.images.map((image, index) => (
              <img key={index} src={image} alt={`Product ${index}`} className="image-thumbnail" />
            ))}
          </div>
        </div>

        <button onClick={handleCreateProduct} className="submit-btn">Add Product</button>
      </div>

      {/* List of products with edit and delete options */}
      <h2>Product List</h2>
      <ul className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} className="product-item">
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                {product.images.length > 0 && (
                  <img src={product.images[0]} alt={product.name} className="product-image" />
                )}
              </div>
              <div className="product-actions">
                <button onClick={() => handleEditProduct(product)} className="action-btn">Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="action-btn">Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>

      {/* Edit form for updating product details */}
      {editingProduct && (
        <div className="edit-form">
          <h2>Edit Product</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            className="product-input"
          />
          <textarea
            placeholder="Description"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, description: e.target.value })
            }
            className="product-input"
          />
          <input
            type="text"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            className="product-input"
          />
          <input
            type="text"
            placeholder="Daraz Link"
            value={editingProduct.darazLink}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, darazLink: e.target.value })
            }
            className="product-input"
          />
          <button onClick={handleUpdateProduct} className="submit-btn">Save Changes</button>
          <button onClick={() => setEditingProduct(null)} className="cancel-btn">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
