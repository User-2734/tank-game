const canvas = document.getElementById('main-canvas');
const gl = canvas.getContext("webgl2");

// source code for shaders
const vertex_src = `#version 300 es
in vec2 a_position;
uniform float u_aspect;
void main() {
  // z is 0 for neutral depth
  // w is 1 for no perspective deform
  vec2 scaled = vec2(a_position.x / u_aspect, a_position.y);
  gl_Position = vec4(scaled, 0.0, 1.0);
}`;

const fragment_src = `#version 300 es
precision mediump float;
out vec4 outColor;
void main() {
  outColor = vec4(0, 0, 0, 1); // black
}`;

// function compile a shader
function compile_shader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function create_program(vec_shader, frag_shader) {
    // compile the shaders
    const vertexShader = compile_shader(gl.VERTEX_SHADER, vec_shader);
    const fragmentShader = compile_shader(gl.FRAGMENT_SHADER, frag_shader);

    // create a program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // detect errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    return program;
}

const program = create_program(vertex_src, fragment_src);
gl.useProgram(program);

// make a triangle
const vertices = new Float32Array([
    // x,    y
    0.0, 1.0,
    -0.866, -0.5,
    0.866, -0.5
]);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// corresponds to a_position in the vertex shader
const posAttrib = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(posAttrib);
gl.vertexAttribPointer(
    posAttrib,     // Attribute location
    2,             // Components per vertex (x, y)
    gl.FLOAT,      // Type
    false,         // Normalize
    0,             // Stride (0 = tightly packed)
    0              // Offset
);

// add in aspect ratio correction
const aspect = canvas.width / canvas.height;
const aspectLoc = gl.getUniformLocation(program, "u_aspect");
gl.uniform1f(aspectLoc, aspect);

function draw_vbo() {
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
}

function setup() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Set clear color to white, fully opaque
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // scale up the resolution of the canvas
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
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
    draw_vbo();
}

main();
