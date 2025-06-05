import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './RegisterPage.css';



const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('dashboard');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  


  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      console.log('Fetched products:', res.data);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      console.log('Fetched users:', res.data);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-product', { title, price });
      setTitle(''); // Clear the form
      setPrice(''); // Clear the form
      fetchProducts(); // Refresh product list after adding
      setView('dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
    }
};


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-heading">Menu</h2>
        <ul className="sidebar-menu">
          <li onClick={() => setView('dashboard')}>Dashboard</li>
          <li onClick={() => setView('users')}>Users</li>
          <li onClick={() => setView('Profile')}>Profile</li>
          <li onClick={() => setView('addproducts')}>Add Product</li>
          <li onClick={() => navigate('/')}>LogOut</li>
        </ul>
      </aside>
      <main className="main-content">
        {view === 'dashboard' && (
          <>
                <h1>Admin Dashboard</h1>
            <div className='product-section'>
              <table className='product-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        )}

        {view === 'users' && (
          <>
            <h1>Users List</h1>
            <div className="product-section">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.dob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}

        {view === 'Profile' && (
          <>
            <h1>Profile</h1>
          </>
        )}
        {view === 'addproducts' && (
          <>
          <div className="register-container">
            <form className="register-form" onSubmit={addProduct}>
                <h1 className="register-heading">Add Product</h1>

                <label className="register-label" htmlFor="Title">Title:</label>
                <input
                    className="register-input"
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="register-label" htmlFor="price">Price:</label>
                <input
                    className="register-input"
                    type="integer"
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button className="register-submit-button" type="submit">Add</button>
            </form>
        </div>
          </>
        )}
      </main>
    </div>
  );
};


export default AdminDashboard;
