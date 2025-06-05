import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('user');
    const navigate = useNavigate();
    

    const handleLoginTypeChange = (type) => {
        setLoginType(type);
    };

    const handleLogin = async () => {
        try {
            localStorage.setItem('username',username)
            const res = await axios.post('http://localhost:5136/login', { username, password, type: loginType });
            alert('Login successful');

            // Conditionally navigate based on loginType
            if (loginType === 'user') {
                navigate('/DashboardUser'); // Navigate to user interface
            } else if (loginType === 'admin') {
                navigate('/DashboardAdmin'); // Navigate to admin interface
            }
            // Store token if needed: localStorage.setItem('token', res.data.token);
        } catch (error) {
            alert('Invalid credentials');
            
        }
    };

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to the RegisterPage
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">Login</h1>
            <div className="login-type-selector">
                <button
                    className={`login-type-button ${loginType === 'user' ? 'active' : ''}`}
                    onClick={() => handleLoginTypeChange('user')}
                >
                    User Login
                </button>
                <button
                    className={`login-type-button ${loginType === 'admin' ? 'active' : ''}`}
                    onClick={() => handleLoginTypeChange('admin')}
                >
                    Administrator Login
                </button>
            </div>
            <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <label className="login-label" htmlFor="username">Username:</label>
                <input
                    className="login-input"
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className="login-label" htmlFor="password">Password:</label>
                <input
                    className="login-input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-submit-button" type="submit">Login</button>
            </form>
            <div className="register-container">
                <span className="register-text">New here?</span>
                <button className="register-button" onClick={handleRegisterClick}>Register</button>
            </div>
        </div>
    );
};

export default LoginPage;
