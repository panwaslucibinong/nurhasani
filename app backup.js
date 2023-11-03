const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { generateUniqueId, cekIp, ambilWaktuIndonesia } = require('./utils/absen')
const { newNoLhp, generateDocument } = require('./utils/lhp')
const fs = require('fs');

require('./utils/db')
const Absen = require('./model/absen')
const LaporanHasilPengawasan = require('./model/laporan_hasil_pengawasan')
const Users = require('./model/users')
const Home = require('./model/home')
const LhpConfig = require('./model/lhp_config')

const app = express();

//set EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req, res) => {
    const home_Data = await Home.findOne()
    res.render('home', {
        layout: 'layouts/main-layout',
        title: 'Home',
        home_Data,
    });
});

app.get('/register', async (req, res) => {
    try {
        const dataUserPws = await Users.find()
        const deviceId = generateUniqueId();
        res.cookie('deviceId', deviceId, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.render('register', {
            layout: 'layouts/main-layout',
            title: 'Register',
            dataUserPws,
            kodeAktivasi: `${deviceId}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan.');
    }
});

app.post('/register', async (req, res) => {
    try {
        const updateUser = req.body
        await Users.updateOne({ nama_lengkap: updateUser.aktivasi_user }, { deviceId: updateUser.kode_aktivasi })
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan.');
    }
});

//ABSEN
app.get('/absen/add', async (req, res) => {
    try {
        // const myIP = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // const ipStatus = await cekIp(myIP);
        const ipStatus = true;
        if (ipStatus) {
            if (!req.cookies.deviceId) {
                res.redirect('/register');
            } else {
                const deviceId = req.cookies.deviceId;
                const waktuAbsenFull = await ambilWaktuIndonesia();
                const waktuAbsen = waktuAbsenFull.hariTanggal
                const jamAbsen = waktuAbsenFull.jam

                const dataUser = await Users.findOne({ deviceId: `${deviceId}` });
                if (dataUser === null) {
                    res.redirect('/register');
                } else {
                    const cekDuplikat = await Absen.findOne({
                        nama_lengkap: dataUser.nama_lengkap,
                        hari_tanggal: waktuAbsen
                    });
                    if (!cekDuplikat) {
                        alertMessage = ''
                    } else {
                        alertMessage = 'Sudah Absen'
                    }
                    res.render('absen', {
                        layout: 'layouts/main-layout',
                        title: 'Absen Piket',
                        dataUser,
                        ipStatus,
                        waktuAbsen,
                        jamAbsen,
                        alertMessage
                    });
                }
            }
        } else {
            res.send("Mau Bolos Ya?");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.post('/absen', async (req, res) => {
    try {
        const newAbsen = new Absen(req.body);
        await newAbsen.save();
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan.');
    }
});

app.get('/absen/lihat', async (req, res) => {
    const dataUser = await Users.find()
    const dataAbsens = await Absen.find();
    dataAbsens.reverse();
    res.render('absen_lihat', {
        layout: 'layouts/main-layout',
        title: 'Data Piket',
        dataUser,
        dataAbsens
    });
});

app.get('/absen/detail/:id', async (req, res) => {
    const idAbsen = req.params.id
    const dataAbsens = await Absen.findOne({ _id: idAbsen });
    res.render('absen_detail', {
        layout: 'layouts/main-layout',
        title: 'Data Piket',
        dataAbsens
    });
});

//LAPORAN HASIL PENGAWASAN
app.get('/lhp/add', async (req, res) => {
    const deviceId = req.cookies.deviceId;
    const dataUser = await Users.findOne({ deviceId: `${deviceId}` });
    const lhp_Conf = await LhpConfig.findOne()
    if (dataUser == null) {
        res.redirect('/register');
    } else {
        const cariLHP = await LaporanHasilPengawasan.find({ pelaksana_tugas: `${dataUser.nama_lengkap}` });
        const semuaLhp = cariLHP.reverse();
        const lhpIdt = await newNoLhp(semuaLhp)
        res.render('lhp_buat', {
            layout: 'layouts/main-layout',
            title: 'Buat LHP',
            lhpIdt,
            dataUser,
            lhp_Conf
        });
    }
});

app.post('/lhp', async (req, res) => {
    try {
        const newLhp = new LaporanHasilPengawasan(req.body);
        await newLhp.save();
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan.');
    }
});

//lihat LHP
app.get('/lhp/lihat', async (req, res) => {
    const dataUser = await Users.find()
    const dataLHP = await LaporanHasilPengawasan.find();
    res.render('lhp_lihat', {
        layout: 'layouts/main-layout',
        title: 'Data LHP',
        dataUser,
        dataLHP,
    });
});

app.get('/lhp/detail/:id', async (req, res) => {
    const dataLHP = await LaporanHasilPengawasan.findOne({ _id: req.params.id });
    await generateDocument(dataLHP)
    res.render('lhp_detail', {
        layout: 'layouts/main-layout',
        title: 'Lihat LHP',
        dataLHP,
    });
});

app.get('/lhp/delete/:id', async (req, res) => {
    await LaporanHasilPengawasan.deleteOne({ _id: req.params.id });
    res.redirect('/lhp/lihat');
});

app.get('/download-document/:fileName', (req, res) => {
    const filePath = 'output.docx';
    const fileName = req.params.fileName;
    res.download(filePath, `LHP ${fileName}.docx`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error downloading document');
        }
    });
});

app.get('/info', async (req, res) => {
    const dataUser = await Users.find()
    res.render('users', {
        layout: 'layouts/main-layout',
        title: 'Profil',
        dataUser
    });
});

//profil
app.get('/profil', async (req, res) => {
    const dataUser = await Users.find()
    res.render('users', {
        layout: 'layouts/main-layout',
        title: 'Profil',
        dataUser
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.clear();
    console.log("Aplikasi Dijalankan");
});
