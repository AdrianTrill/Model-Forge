import { useState, useEffect, useCallback } from 'react';
import offlineManager from './offlineManager';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export function useInfiniteScroll(fetchItems, pageSize = 10) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're offline
      if (isBrowser && (!offlineManager.isOnline || !offlineManager.isServerAvailable)) {
        // Load from localStorage if available
        const cachedItems = localStorage.getItem(`cached_items_page_${pageNum}`);
        if (cachedItems) {
          const parsedItems = JSON.parse(cachedItems);
          setItems(prev => [...prev, ...parsedItems]);
          setHasMore(parsedItems.length === pageSize);
          return;
        }
      }

      const newItems = await fetchItems(pageNum, pageSize);
      
      // Cache the results
      if (isBrowser) {
        localStorage.setItem(`cached_items_page_${pageNum}`, JSON.stringify(newItems));
      }
      
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchItems, pageSize]);

  // Initial load
  useEffect(() => {
    loadItems(1);
  }, [loadItems]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isBrowser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
          loadItems(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, page, loadItems]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore: () => {
      if (!loading && hasMore) {
        setPage(prev => prev + 1);
        loadItems(page + 1);
      }
    }
  };
}

// Helper function to create a scroll sentinel element
export function ScrollSentinel() {
  return (
    <div
      id="scroll-sentinel"
      style={{
        height: '20px',
        width: '100%',
        margin: '10px 0'
      }}
    />
  );
} 