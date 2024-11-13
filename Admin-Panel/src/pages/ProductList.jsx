import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddProduct = (newProduct) => {
    axios.post('/api/products', newProduct)
      .then(() => {
        fetchProducts();
        setShowAddModal(false);
        Swal.fire('Success', 'Product added successfully!', 'success');
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error', 'Failed to add product.', 'error');
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Product List</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '70%',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add Product
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredProducts.map(product => (
          <div key={product._id} style={{
            width: '300px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            backgroundColor: '#fff',
            textAlign: 'center'
          }}>
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
            />
            <h2 style={{ color: '#333', margin: '10px 0' }}>{product.name}</h2>
            <p style={{ color: '#555' }}>{product.description}</p>
            <a
              href={product.darazLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#007bff',
                fontWeight: 'bold',
                display: 'inline-block',
                marginTop: '10px'
              }}
            >
              Shop Now
            </a>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Add Product</h2>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <AddProductForm onAddProduct={handleAddProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

const AddProductForm = ({ onAddProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [darazLink, setDarazLink] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      description,
      darazLink,
      images: [image]
    };
    onAddProduct(newProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <label>Product Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Daraz Link:</label>
        <input
          type="url"
          value={darazLink}
          onChange={(e) => setDarazLink(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Image URL:</label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#28a745',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductList;
