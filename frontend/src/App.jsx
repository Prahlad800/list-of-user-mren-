// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users',err);
    }
  };

  const fetchUserCount = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users/count');
      setTotal(res.data.totalUsers);
    } catch (err) {
      console.error('Error fetching count',err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserCount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3000/users', {
        name,
        contactNumber,
      });
      setMessage(res.data.message);
      setName('');
      setContactNumber('');
      fetchUsers();
      fetchUserCount();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add user');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>User Registration</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          required
          onChange={(e) => setContactNumber(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
          Add User
        </button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <h3>Total Users: {total}</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            <strong>{user.name}</strong> - {user.contactNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
