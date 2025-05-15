// In-memory data store for models (no persistent storage)
let models = [
  {
    id: 1,
    name: "GPT-3 Fine-Tune",
    status: "Training",
    type: "Transformer",
    datasetUsed: "Custom Dataset",
    trainingDate: "03/01/2025",
    accuracy: 78,
    price: 3000
  },
  {
    id: 2,
    name: "Llama-2 Chatbot",
    status: "Completed",
    type: "Transformer",
    datasetUsed: "Open Assistant",
    trainingDate: "03/09/2025",
    accuracy: 92,
    price: 2000
  },
  {
    id: 3,
    name: "V1 Image Classifier",
    status: "Completed",
    type: "CNN",
    datasetUsed: "CIFAR-100",
    trainingDate: "28/02/2025",
    accuracy: 85,
    price: 1000
  },
  {
    id: 4,
    name: "Alpha Model",
    status: "Training",
    type: "Transformer",
    datasetUsed: "Dataset Alpha",
    trainingDate: "01/04/2025",
    accuracy: 80,
    price: 5000
  },
  {
    id: 5,
    name: "Beta Model",
    status: "Training",
    type: "RNN",
    datasetUsed: "Dataset Beta",
    trainingDate: "05/04/2025",
    accuracy: 82,
    price: 2500
  },
  {
    id: 6,
    name: "Gamma Model",
    status: "Completed",
    type: "CNN",
    datasetUsed: "Dataset Gamma",
    trainingDate: "10/04/2025",
    accuracy: 88,
    price: 1500
  },
  {
    id: 7,
    name: "Delta Model",
    status: "Training",
    type: "Transformer",
    datasetUsed: "Dataset Delta",
    trainingDate: "15/04/2025",
    accuracy: 90,
    price: 2167
  },
  {
    id: 8,
    name: "Epsilon Model",
    status: "Completed",
    type: "RNN",
    datasetUsed: "Dataset Epsilon",
    trainingDate: "20/04/2025",
    accuracy: 87,
    price: 1800
  },
  {
    id: 9,
    name: "Zeta Model",
    status: "Training",
    type: "CNN",
    datasetUsed: "Dataset Zeta",
    trainingDate: "25/04/2025",
    accuracy: 83,
    price: 500
  },
  {
    id: 10,
    name: "Eta Model",
    status: "Completed",
    type: "Transformer",
    datasetUsed: "Dataset Eta",
    trainingDate: "30/04/2025",
    accuracy: 89,
    price: 2200
  }
];

// Validation function for models.
// For POST (full creation) and PATCH/PUT (partial update), use isPartial if data might be incomplete.
function validateModel(data, isPartial = false) {
  const errors = [];
  if (!isPartial || data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push("Name is required.");
    }
  }
  if (!isPartial || data.status !== undefined) {
    const validStatuses = ["Training", "Completed", "Deprecated"];
    if (!validStatuses.includes(data.status)) {
      errors.push("Status must be one of: " + validStatuses.join(", "));
    }
  }
  if (!isPartial || data.type !== undefined) {
    const validTypes = ["CNN", "RNN", "Transformer"];
    if (!validTypes.includes(data.type)) {
      errors.push("Type must be one of: " + validTypes.join(", "));
    }
  }
  if (!isPartial || data.datasetUsed !== undefined) {
    const validDatasets = ["CIFAR-100", "Open Assistant", "Custom Dataset"];
    if (!validDatasets.includes(data.datasetUsed)) {
      errors.push("DatasetUsed must be one of: " + validDatasets.join(", "));
    }
  }
  if (!isPartial || data.trainingDate !== undefined) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.trainingDate)) {
      errors.push("TrainingDate must be in the format dd/mm/yyyy.");
    }
  }
  if (!isPartial || data.accuracy !== undefined) {
    const accuracy = Number(data.accuracy);
    if (isNaN(accuracy) || accuracy < 0 || accuracy > 100) {
      errors.push("Accuracy must be a number between 0 and 100.");
    }
  }
  if (!isPartial || data.price !== undefined) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      errors.push("Price must be a positive number.");
    }
  }
  return errors;
}

// GET all models (with optional filtering and sorting via query parameters)
exports.getAllModels = (req, res) => {
  let result = models;
  const { filterField, filterValue, sortField, order } = req.query;
  if (filterField && filterValue) {
    result = result.filter(model =>
      String(model[filterField]).toLowerCase().includes(filterValue.toLowerCase())
    );
  }
  if (sortField) {
    const sortOrder = order === 'desc' ? -1 : 1;
    result = result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }
  res.json(result);
};

// GET a model by ID.
exports.getModelById = (req, res) => {
  const id = Number(req.params.id);
  const model = models.find(m => m.id === id);
  if (!model) {
    return res.status(404).json({ error: "Model not found." });
  }
  res.json(model);
};

// POST: Create a new model.
exports.createModel = (req, res) => {
  const data = req.body;
  const errors = validateModel(data);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const newId = models.length > 0 ? Math.max(...models.map(m => m.id)) + 1 : 1;
  const newModel = {
    id: newId,
    name: data.name,
    status: data.status,
    type: data.type,
    datasetUsed: data.datasetUsed,
    trainingDate: data.trainingDate,
    accuracy: Number(data.accuracy),
    price: Number(data.price)
  };
  models.push(newModel);
  res.status(201).json(newModel);
};

// PATCH/PUT: Partially update an existing model.
exports.updateModel = (req, res) => {
  const id = Number(req.params.id);
  const index = models.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Model not found." });
  }
  const data = req.body;
  const errors = validateModel(data, true);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  models[index] = { ...models[index], ...data };
  models[index].accuracy = Number(models[index].accuracy);
  models[index].price = Number(models[index].price);
  res.json(models[index]);
};

// DELETE: Remove a model.
exports.deleteModel = (req, res) => {
  const id = Number(req.params.id);
  const index = models.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Model not found." });
  }
  const deleted = models.splice(index, 1);
  res.json(deleted[0]);
};

// Helper for real-time update thread: add a model directly.
exports.__addModel = (model) => {
  models.push(model);
};

// Expose in-memory store.
exports.getStore = () => models;
