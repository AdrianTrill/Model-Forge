const { sequelize } = require('../models');
const { User, ActivityLog, MonitoredUser } = require('../models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Force sync all models
    console.log('Dropping and recreating all tables...');
    await sequelize.sync({ force: true });
    console.log('All tables created successfully');

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created:', admin.username);

    // Create a test user
    console.log('Creating test user...');
    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = await User.create({
      username: 'test_user',
      email: 'test@example.com',
      password: testPassword,
      role: 'user'
    });
    console.log('Test user created:', testUser.username);

    // Create a suspicious user
    console.log('Creating suspicious user...');
    const suspiciousPassword = await bcrypt.hash('password123', 10);
    const suspiciousUser = await User.create({
      username: 'suspicious_user',
      email: 'suspicious@test.com',
      password: suspiciousPassword,
      role: 'user'
    });
    console.log('Suspicious user created:', suspiciousUser.username);

    // Verify tables exist
    console.log('\nVerifying tables...');
    const tables = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Existing tables:', tables[0].map(t => t.name));

    console.log('\nDatabase initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw to ensure the process exits with an error
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase().catch(console.error); 