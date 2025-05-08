const canvas = document.getElementById('main-canvas');
const gl = canvas.getContext("webgl");

function initialize_vbo() {
    
}

function setup() {
    // Set clear color to red, fully opaque
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
}

function clear_screen() {
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function main() {
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL!");
        return;
    }
    setup();
    clear_screen();
}

main();
