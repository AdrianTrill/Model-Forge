const sequelize = require('./config/database');
const { User, Post } = require('./models');

async function optimizeDatabase() {
    console.log('Starting database optimization...');

    try {
        // Sync database to ensure tables exist
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');

        // Add indices for user activity statistics
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_posts_user_id ON Posts(userId);
            CREATE INDEX IF NOT EXISTS idx_posts_created_at ON Posts(createdAt);
        `);

        console.log('Database indices created successfully');

        // Optimize SQLite settings
        console.log('Optimizing SQLite settings...');
        await sequelize.query(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA cache_size = -2000;
            PRAGMA temp_store = MEMORY;
            PRAGMA mmap_size = 30000000000;
        `);

        // Create view for user activity statistics
        console.log('Creating view for user activity...');
        await sequelize.query(`
            CREATE VIEW IF NOT EXISTS user_activity_stats AS
            SELECT 
                u.id as userId,
                u.username,
                COUNT(p.id) as postCount,
                MAX(p.createdAt) as lastPostDate,
                AVG(LENGTH(p.content)) as avgPostLength
            FROM Users u
            LEFT JOIN Posts p ON u.id = p.userId
            GROUP BY u.id;
        `);

        console.log('Database optimization completed successfully!');
    } catch (error) {
        console.error('Error optimizing database:', error);
    } finally {
        await sequelize.close();
    }
}

// Run optimization
optimizeDatabase().catch(console.error); 