import Swal from "sweetalert2";

/*
  File untuk konfigurasi alert toast
*/ 

export const toast = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
