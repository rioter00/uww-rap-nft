// JavaScript source code
//Collab-Hub Web Interface
console.log("Collab-Hub Web Interface");
var socket;
var img;
var timeouts = [];

const TIMEOUTDUR = 5000;
// var resolution;

window.onload = () => {
    // connect to the collab-hub server at namespace '/hub'
    socket = io.connect("https://ch-server.herokuapp.com/hub", {
        // automatically connect with a username
        query: {
            username: "example_username",
        },
    });

    // after connected, register event handlers
    socket.on("connect", () => {
        // console.log("Connected to server");
    });

    socket.on("control", (data) => {
      if(data.header == "timeout"){
        if(timeouts.includes(data.values)){
          console.log("timeout already started");
        } else {
          console.log("starting timeout: " + data.values);
          startMyTimeout(data.values);
        }
      }
    });

    registerEventHandlers(socket);
	
	imgInp = document.getElementById("imgInp");
};

///********* LOOK HERE */
updateResolutionValue = () => {
  console.log(`resolution changed to ${resolutionInput.value}`);
  resolution = resolutionInput.value;
}

imgInp.onchange = evt => {
  // console.dir(imgInp);
  startOtherTimeout("imgInp");
  const [file] = imgInp.files
  if (file) {
    // blah.src = URL.createObjectURL(file);
    img  = new Image();
    img.onload = imageLoaded;
    img.src = URL.createObjectURL(file);
    console.log(imgInp.value);
  }
}

function imageLoaded(){
  console.log("image loaded");
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  console.log(img.width);
  console.log(img.height);

  imgWidth = img.width;
  imgHeight = img.height;
  console.log(ctx.getImageData(0, 0, 1, 1).data);
  // read pixels into array
  let imgDims = [imgWidth, imgHeight];
  let pixels = [];

  // reduce
  let wRed = imgWidth / 16;
  let hRed = imgHeight / 16;

  // 'rows'
  for (let row = 0; row < 16; row++) {
    for(let col = 0; col < 16; col++) {
      for(let k = 0; k < 4; k++) {
        let index = (row * 64) + (col * 4) + k;
        console.log(index);
        pixels[index] = ctx.getImageData(row * wRed, col * hRed, wRed, hRed).data[k];
      }
    }
  }

  console.dir(pixels);
  console.log(socket);
  socket.emit("control", {
    header: "imageInfo",
    mode: "push",
    target: "all",
    values: pixels,
  });

  console.log("image sent");
}

registerEventHandlers = (socket) => {
    // Find the DOM elements and register interaction handlers
    const sliders = Array.from(document.querySelectorAll(".slider"));
    sliders.forEach((slider) => {
        console.log(slider);
        console.log(slider.id);
        slider.oninput = emitControl;
    });

    // register a handler for the 'event' event
    const buttons = Array.from(document.querySelectorAll(".button"));
    console.log(typeof buttons);
    buttons.forEach((button) => {
        console.log(button);
        console.log(button.id);
        button.onclick = emitEvent;
    });
};

emitEvent = (input) => {
    console.log(`ooooo button clicked: ${input.target.attributes.header.value}`);
    console.log(`ooooo button id: ${input.target.value}`);
    // Send a message to the server
    socket.emit("event", {
        header: input.target.attributes.header.value,
        mode: "push",
        target: "all",
    });
    startOtherTimeout(input.target.id);
};

emitControl = (input) => {
    console.log(`control`);
    console.dir(input);
    console.log(`slider header: ${input.target.attributes.header.value}`);
    console.log(`slider value: ${input.target.value}`);
    // Send a message to the server
    socket.emit("control", {
        header: input.target.attributes.header.value,
        mode: "push",
        target: "all",
        values: input.target.value,
    });
    startOtherTimeout(input.target.id);
};

startOtherTimeout = (id) => {
    console.log(`start other timeout`);
    socket.emit("control", {
      header: "timeout",
      mode: "push",
      target: "all",
      values: id
  });
}

startMyTimeout = (id) => {
    console.log(`start my timeout: ${id}`);
    console.log(document.getElementById(id));
    document.getElementById(id).disabled = true;
    timeouts.push(id);
    console.dir (timeouts);
    setTimeout(() => {
      enableElement(id);
    }, TIMEOUTDUR);
}



enableElement = (id) => {
  document.getElementById(id).disabled = false;
  timeouts.pop(id);
}

getTimeout = () => {

}