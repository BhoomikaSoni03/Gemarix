const cloudinary = require('cloudinary').v2;
require('dotenv').config();

async function verifyCloudinary() {
    console.log('--- Cloudinary Configuration Check ---');
    
    // Explicitly load .env.local if needed
    const fs = require('fs');
    if (fs.existsSync('.env.local')) {
        const envConfig = require('dotenv').parse(fs.readFileSync('.env.local'));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }

    const url = process.env.CLOUDINARY_URL;
    const name = process.env.CLOUDINARY_CLOUD_NAME;
    
    if (url) {
        console.log('✅ CLOUDINARY_URL found.');
    } else if (name) {
        console.log('✅ Individual Cloudinary keys found.');
    } else {
        console.log('❌ No Cloudinary configuration found in .env.local');
        process.exit(1);
    }

    try {
        // Try a simple API call to check connectivity
        if (url) {
            cloudinary.config({ cloudinary_url: url });
        } else {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }

        console.log('Testing connection...');
        const result = await cloudinary.api.ping();
        console.log('🚀 Connection Successful:', result);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    }
}

verifyCloudinary();
