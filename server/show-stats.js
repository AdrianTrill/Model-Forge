let fetchFn;
try {
  fetchFn = fetch;
} catch (e) {
  fetchFn = require('node-fetch');
}

const BASE_URL = 'http://localhost:3001/api/stats';

async function fetchStats(endpoint) {
  const res = await fetchFn(`${BASE_URL}/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function printUserActivity(stats) {
  console.log('=== Top 10 User Activity Statistics ===');
  stats.forEach((user, i) => {
    console.log(`\n#${i + 1} ${user.username} (ID: ${user.id})`);
    console.log(`  Posts: ${user.postCount}`);
    console.log(`  Last Post: ${user.lastPostDate}`);
    console.log(`  Avg. Post Length: ${user.avgPostLength ? Number(user.avgPostLength).toFixed(2) : 'N/A'}`);
    console.log(`  Active Days: ${user.activeDays}`);
    console.log(`  Posts Last 7 Days: ${user.postsLastWeek}`);
  });
}

function printPostTrends(stats) {
  console.log('\n=== Post Trends (Last 30 Days) ===');
  stats.forEach(day => {
    console.log(`\nDate: ${day.date}`);
    console.log(`  Posts: ${day.postCount}`);
    console.log(`  Avg. Post Length: ${day.avgPostLength ? Number(day.avgPostLength).toFixed(2) : 'N/A'}`);
    console.log(`  Unique Users: ${day.uniqueUsers}`);
  });
}

(async () => {
  try {
    const [userActivity, postTrends] = await Promise.all([
      fetchStats('user-activity'),
      fetchStats('post-trends')
    ]);
    printUserActivity(userActivity);
    printPostTrends(postTrends);
  } catch (err) {
    console.error('Error fetching statistics:', err.message);
  }
})(); 