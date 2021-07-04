const canvas = document.getElementById("canvas");
const range=document.querySelector(".pen-range");
const txtBtn = document.querySelector(".add-txt");
const txtField = document.querySelector(".txt-field");
canvas.width = window.innerWidth;// - 60;
canvas.height = window.innerHeight;// - 150;

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
let is_drawing_shapes=false
let is_adding_text=false;
let last_color;
let txtcolor;

window.addEventListener('resize',(()=>{
canvas.width = window.innerWidth;// - 60;
canvas.height = window.innerHeight;
context = canvas.getContext("2d");
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);
}));

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

canvas.addEventListener('mousedown',circle,false);
canvas.addEventListener('mousedown',addText,false);

canvas.classList.add("drawing");

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
  if(!is_adding_text)
  {
  draw(event);
  }

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
    last_color = draw_color;
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
  if (index <=0) {
     clear_canvas();
    if (!is_erasing) {
      is_erasing = true;
      canvas.classList.add("erasing");
      // draw_color = start_background_color;
    }
    if (is_erasing) {
      is_erasing = false;
      canvas.classList.remove("erasing");
      // draw_color = last_color;
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

function is_shapes()
{
    
    if(is_drawing_shapes)
    {
      is_drawing_shapes=false;
    }
    else{
      is_drawing_shapes=true;
    }

    console.log(range.value)
}
function circle(event)
{

  if(is_drawing_shapes)
  {
    // var radius = 10;
    // context.beginPath();
    // context.arc(event.clientX, event.clientY, radius*range.value, 0, 2 * Math.PI, false);
    // context.lineWidth = 5;
    // context.strokeStyle = '#003300';
    // context.stroke();

    context.beginPath();
    context.rect(event.clientX, event.clientY, 150, 100);
    context.stroke();

    //test

  }

}

function is_text(event)
{
  
    if(is_adding_text)
    {
      is_adding_text=false;
      if(canvas.classList.contains("typing")){
        canvas.classList.remove("typing");
      }
    }
    else{
      is_adding_text=true;
      canvas.classList.add("typing");
    }
    console.log(is_adding_text);

}


function addText(event)
{
  if(is_adding_text)
  {
    console.log(is_adding_text);
    font = '40px sans-serif',
    hasInput = false;

    canvas.onclick = function(e) {
    if (hasInput) return;
    addInput(e.clientX, e.clientY);
}

if(is_adding_text){
function addInput(x, y) {
  if(is_adding_text)
  {

    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';
    input.style.fontSize="30px";
    input.style.height="40px";

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
  }
}
}
//Function to dynamically add an input box: 


//Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
        is_adding_text=false;
        if(canvas.classList.contains("typing")){
        canvas.classList.remove("typing");
        }
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    context.textBaseline = 'top';
    context.textAlign = 'left';
    context.font = font;
    txtcolor=draw_color;
    context.fillStyle=draw_color;
    context.fillText(txt, x - 4, y - 4);
}
  }
}


