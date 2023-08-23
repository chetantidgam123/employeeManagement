import Swal from 'sweetalert2'

function success_toast(msg){
Swal.fire({
      position: 'top-right',
      icon: 'success',
      toast: true,
      title: msg,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2500
    });
}
function error_toast(msg){
Swal.fire({
      position: 'top-right',
      icon: 'error',
      toast: true,
      title: msg,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2500
    });
}
export {success_toast,error_toast}