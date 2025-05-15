import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import offlineManager from '../../utils/offlineManager';
import { useOfflineStatus } from '../../utils/offlineManager';

export default function CreateModelPage() {
  const router = useRouter();
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

  // Validation function with prompts
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
      newErrors.trainingDate = 'Training Date is required. Enter the date in DD/MM/YYYY format.';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.trainingDate)) {
      newErrors.trainingDate = 'Invalid date format. Please use DD/MM/YYYY.';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      accuracy: Number(formData.accuracy),
      price: Number(formData.price)
    };

    if (!isOnline || !isServerAvailable) {
      // Handle offline creation
      offlineManager.addPendingOperation({
        type: 'POST',
        endpoint: '/api/models',
        data: modelData
      });
      router.push('/models');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/models', {
        method: 'POST',
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
      setErrors({ api: 'Failed to create model. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Add New Model">
      <div className="form-container">
        <h1>Add New Model</h1>
        {(!isOnline || !isServerAvailable) && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '1rem', 
            backgroundColor: '#f44336', 
            color: 'white',
            borderRadius: '4px'
          }}>
            You are currently offline. The model will be created when you're back online.
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

          <label>Training Date (DD/MM/YYYY):</label>
          <input type="text" name="trainingDate" value={formData.trainingDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter the training date in DD/MM/YYYY format.</small>
          {errors.trainingDate && <span style={{ color: 'red' }}>{errors.trainingDate}</span>}

          <label>Accuracy (%):</label>
          <input type="number" name="accuracy" value={formData.accuracy} onChange={handleChange} placeholder="0-100" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter a number between 0 and 100 representing the accuracy.</small>
          {errors.accuracy && <span style={{ color: 'red' }}>{errors.accuracy}</span>}

          <label>Price ($):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price in dollars" />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Enter the model's price as a positive number.</small>
          {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

          <button 
            type="submit" 
            style={{ marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Add model'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
