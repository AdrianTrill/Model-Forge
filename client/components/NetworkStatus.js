import React, { useState, useEffect } from 'react';
import { useOfflineStatus } from '../utils/offlineManager';

export default function NetworkStatus() {
  const [mounted, setMounted] = useState(false);
  const status = useOfflineStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add effect to handle network status changes
  useEffect(() => {
    if (mounted) {
      console.log('Network status changed:', status);
    }
  }, [status, mounted]);

  if (!mounted) {
    return null; // Don't render anything on the server
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '5px',
      backgroundColor: status.isOnline && status.isServerAvailable ? '#4caf50' : '#f44336',
      color: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'background-color 0.3s ease'
    }}>
      {!status.isOnline && (
        <span>Network Offline</span>
      )}
      {status.isOnline && !status.isServerAvailable && (
        <span>Server Unavailable</span>
      )}
      {status.isOnline && status.isServerAvailable && (
        <span>Online</span>
      )}
    </div>
  );
} 