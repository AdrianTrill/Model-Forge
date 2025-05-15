import { useEffect, useState, useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCharts({ models }) {
  const [avgHistory, setAvgHistory] = useState([]);

  // Compute Bar Chart data using useMemo so it updates when models change.
  const barData = useMemo(() => ({
    labels: models.map(model => model.name),
    datasets: [
      {
        label: 'Price ($)',
        data: models.map(model => model.price),
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
      },
    ],
  }), [models]);

  // Compute Pie Chart data.
  const pieData = useMemo(() => {
    const statusCounts = models.reduce((acc, model) => {
      acc[model.status] = (acc[model.status] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ['#ff8a80', '#80d8ff', '#ccff90'],
        },
      ],
    };
  }, [models]);

  // Use an async function to update average history every 2 seconds.
  useEffect(() => {
    let isMounted = true; // To avoid setting state after unmount

    async function updateAvgHistory() {
      while (isMounted) {
        // Wait for 2 seconds.
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (models.length > 0) {
          const avg = models.reduce((sum, m) => sum + m.price, 0) / models.length;
          // Append new average value
          setAvgHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), avg }]);
        }
      }
    }
    updateAvgHistory();

    return () => {
      isMounted = false;
    };
  }, [models]);

  // Compute Line Chart data from avgHistory.
  const lineData = useMemo(() => ({
    labels: avgHistory.map(entry => entry.time),
    datasets: [
      {
        label: 'Average Price ($)',
        data: avgHistory.map(entry => entry.avg),
        fill: false,
        borderColor: '#42a5f5',
      },
    ],
  }), [avgHistory]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Dashboard Charts</h2>
      <div style={{ marginBottom: '2rem', height: '200px' }}>
        <Bar data={barData} />
      </div>
      <div style={{ marginBottom: '2rem', height: '200px' }}>
        <Pie data={pieData} />
      </div>
      <div style={{ marginBottom: '2rem', height: '200px' }}>
        <Line data={lineData} />
      </div>
    </div>
  );
}
