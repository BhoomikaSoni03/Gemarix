require('dotenv').config({ path: '.env.local' });
if (process.env.ADMIN_USERNAME) {
    console.log('ADMIN_USERNAME:', JSON.stringify(process.env.ADMIN_USERNAME), 'Length:', process.env.ADMIN_USERNAME.length);
} else {
    console.log('ADMIN_USERNAME is undefined');
}
if (process.env.ADMIN_PASSWORD_HASH) {
    console.log('ADMIN_PASSWORD_HASH:', JSON.stringify(process.env.ADMIN_PASSWORD_HASH), 'Length:', process.env.ADMIN_PASSWORD_HASH.length);
} else {
    console.log('ADMIN_PASSWORD_HASH is undefined');
}
