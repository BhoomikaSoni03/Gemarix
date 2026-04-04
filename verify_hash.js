const bcrypt = require('bcryptjs');

const password = 'Gemarix@AdminSecure2026!';
const hash = '$2b$12$.RhR2EXD46.Vv7p9ubmqM.mk.XKWLs3NDwgJfyhmPpHlCTgsKhkY6';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
}).catch(err => {
    console.error('Error:', err);
});
