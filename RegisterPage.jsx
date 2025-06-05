import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:5136/register', { name, username, password, dob });
            localStorage.setItem('regusername',username)
            alert('Registration successful');
            navigate('/DashboardUser');
        } catch (error) {
            alert('Error registering');
        }
    };

    return (
        <div className="register-container">
            <button className="back-button" onClick={() => navigate('/')}>Back</button>
            <form className="register-form" onSubmit={handleRegister}>
                <h1 className="register-heading">Register</h1>

                <label className="register-label" htmlFor="name">Name:</label>
                <input
                    className="register-input"
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="register-label" htmlFor="dob">Date of Birth:</label>
                <input
                    className="register-input"
                    type="date"
                    id="dob"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />

                <label className="register-label" htmlFor="username">Username:</label>
                <input
                    className="register-input"
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="register-label" htmlFor="password">Password:</label>
                <input
                    className="register-input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label className="register-label" htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    className="register-input"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="register-submit-button" type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
