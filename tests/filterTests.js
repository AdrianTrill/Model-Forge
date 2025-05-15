const { filterModels } = require('../client/utils/filterModels');
const assert = require('assert');

describe('filterModels Utility', () => {
  const models = [
    {
      name: "Model A",
      status: "Training",
      type: "CNN",
      datasetUsed: "Dataset 1",
      accuracy: 90
    },
    {
      name: "Model B",
      status: "Completed",
      type: "RNN",
      datasetUsed: "Dataset 2",
      accuracy: 80
    },
    {
      name: "Super Model",
      status: "Training",
      type: "Transformer",
      datasetUsed: "Dataset 3",
      accuracy: 95
    }
  ];

  it('should return all models when search term is empty and filterField is "all"', () => {
    const result = filterModels(models, 'all', '');
    assert.strictEqual(result.length, models.length);
  });

  it('should filter models by name when filterField is "name"', () => {
    const result = filterModels(models, 'name', 'model a');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, "Model A");
  });

  it('should filter models by status when filterField is "status"', () => {
    const result = filterModels(models, 'status', 'training');
    // Two models have status "Training"
    assert.strictEqual(result.length, 2);
  });

  it('should filter by combined fields when filterField is "all"', () => {
    // Searching for "transformer" should return the one with type "Transformer"
    const result = filterModels(models, 'all', 'transformer');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, "Super Model");
  });

  it('should be case-insensitive', () => {
    const result = filterModels(models, 'name', 'MODEL b');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, "Model B");
  });
});
