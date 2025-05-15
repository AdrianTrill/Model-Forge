// Utility to filter models based on a chosen field and search term.
export function filterModels(models, filterField, searchTerm) {
  return models.filter(model => {
    if (filterField === 'all') {
      const combined =
        model.name.toLowerCase() +
        model.status.toLowerCase() +
        model.type.toLowerCase() +
        model.datasetUsed.toLowerCase() +
        String(model.accuracy) +
        String(model.price);
      return combined.includes(searchTerm.toLowerCase());
    } else {
      const value = String(model[filterField]).toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    }
  });
}
