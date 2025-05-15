const { faker } = require('@faker-js/faker');
const axios = require('axios');
const { performance } = require('perf_hooks');

const API_URL = 'http://localhost:3001/api';
const BATCH_SIZE = 100;
const TOTAL_USERS = 1000;
const POSTS_PER_USER = 2;

// Function to format numbers with commas and fixed decimals
function formatNumber(num, decimals = 2) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Function to format milliseconds into readable duration
function formatDuration(ms) {
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(2)}min`;
}

// Function to create a formatted table
function createTable(headers, rows) {
    // Calculate column widths
    const widths = headers.map((header, i) => 
        Math.max(
            header.length,
            ...rows.map(row => String(row[i]).length)
        )
    );

    // Create separator line
    const separator = '+-' + widths.map(w => '-'.repeat(w)).join('-+-') + '-+';

    // Create header
    const headerRow = '| ' + headers.map((h, i) => h.padEnd(widths[i])).join(' | ') + ' |';

    // Create data rows
    const dataRows = rows.map(row => 
        '| ' + row.map((cell, i) => String(cell).padEnd(widths[i])).join(' | ') + ' |'
    );

    return [
        separator,
        headerRow,
        separator,
        ...dataRows,
        separator
    ].join('\n');
}

// Function to display performance statistics
function displayStatistics(timings, userStats, overallStats) {
    console.log('\n=== PERFORMANCE ANALYSIS ===\n');

    // 1. Data Creation Statistics
    const creationStats = [
        ['Metric', 'Total', 'Average Time', 'Items/Second'],
        ['User Creation', 
         TOTAL_USERS, 
         formatDuration(timings.userCreation.total),
         formatNumber(TOTAL_USERS / (timings.userCreation.total / 1000))],
        ['Post Creation',
         TOTAL_USERS * POSTS_PER_USER,
         formatDuration(timings.postCreation.total),
         formatNumber((TOTAL_USERS * POSTS_PER_USER) / (timings.postCreation.total / 1000))]
    ];
    console.log('Data Creation Performance:');
    console.log(createTable(...zip(creationStats)));

    // 2. Query Performance
    const queryStats = [
        ['Query Type', 'Response Time', 'Items Processed', 'Items/Second'],
        ['Complex Query', 
         formatDuration(timings.complexQuery),
         100,
         formatNumber(100 / (timings.complexQuery / 1000))],
        ['Relationship Query',
         formatDuration(timings.relationshipQuery),
         1,
         formatNumber(1 / (timings.relationshipQuery / 1000))],
        ['Statistical Query',
         formatDuration(timings.statisticalQuery),
         TOTAL_USERS,
         formatNumber(TOTAL_USERS / (timings.statisticalQuery / 1000))],
        ['Concurrent Requests',
         formatDuration(timings.concurrentRequests),
         100,
         formatNumber(100 / (timings.concurrentRequests / 1000))]
    ];
    console.log('\nQuery Performance:');
    console.log(createTable(...zip(queryStats)));

    // 3. User Engagement Statistics
    if (userStats && userStats.length > 0) {
        const engagementStats = [
            ['Metric', 'Top User', 'Average', 'Total'],
            ['Posts', 
             formatNumber(userStats[0].totalPosts, 0),
             formatNumber(overallStats.averagePostsPerUser, 1),
             formatNumber(overallStats.totalPosts, 0)],
            ['Post Length',
             formatNumber(userStats[0].maxPostLength, 0),
             formatNumber(overallStats.averagePostLength, 0),
             'N/A'],
            ['Active Days',
             formatNumber(userStats[0].activeDays, 0),
             formatNumber(overallStats.totalActiveDays / overallStats.activeUsers, 1),
             formatNumber(overallStats.totalActiveDays, 0)],
            ['Long Posts',
             formatNumber(userStats[0].longPosts, 0),
             formatNumber(overallStats.totalLongPosts / overallStats.activeUsers, 1),
             formatNumber(overallStats.totalLongPosts, 0)],
            ['Engagement Score',
             formatNumber(userStats[0].engagementScore, 0),
             formatNumber(userStats.reduce((sum, u) => sum + u.engagementScore, 0) / userStats.length, 0),
             'N/A']
        ];
        console.log('\nUser Engagement Metrics:');
        console.log(createTable(...zip(engagementStats)));
    }

    // 4. System Performance Summary
    const performanceSummary = [
        ['Metric', 'Value', 'Unit'],
        ['Total Processing Time',
         formatNumber((timings.userCreation.total + timings.postCreation.total) / 1000, 2),
         'seconds'],
        ['Average Response Time',
         formatNumber((timings.complexQuery + timings.relationshipQuery + timings.statisticalQuery) / 3, 2),
         'milliseconds'],
        ['Database Operations',
         formatNumber(TOTAL_USERS + (TOTAL_USERS * POSTS_PER_USER), 0),
         'operations'],
        ['Peak Performance',
         formatNumber(Math.max(
             TOTAL_USERS / (timings.userCreation.total / 1000),
             (TOTAL_USERS * POSTS_PER_USER) / (timings.postCreation.total / 1000)
         ), 0),
         'ops/second']
    ];
    console.log('\nSystem Performance Summary:');
    console.log(createTable(...zip(performanceSummary)));
}

// Helper function to zip arrays
function zip(arrays) {
    return [arrays[0], arrays.slice(1)];
}

// Generate unique user data
function generateUser(index) {
    return {
        username: `user_${index}_${faker.internet.userName().replace(/[^a-zA-Z0-9]/g, '')}`,
        email: `user_${index}_${faker.internet.email()}`,
        bio: faker.lorem.paragraph(),
        location: faker.location.city(),
        createdAt: faker.date.past()
    };
}

// Generate realistic post data
function generatePost(userId) {
    return {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        userId: userId,
        createdAt: faker.date.past()
    };
}

// Batch processing function
async function processBatch(items, processFn) {
    const promises = items.map(item => processFn(item));
    return Promise.all(promises);
}

// Performance measurement wrapper
async function measurePerformance(name, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return { time: end - start, result };
}

// Main stress test function
async function runStressTest() {
    console.log('Starting stress test...');
    const timings = {
        userCreation: { total: 0, batches: [] },
        postCreation: { total: 0, batches: [] },
        complexQuery: 0,
        relationshipQuery: 0,
        statisticalQuery: 0,
        concurrentRequests: 0
    };
    
    // Create users in batches
    console.log(`Creating ${TOTAL_USERS} users...`);
    const userIds = [];
    
    for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
        const batchSize = Math.min(BATCH_SIZE, TOTAL_USERS - i);
        const users = Array(batchSize).fill().map((_, idx) => generateUser(i + idx));
        
        const { time, result } = await measurePerformance(`Creating batch of ${batchSize} users`, async () => {
            const results = await processBatch(users, async (user) => {
                const response = await axios.post(`${API_URL}/users`, user);
                return response.data.id;
            });
            userIds.push(...results);
            return results;
        });
        
        timings.userCreation.batches.push(time);
        timings.userCreation.total += time;
        console.log(`Created ${i + batchSize} users`);
    }
    
    // Create posts for each user
    console.log(`Creating ${POSTS_PER_USER} posts for each user...`);
    let totalPosts = 0;
    
    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
        const batchUserIds = userIds.slice(i, i + BATCH_SIZE);
        const posts = batchUserIds.flatMap(userId => 
            Array(POSTS_PER_USER).fill().map(() => generatePost(userId))
        );
        
        const { time } = await measurePerformance(`Creating batch of ${posts.length} posts`, async () => {
            await processBatch(posts, post => 
                axios.post(`${API_URL}/posts`, post)
            );
        });
        
        timings.postCreation.batches.push(time);
        timings.postCreation.total += time;
        totalPosts += posts.length;
        console.log(`Created ${totalPosts} posts`);
    }
    
    // Performance testing
    console.log('\nRunning performance tests...');
    
    // Test 1: Complex query with filtering and sorting
    const { time: complexQueryTime } = await measurePerformance('Complex query with filtering and sorting', async () => {
        const response = await axios.get(
            `${API_URL}/posts?search=${faker.lorem.word()}&sort=createdAt&order=DESC&limit=100`
        );
        return response.data;
    });
    timings.complexQuery = complexQueryTime;
    
    // Test 2: Relationship query
    const { time: relationshipQueryTime } = await measurePerformance('Relationship query', async () => {
        const response = await axios.get(
            `${API_URL}/users/${userIds[0]}?include=posts`
        );
        return response.data;
    });
    timings.relationshipQuery = relationshipQueryTime;
    
    // Test 3: Statistical query
    const { time: statisticalQueryTime, result: statsResult } = await measurePerformance('Statistical query', async () => {
        const response = await axios.get(
            `${API_URL}/stats/user-activity?timeRange=30d`
        );
        return response.data;
    });
    timings.statisticalQuery = statisticalQueryTime;
    
    // Test 4: Concurrent requests
    console.log('\nTesting concurrent requests...');
    const concurrentRequests = 100;
    const requests = Array(concurrentRequests).fill().map(() => 
        axios.get(`${API_URL}/users?limit=10`)
    );
    
    const { time: concurrentTime } = await measurePerformance(`${concurrentRequests} concurrent requests`, async () => {
        await Promise.all(requests);
    });
    timings.concurrentRequests = concurrentTime;
    
    // Display comprehensive statistics
    displayStatistics(timings, statsResult.userStats, statsResult.overallStats);
}

// Run the stress test
runStressTest().catch(console.error);