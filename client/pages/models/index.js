import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { filterModels } from '../../utils/filterModels';
import DashboardCharts from '../../components/DashboardCharts';
import { faker } from '@faker-js/faker';
import socket from '../../socket';
import offlineManager from '../../utils/offlineManager';
import { useOfflineStatus } from '../../utils/offlineManager';

export default function ModelsListPage() {
  // Models state
  const [models, setModels] = useState([]);
  const [displayedModels, setDisplayedModels] = useState([]);
  const { isOnline, isServerAvailable } = useOfflineStatus();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false);
  const PAGE_SIZE = 10;
  
  // Filtering state
  const [filterField, setFilterField] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auto-generation state
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [genIntervalId, setGenIntervalId] = useState(null);
  const [wsAuto, setWsAuto] = useState(false);

  // Intersection Observer ref
  const observer = useRef();
  const lastModelElementRef = useCallback(node => {
    if (isLoadingMore || !isInfiniteScrollEnabled) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, isInfiniteScrollEnabled]);

  // Load models from API or localStorage
  const loadModels = async (pageNum = 1) => {
    try {
      if (!isOnline || !isServerAvailable) {
        const cachedModels = localStorage.getItem('cached_models');
        if (cachedModels) {
          const parsedModels = JSON.parse(cachedModels);
          setModels(parsedModels);
          setDisplayedModels(parsedModels.slice(0, pageNum * PAGE_SIZE));
          setHasMore(parsedModels.length > pageNum * PAGE_SIZE);
        }
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/models?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      
      if (pageNum === 1) {
        setModels(data);
        setDisplayedModels(data);
      } else {
        const newModels = [...models, ...data];
        setModels(newModels);
        setDisplayedModels(newModels);
      }
      
      setHasMore(data.length === PAGE_SIZE);
      localStorage.setItem('cached_models', JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching models:', err);
      const cachedModels = localStorage.getItem('cached_models');
      if (cachedModels) {
        const parsedModels = JSON.parse(cachedModels);
        setModels(parsedModels);
        setDisplayedModels(parsedModels.slice(0, pageNum * PAGE_SIZE));
        setHasMore(parsedModels.length > pageNum * PAGE_SIZE);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load and page change effect
  useEffect(() => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    if (isInfiniteScrollEnabled || page === 1) {
      loadModels(page);
    }
  }, [page, isOnline, isServerAvailable, isInfiniteScrollEnabled]);

  // Listen for WebSocket updates
  useEffect(() => {
    socket.on('updateModels', (data) => {
      setModels(data);
      setDisplayedModels(data);
      localStorage.setItem('cached_models', JSON.stringify(data));
    });
    return () => {
      socket.off('updateModels');
    };
  }, []);

  // Handle offline operations
  const handleOfflineOperation = (operation) => {
    offlineManager.addPendingOperation(operation);
    if (operation.type === 'POST') {
      const newModels = [...models, operation.data];
      setModels(newModels);
      setDisplayedModels(newModels);
    } else if (operation.type === 'PUT' || operation.type === 'PATCH') {
      const updatedModels = models.map(model => 
        model.id === operation.data.id ? { ...model, ...operation.data } : model
      );
      setModels(updatedModels);
      setDisplayedModels(updatedModels);
    } else if (operation.type === 'DELETE') {
      const filteredModels = models.filter(model => model.id !== operation.data.id);
      setModels(filteredModels);
      setDisplayedModels(filteredModels);
    }
    localStorage.setItem('cached_models', JSON.stringify(models));
  };

  // Toggle WebSocket-based auto-generation
  const toggleWsAuto = () => {
    if (!isOnline || !isServerAvailable) {
      alert('Cannot toggle auto-generation while offline');
      return;
    }
    const newVal = !wsAuto;
    setWsAuto(newVal);
    socket.emit('toggleGeneration', newVal);
  };

  // Auto-generation using Faker (local simulation)
  const generateFakeModel = () => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    return {
      id,
      name: faker.company.name(),
      status: faker.helpers.arrayElement(["Training", "Completed", "Deprecated"]),
      type: faker.helpers.arrayElement(["CNN", "RNN", "Transformer"]),
      datasetUsed: faker.helpers.arrayElement(["CIFAR-100", "Open Assistant", "Custom Dataset"]),
      trainingDate: faker.date.past().toLocaleDateString('en-GB'),
      accuracy: faker.number.int({ min: 60, max: 100 }),
      price: faker.number.int({ min: 500, max: 5000 })
    };
  };

  const startGeneration = () => {
    if (generating) return;
    setGenerating(true);
    setGenCount(0);
    const intervalId = setInterval(() => {
      setGenCount(prevCount => {
        if (prevCount >= 100) {
          clearInterval(intervalId);
          setGenerating(false);
          setGenIntervalId(null);
          return prevCount;
        } else {
          const fakeModel = generateFakeModel();
          const newModels = [...models, fakeModel];
          setModels(newModels);
          setDisplayedModels(newModels);
          return prevCount + 1;
        }
      });
    }, 750);
    setGenIntervalId(intervalId);
  };

  const stopGeneration = () => {
    if (genIntervalId) {
      clearInterval(genIntervalId);
      setGenIntervalId(null);
      setGenerating(false);
    }
  };

  // Filtering
  const filteredModels = filterModels(displayedModels, filterField, searchTerm);

  // Global price statistics
  let maxPrice = 0, minPrice = 0, avgPrice = 0;
  if (filteredModels.length > 0) {
    const prices = filteredModels.map(m => m.price);
    maxPrice = Math.max(...prices);
    minPrice = Math.min(...prices);
    avgPrice = prices.reduce((sum, val) => sum + val, 0) / prices.length;
  }

  // Bucket-based coloring
  const sortedPrices = [...filteredModels].map(m => m.price).sort((a, b) => a - b);
  const bucketSize = Math.ceil(sortedPrices.length / 3);
  const getBucketColor = (price) => {
    const index = sortedPrices.findIndex(p => p === price);
    if (index === -1) return 'inherit';
    if (index < bucketSize) return 'green';
    else if (index < bucketSize * 2) return 'blue';
    else return 'red';
  };

  // Toggle infinite scroll
  const toggleInfiniteScroll = () => {
    const newState = !isInfiniteScrollEnabled;
    setIsInfiniteScrollEnabled(newState);
    
    if (newState) {
      // When enabling infinite scroll
      setPage(1);
      setIsLoading(true);
      loadModels(1); // Reload the first page
    }
  };

  if (isLoading) {
    return (
      <Layout title="Models">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading models...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Models">
      <h1>Model List</h1>
      {(!isOnline || !isServerAvailable) && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '1rem', 
          backgroundColor: '#f44336', 
          color: 'white',
          borderRadius: '4px'
        }}>
          You are currently offline. Changes will be synced when you're back online.
        </div>
      )}

      {/* Infinite Scroll Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={toggleInfiniteScroll}
          style={{
            padding: '8px 16px',
            backgroundColor: isInfiniteScrollEnabled ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          {isInfiniteScrollEnabled ? "Stop Infinite Scroll" : "Start Infinite Scroll"}
        </button>
      </div>

      {/* WebSocket Auto-Generation Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={toggleWsAuto}
          style={{
            padding: '8px 16px',
            backgroundColor: wsAuto ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          {wsAuto ? "Stop WebSocket Auto-Generation" : "Start WebSocket Auto-Generation"}
        </button>
      </div>

      {/* Local Auto-Generation Controls */}
      <div style={{ marginBottom: '1rem' }}>
        {generating ? (
          <button 
            onClick={stopGeneration}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Stop Local Generation
          </button>
        ) : (
          <button 
            onClick={startGeneration}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Generate Models Locally
          </button>
        )}
        {generating && (
          <span style={{ marginLeft: '1rem', color: '#666' }}>
            Generated: {genCount} / 100
          </span>
        )}
      </div>

      {/* Filtering Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Filter By:</label>
        <select
          value={filterField}
          onChange={(e) => { setFilterField(e.target.value); setSearchTerm(''); setPage(1); }}
        >
          <option value="all">All Fields</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="type">Type</option>
          <option value="datasetUsed">Dataset</option>
          <option value="accuracy">Accuracy</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          placeholder="Type your search..."
        />
      </div>

      {/* Models Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#2b2b2b', color: '#fff' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Model Name</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Status</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Type</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Dataset</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Accuracy</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Training Date</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Price</th>
            <th style={{ padding: '0.5rem', border: '1px solid #444' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredModels.map((model, index) => (
            <tr 
              key={model.id} 
              style={{ background: '#1a1a1a' }}
              ref={index === filteredModels.length - 1 ? lastModelElementRef : null}
            >
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.name}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.status}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.type}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.datasetUsed}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.accuracy}%</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>{model.trainingDate}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #444', backgroundColor: getBucketColor(model.price) }}>
                ${model.price}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #444' }}>
                <Link href={`/models/${model.id}/edit`} style={{ marginRight: '0.5rem' }}>Edit</Link>
                <Link href={`/models/${model.id}`} style={{ color: '#f44336' }}>Delete</Link>
              </td>
            </tr>
          ))}
          {filteredModels.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                No models found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Loading indicator */}
      {isLoadingMore && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          Loading more models...
        </div>
      )}

      {/* Integrated Dynamic Charts */}
      <div style={{ marginTop: '2rem' }}>
        <DashboardCharts models={filteredModels} />
      </div>
    </Layout>
  );
}
