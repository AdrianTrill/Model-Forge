const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const modelRoutes = require('../server/routes/modelRoutes');

const app = express();
app.use(express.json());
app.use('/api/models', modelRoutes);

describe('Model API', () => {
  let createdModelId;

  // 1. Test GET all models without query parameters.
  it('should get all models (default)', async () => {
    const res = await request(app).get('/api/models');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // 2. Test GET with filtering query parameters (covering lines ~110-116).
  it('should filter models by a given field and value', async () => {
    // Create two models with distinctive names.
    const modelA = {
      name: "FilterTest A",
      status: "Training",
      type: "CNN",
      datasetUsed: "CIFAR-100",
      trainingDate: "01/05/2025",
      accuracy: 70,
      price: 1000
    };
    const modelB = {
      name: "FilterTest B",
      status: "Completed",
      type: "RNN",
      datasetUsed: "Open Assistant",
      trainingDate: "02/05/2025",
      accuracy: 80,
      price: 2000
    };
    await request(app).post('/api/models').send(modelA);
    await request(app).post('/api/models').send(modelB);
    
    const res = await request(app)
      .get('/api/models')
      .query({ filterField: 'name', filterValue: 'FilterTest A' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(model => {
      expect(model.name).to.include("FilterTest A");
    });
  });

  // 3. Test GET with sorting query parameters (covering lines ~122-128).
  it('should sort models by price in descending order', async () => {
    const res = await request(app)
      .get('/api/models')
      .query({ sortField: 'price', order: 'desc' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i - 1].price).to.be.at.least(res.body[i].price);
    }
  });

  it('should sort models by price in ascending order', async () => {
    const res = await request(app)
      .get('/api/models')
      .query({ sortField: 'price', order: 'asc' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i - 1].price).to.be.at.most(res.body[i].price);
    }
  });

  // 4. Test GET a model by valid ID.
  it('should get a model by valid ID', async () => {
    const newModel = {
      name: "Test Model For GET",
      status: "Training",
      type: "CNN",
      datasetUsed: "CIFAR-100",
      trainingDate: "01/05/2025",
      accuracy: 75,
      price: 1500
    };
    const createRes = await request(app).post('/api/models').send(newModel);
    expect(createRes.statusCode).to.equal(201);
    const id = createRes.body.id;
    const res = await request(app).get(`/api/models/${id}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.id).to.equal(id);
  });

  // 5. Test GET a model with a non-existent ID.
  it('should return 404 for non-existent model on GET', async () => {
    const res = await request(app).get('/api/models/999999');
    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.equal("Model not found.");
  });

  // 6. Test POST: create a new model with valid data.
  it('should create a new model with valid data', async () => {
    const newModel = {
      name: "New Valid Model",
      status: "Training",
      type: "Transformer",
      datasetUsed: "Custom Dataset",
      trainingDate: "05/05/2025",
      accuracy: 80,
      price: 2500
    };
    const res = await request(app).post('/api/models').send(newModel);
    expect(res.statusCode).to.equal(201);
    expect(res.body.name).to.equal("New Valid Model");
    createdModelId = res.body.id;
  });

  // 7. Test POST: create a new model with missing name (to increase coverage for validation branches).
  it('should fail to create a new model with missing name', async () => {
    const newModel = {
      name: "",
      status: "Training",
      type: "Transformer",
      datasetUsed: "Custom Dataset",
      trainingDate: "05/05/2025",
      accuracy: 80,
      price: 2500
    };
    const res = await request(app).post('/api/models').send(newModel);
    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.include("Name is required.");
  });

  // 8. Test POST: fail to create a model with invalid date format.
  it('should fail to create a model with invalid date format', async () => {
    const newModel = {
      name: "Invalid Date Model",
      status: "Training",
      type: "Transformer",
      datasetUsed: "Custom Dataset",
      trainingDate: "2025-05-05", // wrong format
      accuracy: 80,
      price: 2500
    };
    const res = await request(app).post('/api/models').send(newModel);
    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.include("TrainingDate must be in the format dd/mm/yyyy.");
  });

  // 9. Test PATCH: partially update an existing model.
  it('should update a model partially via PATCH', async () => {
    const updateData = { accuracy: 85 };
    const res = await request(app).patch(`/api/models/${createdModelId}`).send(updateData);
    expect(res.statusCode).to.equal(200);
    expect(res.body.accuracy).to.equal(85);
  });

  // 10. Test PATCH: update a model with invalid data.
  it('should fail to update a model with invalid accuracy via PATCH', async () => {
    const updateData = { accuracy: 150 }; // out of range
    const res = await request(app).patch(`/api/models/${createdModelId}`).send(updateData);
    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.include("Accuracy must be a number between 0 and 100.");
  });

  // 11. Test PATCH: updating a non-existent model (branch for line 215).
  it('should return 404 when updating a non-existent model via PATCH', async () => {
    const res = await request(app).patch('/api/models/999999').send({ accuracy: 50 });
    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.equal("Model not found.");
  });

  // 12. Test PUT: update a model completely.
  it('should update a model completely via PUT', async () => {
    const updateData = {
      name: "Updated Model",
      status: "Completed",
      type: "CNN",
      datasetUsed: "CIFAR-100",
      trainingDate: "06/05/2025",
      accuracy: 90,
      price: 3000
    };
    const res = await request(app).put(`/api/models/${createdModelId}`).send(updateData);
    expect(res.statusCode).to.equal(200);
    expect(res.body.name).to.equal("Updated Model");
    expect(res.body.status).to.equal("Completed");
  });

  // 13. Test DELETE: delete an existing model.
  it('should delete a model', async () => {
    const res = await request(app).delete(`/api/models/${createdModelId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.id).to.equal(createdModelId);
  });

  // 14. Test DELETE: deleting a non-existent model.
  it('should return 404 when deleting a non-existent model', async () => {
    const res = await request(app).delete('/api/models/999999');
    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.equal("Model not found.");
  });
});
