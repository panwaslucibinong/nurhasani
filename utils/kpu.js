const fs = require('fs'); // Modul untuk operasi berkas (file system)
const beritaApi = async () => {
    try {
        const response = await fetch('https://www.bawaslu.go.id/');
        const data = await response.text();
        return data;
    } catch (error) {
        throw error;
    }
}

beritaApi()
    .then(data => {
        // Simpan respons ke dalam file HTML
        fs.writeFileSync('berita.html', data, 'utf-8');
        console.log('Data telah disimpan dalam berita.html');
    })
    .catch(error => {
        console.error("Terjadi kesalahan:", error);
    });

