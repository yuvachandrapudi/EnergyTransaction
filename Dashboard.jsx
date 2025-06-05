import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const DashboardPage = () => {
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/contracts?status=${filter}`);
        setContracts(res.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, [filter]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-heading">Menu</h2>
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Contract History</li>
          <li>User Profile</li>
        </ul>
      </aside>
      <main className="main-content">
        <h1>Dashboard</h1>
        <div className="
        ">
          <nav className="contract-nav">
            <button onClick={() => setFilter('inprogress')}>In Progress</button>
            <button onClick={() => setFilter('active')}>Active</button>
            <button onClick={() => setFilter('expiringsoon')}>Expiring Soon</button>
            <button onClick={() => setFilter('all')}>All</button>
          </nav>
          <div className="contract-table-container">
            <table className="contract-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Currently With</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr key={contract.id}>
                    <td>{contract.id}</td>
                    <td>{contract.title}</td>
                    <td>{contract.status}</td>
                    <td>{contract.currently_with}</td>
                    <td>{contract.start_date}</td>
                    <td>{contract.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
