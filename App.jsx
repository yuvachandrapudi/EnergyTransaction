import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import DashboardUser from './DashboardUser';
import DashboardAdmin from './DashboardAdmin';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/Dashboard" element={<Dashboard />}/>
                <Route path="/DashboardUser" element={<DashboardUser />}/>
                <Route path="/DashboardAdmin" element={<DashboardAdmin />}/>
            </Routes>
        </Router>
    );
}

export default App;
