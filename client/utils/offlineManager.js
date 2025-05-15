import { useState, useEffect } from 'react';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class OfflineManager {
  constructor() {
    this.pendingOperations = [];
    this.listeners = new Set();
    this.isOnline = isBrowser ? window.navigator.onLine : true;
    this.isServerAvailable = true;
    this.healthCheckInterval = null;

    if (isBrowser) {
      // Bind the handlers to preserve 'this' context
      this.handleOnline = this.handleOnline.bind(this);
      this.handleOffline = this.handleOffline.bind(this);
      
      // Add event listeners
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      // Initial health check
      this.checkServerHealth();
      this.startHealthCheck();
    }
  }

  checkServerHealth = async () => {
    if (!this.isOnline) {
      this.isServerAvailable = false;
      this.notifyListeners();
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/health');
      this.isServerAvailable = response.ok;
    } catch (error) {
      this.isServerAvailable = false;
    }
    this.notifyListeners();
  };

  startHealthCheck = () => {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(this.checkServerHealth, 5000);
  };

  handleOnline = async () => {
    console.log('Network is online');
    this.isOnline = true;
    await this.checkServerHealth();
    await this.processPendingOperations();
  };

  handleOffline = () => {
    console.log('Network is offline');
    this.isOnline = false;
    this.isServerAvailable = false;
    this.notifyListeners();
  };

  addPendingOperation = (operation) => {
    console.log('Adding pending operation:', operation);
    this.pendingOperations.push(operation);
    this.savePendingOperations();
    this.notifyListeners();
  };

  getPendingOperations = () => {
    return this.pendingOperations;
  };

  savePendingOperations = () => {
    if (isBrowser) {
      localStorage.setItem('pending_operations', JSON.stringify(this.pendingOperations));
    }
  };

  loadPendingOperations = () => {
    if (isBrowser) {
      const stored = localStorage.getItem('pending_operations');
      if (stored) {
        this.pendingOperations = JSON.parse(stored);
      }
    }
  };

  processPendingOperations = async () => {
    if (!this.isOnline || !this.isServerAvailable) {
      console.log('Cannot process operations: offline or server unavailable');
      return;
    }

    console.log('Processing pending operations:', this.pendingOperations);
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        let response;
        switch (operation.type) {
          case 'POST':
            response = await fetch('http://localhost:3001/api/models', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(operation.data)
            });
            break;
          case 'PUT':
          case 'PATCH':
            response = await fetch(`http://localhost:3001/api/models/${operation.data.id}`, {
              method: operation.type,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(operation.data)
            });
            break;
          case 'DELETE':
            response = await fetch(`http://localhost:3001/api/models/${operation.data.id}`, {
              method: 'DELETE'
            });
            break;
        }

        if (!response.ok) {
          throw new Error(`Failed to sync operation: ${operation.type}`);
        }

        // Emit socket event to notify other clients
        if (isBrowser && window.socket) {
          window.socket.emit('syncOperation', operation);
        }
      } catch (error) {
        console.error('Error processing pending operation:', error);
        this.pendingOperations.push(operation);
      }
    }

    this.savePendingOperations();
    this.notifyListeners();
  };

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  notifyListeners = () => {
    const status = {
      isOnline: this.isOnline,
      isServerAvailable: this.isServerAvailable,
      pendingOperations: this.pendingOperations
    };
    console.log('Notifying listeners with status:', status);
    this.listeners.forEach(listener => listener(status));
  };

  cleanup = () => {
    if (isBrowser) {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
    }
  };
}

const offlineManager = new OfflineManager();

// Initialize only in browser environment
if (isBrowser) {
  offlineManager.loadPendingOperations();
}

export const useOfflineStatus = () => {
  const [status, setStatus] = useState({
    isOnline: offlineManager.isOnline,
    isServerAvailable: offlineManager.isServerAvailable,
    pendingOperations: offlineManager.pendingOperations
  });

  useEffect(() => {
    const handleChange = (newStatus) => {
      console.log('Status changed:', newStatus);
      setStatus(newStatus);
    };

    // Subscribe to status changes
    const unsubscribe = offlineManager.subscribe(handleChange);

    // Initial status check
    handleChange({
      isOnline: offlineManager.isOnline,
      isServerAvailable: offlineManager.isServerAvailable,
      pendingOperations: offlineManager.pendingOperations
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
};

export default offlineManager; 