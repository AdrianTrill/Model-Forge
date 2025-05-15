const { faker } = require('@faker-js/faker');
const { User, Post, sequelize } = require('../models');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Force sync database to create tables
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create users
    console.log('Creating users...');
    const users = await User.bulkCreate(
      Array.from({ length: 100 }, () => ({
        username: faker.internet.userName() + '_' + faker.string.alphanumeric(5),
        email: faker.internet.email(),
        createdAt: faker.date.between({ from: '2023-05-01', to: '2025-05-08' }),
        updatedAt: faker.date.between({ from: '2025-05-07', to: '2025-05-08' })
      }))
    );

    // Create posts for each user
    console.log('Creating posts...');
    const posts = [];
    for (const user of users) {
      const userPosts = Array.from({ length: 5 }, () => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        userId: user.id,
        createdAt: faker.date.between({ from: '2023-05-01', to: '2025-05-08' }),
        updatedAt: faker.date.between({ from: '2025-05-07', to: '2025-05-08' })
      }));
      posts.push(...userPosts);
    }
    await Post.bulkCreate(posts);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seedDatabase().then(() => {
  console.log('Database seeding process completed');
  process.exit(0);
}).catch(error => {
  console.error('Failed to seed database:', error);
  process.exit(1);
}); 