import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/router';

export default function MonitoredUsers() {
  const { user } = useAuth();
  const router = useRouter();
  const [monitoredUsers, setMonitoredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    // Fetch monitored users
    const fetchMonitoredUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/monitored-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMonitoredUsers(data.monitoredUsers);
        } else {
          setError('Failed to fetch monitored users');
        }
      } catch (error) {
        setError('Error fetching monitored users');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMonitoredUsers();
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout title="Monitored Users">
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Monitored Users</h1>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Reason</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Suspicious Activity Count</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {monitoredUsers.map((monitoredUser) => (
                  <tr key={monitoredUser.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '1rem' }}>{monitoredUser.user.username}</td>
                    <td style={{ padding: '1rem' }}>{monitoredUser.user.email}</td>
                    <td style={{ padding: '1rem' }}>{monitoredUser.reason}</td>
                    <td style={{ padding: '1rem' }}>{monitoredUser.suspiciousActivityCount}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(monitoredUser.lastChecked).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {monitoredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>
                      No monitored users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
} 