const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    banner: [{
        banner_Title: String,
        banner_Link: String
    }],
    card: [{
        card_Title: String,
        card_Icon: String,
        card_Link: String
    }],
    kontak: [{
        kontak_Title: String,
        kontak_Icon: String
    }]
});

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;