const alertSukses = (judul, pesan) => {
    Swal.fire({
        icon: 'success',
        title: judul,
        text: pesan,
        showConfirmButton: false,
        timer: 3000
    })
}
const alertSuksesRedirect = (judul, pesan, arahLink) => {
    Swal.fire({
        icon: 'success',
        title: judul,
        text: pesan,
        showConfirmButton: false,
        timer: 3000
    }).then((result) => {
        window.location.href = arahLink;
    });
}

const alertConfirm = (idLHP) => {
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin menghapus ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/lhp/delete/${idLHP}`;
        }
    });
}