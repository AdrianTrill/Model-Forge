const { faker } = require('@faker-js/faker');
const { User, Post } = require('./models');
const sequelize = require('./config/database');
const bcrypt = require('bcrypt');

async function populateDatabase() {
  try {
    console.log('Starting database population...');
    await sequelize.sync({ force: true });
    
    // Create users in batches of 1000
    const batchSize = 1000;
    const totalUsers = 100000;
    const totalPosts = 200000;
    
    console.log('Creating users...');
    for (let i = 0; i < totalUsers; i += batchSize) {
      const users = [];
      for (let j = 0; j < batchSize && i + j < totalUsers; j++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        users.push({
          username: `${faker.internet.userName()}_${Date.now()}_${i + j}`,
          email: `user${i + j}_${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'user',
          createdAt: faker.date.past()
        });
      }
      await User.bulkCreate(users);
      console.log(`Created ${Math.min(i + batchSize, totalUsers)} users...`);
    }
    console.log('Users created successfully!');
    
    // Create posts in batches of 1000
    console.log('Creating posts...');
    for (let i = 0; i < totalPosts; i += batchSize) {
      const posts = [];
      for (let j = 0; j < batchSize && i + j < totalPosts; j++) {
        posts.push({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          userId: Math.floor(Math.random() * totalUsers) + 1,
          createdAt: faker.date.past()
        });
      }
      await Post.bulkCreate(posts);
      console.log(`Created ${Math.min(i + batchSize, totalPosts)} posts...`);
    }
    console.log('Posts created successfully!');
    
    // Add indices for optimization
    console.log('Adding indices...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_user_id ON Posts(userId);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON Posts(createdAt);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON Users(createdAt);
    `);
    
    console.log('Database population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase(); 