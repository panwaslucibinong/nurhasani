const mongoose = require('mongoose');
const Berita = mongoose.model('Berita', {
    thumbnail: {
        type: String,
        required: true
    },
    waktu: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String
    }
});

module.exports = Berita;