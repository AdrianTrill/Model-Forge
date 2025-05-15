import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import offlineManager from '../../../utils/offlineManager';
import { useOfflineStatus } from '../../../utils/offlineManager';

export default function EditModelPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isOnline, isServerAvailable } = useOfflineStatus();
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'Training',
    type: 'CNN',
    datasetUsed: 'CIFAR-100',
    trainingDate: '',
    accuracy: '',
    price: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const validate = (data) => {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = 'Model Name is required. Please enter a descriptive name.';
    }
    if (!data.status) {
      newErrors.status = 'Model Status is required. Please select a status.';
    }
    if (!data.type) {
      newErrors.type = 'Model Type is required. Please choose a type (e.g., CNN, RNN, Transformer).';
    }
    if (!data.datasetUsed) {
      newErrors.datasetUsed = 'Dataset is required. Please select the dataset used.';
    }
    if (!data.trainingDate.trim()) {
      newErrors.trainingDate = 'Training Date is required. Enter the date in dd/mm/yyyy format.';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.trainingDate)) {
      newErrors.trainingDate = 'TrainingDate must be in the format dd/mm/yyyy.';
    }
    if (data.accuracy === '') {
      newErrors.accuracy = 'Accuracy is required. Enter a value between 0 and 100.';
    } else {
      const numAccuracy = parseInt(data.accuracy, 10);
      if (isNaN(numAccuracy) || numAccuracy < 0 || numAccuracy > 100) {
        newErrors.accuracy = 'Accuracy must be a number between 0 and 100.';
      }
    }
    if (data.price === '') {
      newErrors.price = 'Price is required. Enter a positive number.';
    } else {
      const numPrice = parseFloat(data.price);
      if (isNaN(numPrice) || numPrice < 0) {
        newErrors.price = 'Price must be a positive number.';
      }
    }
    return newErrors;
  };
  
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
              setFormData(model);
              setIsLoading(false);
              return;
            }
          }
          throw new Error('Model not found in cache');
        }

        const response = await fetch(`http://localhost:3001/api/models/${id}`);
        if (!response.ok) throw new Error('Failed to fetch model');
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
        setErrors({ api: 'Failed to load model. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [id, isOnline, isServerAvailable]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const modelData = {
      ...formData,
      id: Number(id),
      accuracy: Number(formData.accuracy),
      price: Number(formData.price)
    };

    if (!isOnline || !isServerAvailable) {
      // Handle offline update
      offlineManager.addPendingOperation({
        type: 'PUT',
        endpoint: `/api/models/${id}`,
        data: modelData
      });
      router.push('/models');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/models/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ api: errorData.errors || errorData.error });
        return;
      }

      router.push('/models');
    } catch (error) {
      setErrors({ api: 'Failed to update model. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Edit Model">
        <div className="form-container">
          <p>Loading model info...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Edit Model">
      <div className="form-container">
        <h1>Edit Model</h1>
        {(!isOnline || !isServerAvailable) && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '1rem', 
            backgroundColor: '#f44336', 
            color: 'white',
            borderRadius: '4px'
          }}>
            You are currently offline. Changes will be saved when you're back online.
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
          <label>Model Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter a descriptive name for the model.</small>
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
          
          <label>Model Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Training">Training</option>
            <option value="Completed">Completed</option>
            <option value="Deprecated">Deprecated</option>
          </select>
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Select the current status of the model.</small>
          {errors.status && <span style={{ color: 'red' }}>{errors.status}</span>}
          
          <label>Model Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="CNN">CNN</option>
            <option value="RNN">RNN</option>
            <option value="Transformer">Transformer</option>
          </select>
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Choose the type of model (e.g., CNN, RNN, Transformer).</small>
          {errors.type && <span style={{ color: 'red' }}>{errors.type}</span>}
          
          <label>Dataset Used:</label>
          <select name="datasetUsed" value={formData.datasetUsed} onChange={handleChange}>
            <option value="CIFAR-100">CIFAR-100</option>
            <option value="Open Assistant">Open Assistant</option>
            <option value="Custom Dataset">Custom Dataset</option>
          </select>
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Select the dataset used to train the model.</small>
          {errors.datasetUsed && <span style={{ color: 'red' }}>{errors.datasetUsed}</span>}
          
          <label>Training Date (dd/mm/yyyy):</label>
          <input type="text" name="trainingDate" value={formData.trainingDate} onChange={handleChange} placeholder="dd/mm/yyyy" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter the training date in dd/mm/yyyy format.</small>
          {errors.trainingDate && <span style={{ color: 'red' }}>{errors.trainingDate}</span>}
          
          <label>Accuracy (%):</label>
          <input type="number" name="accuracy" value={formData.accuracy} onChange={handleChange} placeholder="0-100" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter a number between 0 and 100 representing the accuracy.</small>
          {errors.accuracy && <span style={{ color: 'red' }}>{errors.accuracy}</span>}
          
          <label>Price ($):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price in dollars" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter the model's price as a positive number.</small>
          {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

          {errors.api && <span style={{ color: 'red' }}>{errors.api}</span>}

          <button 
            type="submit" 
            style={{ marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
