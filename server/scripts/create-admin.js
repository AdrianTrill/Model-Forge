const { User, sequelize } = require('../models');

async function createAdminUser() {
  try {
    // Sync database first
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('\nYou can now log in with these credentials to access the admin interface.');

    // Verify the user was created
    const verifyUser = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (verifyUser) {
      console.log('\nVerification successful:');
      console.log('User found in database');
      console.log('Password hash:', verifyUser.password);
    } else {
      console.log('\nVerification failed: User not found in database');
    }

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Admin user already exists.');
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the script
createAdminUser(); 