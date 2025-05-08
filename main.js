const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext("2d");

function fill_screen() {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

fill_screen();