const mongoose = require('mongoose');
const Users = mongoose.model('Users', {
    nama_lengkap: {
        type: String,
        required: true
    },
    jabatan: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    hari_piket: {
        type: String
    }
});

module.exports = Users;