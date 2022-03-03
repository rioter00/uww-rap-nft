//Collab-Hub Web Interface
console.log("Collab-Hub Web Interface");
var socket;

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

  registerEventHandlers(socket);
};

registerEventHandlers = (socket) => {
  // Find the DOM elements and register interaction handlers
  const sliders = Array.from(document.querySelectorAll(".slider"));
  sliders.forEach((slider) => {
    console.log(slider);
    slider.oninput = emitControl;
  });

  // register a handler for the 'event' event
  const buttons = Array.from(document.querySelectorAll(".button"));
  console.log(typeof buttons);
  buttons.forEach((button) => {
    console.log(button);
    button.onclick = emitEvent;
  });
};

emitEvent = (input) => {
  console.log(`ooooo button clicked: ${input.target.attributes.header.value}`);
  // Send a message to the server
  socket.emit("event", {
    header: input.target.attributes.header.value,
    mode: "push",
    target: "all",
  });
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
  };
