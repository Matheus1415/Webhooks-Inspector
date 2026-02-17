import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#27272a", 
  color: "#fafafa",
  customClass: {
    popup: "rounded-xl border border-zinc-700 shadow-xl backdrop-blur-sm",
    title: "text-sm font-medium tracking-wide",
    timerProgressBar: "bg-emerald-500",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const toast = {
  success: (message: string) =>
    Toast.fire({
      icon: "success",
      title: message,
    }),

  warning: (message: string) =>
    Toast.fire({
      icon: "warning",
      title: message,
    }),

  danger: (message: string) =>
    Toast.fire({
      icon: "error",
      title: message,
    }),

  info: (message: string) =>
    Toast.fire({
      icon: "info",
      title: message,
    }),
};
