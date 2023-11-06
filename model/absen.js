const mongoose = require('mongoose');
const Absen = mongoose.model('Absen', {
    nama_lengkap: {
        type: String,
        required: true
    },
    jabatan: {
        type: String,
        required: true
    },
    hari_tanggal: {
        type: String,
        required: true
    },
    jam_absen: {
        type: String
    },
    hasil_kerja: {
        type: String,
        required: true
    },
    foto_absen: {
        type: String,
        required: true
    }
});

module.exports = Absen;