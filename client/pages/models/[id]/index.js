import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import offlineManager from '../../../utils/offlineManager';
import { useOfflineStatus } from '../../../utils/offlineManager';

export default function DeleteModelPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isOnline, isServerAvailable } = useOfflineStatus();
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadModel = async () => {
      try {
        if (!isOnline || !isServerAvailable) {
          // Try to load from cache
          const cachedModels = localStorage.getItem('cached_models');
          if (cachedModels) {
            const models = JSON.parse(cachedModels);
            const model = models.find(m => m.id === Number(id));
            if (model) {
              setModel(model);
              setIsLoading(false);
              return;
            }
          }
          throw new Error('Model not found in cache');
        }

        const response = await fetch(`http://localhost:3001/api/models/${id}`);
        if (!response.ok) throw new Error('Failed to fetch model');
        const data = await response.json();
        setModel(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load model. Please try again.');
        router.push('/models');
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [id, isOnline, isServerAvailable, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!isOnline || !isServerAvailable) {
        // Handle offline deletion
        offlineManager.addPendingOperation({
          type: 'DELETE',
          endpoint: `/api/models/${id}`,
          data: { id: Number(id) }
        });
        router.push('/models');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/models/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete model');
      }

      router.push('/models');
    } catch (error) {
      console.error(error);
      alert('Failed to delete model. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Delete Model">
        <div className="form-container">
          <p>Loading model info...</p>
        </div>
      </Layout>
    );
  }

  if (!model) {
    return (
      <Layout title="Delete Model">
        <div className="form-container">
          <p>Model not found.</p>
          <button onClick={() => router.push('/models')}>Back to Models</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Delete Model">
      <div className="form-container">
        <h1>Are you sure you want to delete this model?</h1>
        {(!isOnline || !isServerAvailable) && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '1rem', 
            backgroundColor: '#f44336', 
            color: 'white',
            borderRadius: '4px'
          }}>
            You are currently offline. The model will be deleted when you're back online.
          </div>
        )}
        <div style={{ background: '#600', padding: '1rem', borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem' }}>
          <p><strong>Name:</strong> {model.name}</p>
          <p><strong>Status:</strong> {model.status}</p>
          <p><strong>Type:</strong> {model.type}</p>
          <p><strong>Dataset:</strong> {model.datasetUsed}</p>
          <p><strong>Accuracy:</strong> {model.accuracy}%</p>
          <p><strong>Price:</strong> ${model.price}</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={handleDelete} 
            style={{ marginRight: '1rem' }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </button>
          <button onClick={() => router.push('/models')}>Cancel</button>
        </div>
      </div>
    </Layout>
  );
}
