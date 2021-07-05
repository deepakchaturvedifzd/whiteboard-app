//slider
const sliderValue = document.getElementById("new");
const inputSlider = document.getElementById("nice");
const colorPicker = document.querySelector(".color-picker");
var draw_width=2;
inputSlider.oninput = (() =>{
  let value = inputSlider.value;
  sliderValue.textContent = value;
  sliderValue.style.left = (2*value) + "%";
  sliderValue.classList.add("show");
  draw_width=value;
})
inputSlider.onblur = (()=>{
  sliderValue.classList.remove("show");
  console.log(inputSlider);
  console.log(sliderValue);
});

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
let is_drawing = false;
let restore_array = [];
let index = -1;
let is_erasing = false;
let is_drawing_rect=false
let is_drawing_circle=false;
let is_adding_text=false;
let last_color;
let txtcolor;
var imageData;

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

 canvas.addEventListener('mousedown',rect,false);
//  canvas.addEventListener('mousedown',circle,false);
canvas.addEventListener('mousedown',addText,false);



canvas.classList.add("drawing");

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    undo_last();
  }

  if(event.ctrlKey && event.key==="s")
  {
    save();
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
    if(canvas.classList.contains("makingrect")){
      canvas.classList.remove("makingrect");
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
    if(canvas.classList.contains("makingrect")){
      canvas.classList.remove("makingrect");
    }
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
    if(canvas.classList.contains("makingrect")){
      canvas.classList.remove("makingrect");
    }
  } else {
    is_erasing = false;
    canvas.classList.remove("erasing");
    draw_color = last_color;
  }
}

function is_rect(event)
{
    
    if(is_drawing_rect)
    {
      rect(event);
      is_drawing_rect=false;
    }
    else{
      if(canvas.classList.contains("makingrect")){
        canvas.classList.remove("makingrect");
      }
      is_drawing_rect=true;
    }

    console.log(range.value)
}
function rect(event)
{

  if(is_drawing_rect)
  {
    is_drawing=false;
    canvas.classList.add("makingrect");
    //test
    context.strokeStyle = "blue";
    context.lineWidth = 2;

    // calculate where the canvas is on the window
    // (used to help calculate mouseX/mouseY)
    var canvasOffset = canvas.getBoundingClientRect();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    // this flage is true when the user is dragging the mouse
    var isDown = false;

    // these vars will hold the starting mouse position
    var startX;
    var startY;

function handleMouseDown(e) {
    console.log('handleMouseDown')
    console.log(e)
    e.preventDefault();
    e.stopPropagation();

    // save the starting x/y of the rectangle
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // set a flag indicating the drag has begun
    isDown = true;
}

function handleMouseUp(e) {
    console.log('handleMouseUp')
    console.log(e)
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isDown = false;
    // console.log(x1, x2, y1, y2)
}

function handleMouseOut(e) {
    console.log('handleMouseOut')
    console.log(e)
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isDown = false; 
}

function handleMouseMove(e) {
    console.log('handleMouseMove')
    console.log(e)
    e.preventDefault();
    e.stopPropagation();

    // if we're not dragging, just return
    if (!isDown) {
        return;
    }

    // get the current mouse position
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here

    // clear the canvas
    // context.clearRect(startX, startY, mouseX-offsetX, mouseY-offsetY);

    // calculate the rectangle width/height based
    // on starting vs current mouse position
    var width = mouseX - startX;
    var height = mouseY - startY;

    // draw a new rect from the start position 
    // to the current mouse position
    is_drawing=false;
    canvas.classList.add("makingrect")
    context.fillRect(startX, startY, width, height);
    context.fillStyle = start_background_color;
    context.strokeRect(startX, startY, width, height);
    context.strokeStyle = draw_color;

    x1 = startX
    y1 = startY
    x2 = width
    y2 = height
}

      

  }
  
  document.getElementById('canvas').addEventListener('mousedown', function(e) {
        handleMouseDown(e);
      });
      document.getElementById('canvas').addEventListener('mousemove', function(e) {
        handleMouseMove(e);
      });
      document.getElementById('canvas').addEventListener('mouseup', function(e) {
        handleMouseUp(e);
      });
      document.getElementById('canvas').addEventListener('mouseout', function(e) {
        handleMouseOut(e);
      });

}
// function is_circle(event)
// {
    
//     if(is_drawing_circle)
//     {
//       // circle(event);
//       is_drawing_circle=false;
//     }
//     else{
//       is_drawing_circle=true;
//       circle(event);
//     }

//     console.log("circle")
// }

// function circle(event){
//   if(is_drawing_circle)
//   {
//     var canvasOffset = canvas.getBoundingClientRect();
//     var offsetX = canvasOffset.left;
//     var offsetY = canvasOffset.top;
//     var startX;
//     var startY;
//     var isDown = false;

// function drawOval(x, y) {
//     // context.clearRect(0, 0, canvas.width, canvas.height);
//     context.fillStyle='green';
//     context.beginPath();
//     context.moveTo(startX, startY + (y - startY) / 2);
//     context.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
//     context.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
//     context.closePath();
    
//     context.stroke();
    
// }

// function handleMouseDownC(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     startX = parseInt(e.clientX - offsetX);
//     startY = parseInt(e.clientY - offsetY);
//     isDown = true;
// }

// function handleMouseUpC(e) {
//     if (!isDown) {
//         return;
//     }
//     e.preventDefault();
//     e.stopPropagation();
//     isDown = false;
// }

// function handleMouseOutC(e) {
//     if (!isDown) {
//         return;
//     }
//     e.preventDefault();
//     e.stopPropagation();
//     isDown = false;
// }

// function handleMouseMoveC(e) {
//     if (!isDown) {
//         return;
//     }
//     e.preventDefault();
//     e.stopPropagation();
//     mouseX = parseInt(e.clientX - offsetX);
//     mouseY = parseInt(e.clientY - offsetY);
//     drawOval(mouseX, mouseY);
// }

//   }

//   document.getElementById('canvas').addEventListener('mousedown', function(e) {
//         handleMouseDownC(e);
//       });
//       document.getElementById('canvas').addEventListener('mousemove', function(e) {
//         handleMouseMoveC(e);
//       });
//       document.getElementById('canvas').addEventListener('mouseup', function(e) {
//         handleMouseUpC(e);
//       });
//       document.getElementById('canvas').addEventListener('mouseout', function(e) {
//         handleMouseOutC(e);
//       });
// }
      

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
    draw_color=colorPicker.value;
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
    input.placeholder="Type + Press Enter";
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

// save

function save()
{
  localStorage.setItem(canvas, canvas.toDataURL());
}
function load()
{
   var dataURL = localStorage.getItem(canvas);
   var img = new Image;
   img.src = dataURL;
   img.onload = function () {
   context.drawImage(img, 0, 0);
};
}
load();



