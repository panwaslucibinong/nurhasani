const fs = require('fs');
const { DateTime } = require('luxon');

const cekIp = async (myIP) => {
    const allowedIp = 'AS23693 PT. Telekomunikasi Selular'
    try {
        const response = await fetch(`https://ipinfo.io/${myIP}/json`);
        const data = await response.json();
        if (data.org === allowedIp) {
            return true;
        }
    } catch (error) {
        throw error;
    }
}

const ambilWaktuIndonesia = () => {
    const zonaWaktu = 'Asia/Jakarta';
    const waktuSaatIni = DateTime.now().setZone(zonaWaktu);
    const namaHari = waktuSaatIni.setLocale('id').toLocaleString({ weekday: 'long' });
    const namaBulan = waktuSaatIni.setLocale('id').toLocaleString({ month: 'long' });
    const waktuFormatted = `${namaHari}, ${waktuSaatIni.toFormat('dd')} ${namaBulan} ${waktuSaatIni.toFormat('yyyy')}`;
    const jamIni = `${waktuSaatIni.toFormat('HH:mm')}`;
    // const waktuFormatted = `${namaHari}, ${waktuSaatIni.toFormat('dd')} ${namaBulan} ${waktuSaatIni.toFormat('yyyy|HH:mm')}`;
    return {
        hariTanggal: waktuFormatted,
        jam: jamIni,
    };
}

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
};

const generateUniqueId = () => {
    const randomSTR = generateRandomString(40);
    return `${randomSTR}`;
};

module.exports = { generateUniqueId, cekIp, ambilWaktuIndonesia };