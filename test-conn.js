require('dotenv').config({ path: '.env.local' });
const connectDB = require('./src/lib/db').default || require('./src/lib/db');

(async () => {
    try {
        await connectDB();
        console.log('✅ Connection succeeded');
    } catch (e) {
        console.error('❌ Connection failed', e);
    }
})();
