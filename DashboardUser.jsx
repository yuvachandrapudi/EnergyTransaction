import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [asserts, setAsserts] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [view, setView] = useState('dashboard'); // Default view is dashboard
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Retrieve username from localStoragee
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');


  useEffect(() => {

    fetchProducts();
    fetchAsserts(username); // Pass the username to fetchAsserts
    fetchUserDetails(username);
}, [username]);

const addProduct = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5136/add-product', { title, price, username });
    setTitle(''); // Clear the form
    setPrice(''); // Clear the form
    fetchProducts(); // Refresh product list after adding
    fetchAsserts();
    setView('dashboard');
  } catch (error) {
    console.error('Error adding product:', error);
  }
};
const fetchUserDetails = async (username) => {
  try {
      const res = await axios.get(`http://localhost:5136/user-details?username=${username}`);
      setUserDetails(res.data);
  } catch (error) {
      console.error('Error fetching user details:', error);
  }
};

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5136/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAsserts = async (username) => {
    console.log("Fetching asserts for:", username); // Debug log
    try {
        const res = await axios.get(`http://localhost:5136/userassert?username=${username}`); 
        setAsserts(res.data);
    } catch (error) {
        console.error('Error fetching asserts:', error);
    }
};


  const buyProduct = async (productId) => {
    try {
      await axios.post(`http://localhost:5136/buy`, { productId });
      alert('Product bought successfully');
      fetchAsserts(); // Refresh asserts after purchase
    } catch (error) {
      console.error('Error buying product:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-heading">Menu</h2>
        <ul className="sidebar-menu">
          <li onClick={() => setView('dashboard')}>Dashboard</li>
          <li onClick={() => setView('asserts')}>Asserts</li>
          <li onClick={() => setView('addproducts')}>Add Product</li>
          <li onClick={() => setView('profile')}>Profile</li>
          <li onClick={() => navigate('/')}>LogOut</li>
        </ul>
      </aside>
      <main className="main-content">
        {view === 'dashboard' && (
          <>
            <h1>User Dashboard</h1>
            <div className="product-section">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Seller</th>
                      <th>Buy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>{product.sellername}</td>
                        <td>
                          <button className="register-submit-button" onClick={() => buyProduct(product.id)}>Buy</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </>
        )}

        {view === 'asserts' && (
          <>
            <h1>Your Asserts</h1>
            <div className="product-section">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product_id</th>
                  <th>Title</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {asserts.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.product_id}</td>
                    <td>{item.title}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
        {view === 'addproducts' && (
          <>
          <div>
          <div className="addproduct-container">
            <form className="adproduct-form" onSubmit={addProduct}>
                <h1 className="addproduct-heading">Add Product</h1>

                <label className="addproduct-label" htmlFor="Title">Title:</label>
                <input
                    className="addproduct-input"
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="addproduct-label" htmlFor="price">Price:</label>
                <input
                    className="addproduct-input"
                    type="integer"
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button className="register-submit-button" type="submit">Add</button>
            </form>
        </div>
        <h1>Energy You Added</h1>
            <div className="product-section">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product_ID</th>
                      <th>Title</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                  {asserts.map(assert => (
                  <tr key={assert.id}>
                    <td>{assert.id}</td>
                    <td>{assert.product_id}</td>
                    <td>{assert.title}</td>
                    <td>{assert.price}</td>
                  </tr>
                ))}
                  </tbody>
                </table>
              </div>
              </div>
          </>
        )}

        {view === 'profile' && (
          <>
           <h1>Your Profile</h1>
           {userDetails ? (
            <div className="profile-details">
             <p><strong>UserID:</strong> {userDetails.id}</p>
             <p><strong>Username:</strong> {userDetails.username}</p>
             <p><strong>Name:</strong> {userDetails.name}</p>
             <p><strong>Date of Birth:</strong> {userDetails.dob}</p>
            </div>
            ) : (
             <p>Loading profile details...</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
