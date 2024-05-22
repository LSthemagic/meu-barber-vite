import Swal from "sweetalert2";

const Toast = Swal.mixin({
	background: "#333",
	color: "white",
	toast: true,
	position: "top-end",
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.onmouseenter = Swal.stopTimer;
		toast.onmouseleave = Swal.resumeTimer;
	}
});

export default Toast;
