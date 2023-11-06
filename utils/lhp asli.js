const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

const { ambilWaktuIndonesia } = require('./absen')
function formatNoLhp(noLhp) {
    if (noLhp < 10) {
        return `00${noLhp}`;
    } else if (noLhp < 100) {
        return `0${noLhp}`;
    } else {
        return `${noLhp}`;
    }
}
function formatBulan(month) {
    if (month < 10) {
        return `0${month}`;
    } else {
        return `${month}`;
    }
}

const newNoLhp = async (semuaLhp) => {
    if (semuaLhp.length === 0) {
        noLhpTerakhir = 1;
    } else {
        noLhpTerakhir = parseInt(semuaLhp[0].no_lhp.split('/')[0]) + 1;
    }
    const waktuIndo = await ambilWaktuIndonesia().hariTanggal.split(', ')[1];
    const waktuTempat = await ambilWaktuIndonesia().hariTanggal;

    const inputDate = new Date(waktuIndo);
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();

    const fNoLhp = formatNoLhp(noLhpTerakhir);
    const fBulan = formatBulan(month);
    const nomor_LHP = `${fNoLhp}/LHP/PM.01.02/${fBulan}/${year}`;
    return {
        dibuat: waktuIndo,
        nomor_LHP: nomor_LHP,
        waktu_tempat: waktuTempat,
    };
};

const generateDocument = (dataLHP) => {
    return new Promise((resolve, reject) => {
        const filePath = 'template.docx';
        fs.readFile(filePath, (err, content) => {
            if (err) {
                reject(err);
                return;
            }
            var zip = new PizZip(content);
            var doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            doc.setData({
                no_lhp: dataLHP.no_lhp,
                tahapan: dataLHP.tahapan,
                pelaksana: dataLHP.pelaksana_tugas,
                jabatan: dataLHP.jabatan,
                surat_tugas: dataLHP.no_surat,
                ///alamat
                bentuk: dataLHP.bentuk_pengawasan,
                tujuan: dataLHP.tujuan_pengawasan,
                sasaran: dataLHP.sasaran_pengawasan,
                waktu_tempat: dataLHP.waktu_pengawasan,
                uraian_pengawasan: dataLHP.uraian_pengawasan,
                titimangsa: dataLHP.waktu_dibuat,
                dokumentasi: '',
            });
            try {
                doc.render();
            } catch (error) {
                function replaceErrors(key, value) {
                    if (value instanceof Error) {
                        return Object.getOwnPropertyNames(value).reduce(function (
                            error,
                            key
                        ) {
                            error[key] = value[key];
                            return error;
                        }, {});
                    }
                    return value;
                }
                console.log(JSON.stringify({ error: error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors
                        .map(function (error) {
                            return error.properties.explanation;
                        })
                        .join('\n');
                    console.log('errorMessages', errorMessages);
                }
                throw error;
            }
            var out = doc.getZip().generate({
                type: 'nodebuffer', // Use nodebuffer to get a Buffer object
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            // Save the generated document using fs.writeFile
            fs.writeFile('output.docx', out, (writeErr) => {
                if (writeErr) {
                    reject(writeErr);
                } else {
                    resolve();
                }
            });
        });
    });
};

module.exports = { newNoLhp, generateDocument };