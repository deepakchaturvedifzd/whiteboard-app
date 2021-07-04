const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight - 150;

let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let restore_array = [];
let index = -1;
let is_erasing = false;
let last_color;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);
canvas.classList.add("drawing");
function shapes() {
  var canva = new fabric.Canvas("canvas");

  // create a rectangle object
  // var rect = new fabric.Rect({
  //  left: 100,
  //  top: 100,
  //  fill: 'red',
  //  width: 20,
  //  height: 20
  // });

  // "add" rectangle onto canvas
  //     canva.add(rect);
  // }
  canva.add(
    new fabric.Rect({
      top: 100,
      left: 100,
      width: 50,
      height: 50,
      fill: "#f55",
    }),
    new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" }),
    new fabric.Triangle({
      top: 300,
      left: 210,
      width: 100,
      height: 100,
      fill: "blue",
    })
  );
}

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    undo_last();
  }
});

function start(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  draw(event);
  event.preventDefault();
}

function draw(event) {
  if (is_drawing) {
    if (!canvas.classList.contains("drawing")) {
      canvas.classList.add("drawing");
    }
    context.lineTo(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }

  event.preventDefault();
}

function stop(event) {
  if (is_drawing) {
    context.stroke();
    context.closePath();
    is_drawing = false;
    // canvas.classList.remove("drawing");
  }
  event.preventDefault();

  if (event.type != "mouseout") {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index = index + 1;
  }
}

function change_color_bg(element) {
  // draw_color=element.style.background;
  start_background_color = element.style.background;
  context.fillStyle = start_background_color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (!is_erasing) {
    is_erasing = true;
    canvas.classList.add("erasing");
    draw_color = start_background_color;
  }
  if (is_erasing) {
    is_erasing = false;
    canvas.classList.remove("erasing");
    draw_color = last_color;
  }
  // context.putImageData(restore_array[index],0,0);
}
function clear_canvas() {
  context.fillStyle = start_background_color;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);

  restore_array = [];
  index = -1;
}

function undo_last() {
  if (index <= 0) {
    clear_canvas();
    if (!is_erasing) {
      is_erasing = true;
      canvas.classList.add("erasing");
      draw_color = start_background_color;
    }
    if (is_erasing) {
      is_erasing = false;
      canvas.classList.remove("erasing");
      draw_color = last_color;
    }
  } else {
    if (!is_erasing) {
      is_erasing = true;
      canvas.classList.add("erasing");
      draw_color = start_background_color;
    }
    if (is_erasing) {
      is_erasing = false;
      canvas.classList.remove("erasing");
      draw_color = last_color;
    }
    index = index - 1;
    restore_array.pop();
    context.putImageData(restore_array[index], 0, 0);
  }
}
function erase() {
  if (!is_erasing) {
    last_color = draw_color;
    draw_color = start_background_color;

    is_erasing = true;
    canvas.classList.add("erasing");
  } else {
    is_erasing = false;
    canvas.classList.remove("erasing");
    draw_color = last_color;
  }
}
