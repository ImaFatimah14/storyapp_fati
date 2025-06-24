import Swal from 'sweetalert2';

const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export default showSuccessAlert;
