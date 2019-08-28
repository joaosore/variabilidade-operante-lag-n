import { click_L, click_R } from "./leg.js";

const RADIUS = 10;

function degToRad(degrees) {
  var result = (Math.PI / 180) * degrees;
  return result;
}

// setup of the canvas

let H = {
  nodeWithAtts: function(tagName, content, atts) {
    if (arguments.length < 3) atts = {};
    var openTag = "<" + tagName;
    for (var attName in atts) {
      openTag += " ";
      openTag += attName;
      openTag += '="';
      openTag += atts[attName];
      openTag += '"';
    }
    openTag += ">";
    var closeTag = "</" + tagName + ">";
    return openTag + content + closeTag;
  },
  canvas: function(atts) {
    var notSupportedInfo =
      "If you see this text, this means that your browser does not support the canvas element of HTML5. Try loading this page in a recent version of Chrome, Safari, Firefox, or IE9+.";
    notSupportedInfo = "";
    return this.nodeWithAtts("canvas", notSupportedInfo, atts);
  }
};

var body = $(".canvas");
var w = window.innerWidth;
var h = window.innerHeight / 1.5;
var canvHtml = H.canvas({ width: w, height: h, id: "canvas" });
body.html(canvHtml);
var canvas = document.querySelector("canvas");

var ctx = canvas.getContext("2d");

var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

function canvasDraw() {
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.fillRect(100, 100, 50, 50);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.fillRect(window.innerWidth - 150, 100, 50, 50);
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = "#777";
  ctx.beginPath();

  if (y <= canvas.height - 10 && y >= 0) {
    y = y;
  } else {
    if (y > (canvas.height - 10) / 2) {
      y = canvas.height - 10;
    } else {
      y = 10;
    }
  }

  if (x <= canvas.width - 10 && x >= 0) {
    x = x;
  } else {
    if (x > (canvas.width - 10) / 2) {
      x = canvas.width - 10;
    } else {
      x = 10;
    }
  }

  ctx.arc(x, y, RADIUS, 0, degToRad(360), true);

  ctx.fill();
}
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock =
  canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock =
  document.exitPointerLock || document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

export function canvasSelect() {
  canvas.requestPointerLock();
}

export function canvasExit() {
  document.exitPointerLock();
}

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener("pointerlockchange", lockChangeAlert, false);
document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
  if (
    document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas
  ) {
    // console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
    document.addEventListener("click", click, false);
  } else {
    // console.log('The pointer lock status is now unlocked');
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

var animation;
function updatePosition(e) {
  x += e.movementX;
  y += e.movementY;

  // if (x > canvas.width + RADIUS) {
  //   x = -RADIUS;
  // }
  // if (y > canvas.height + RADIUS) {
  //   y = -RADIUS;
  // }
  // if (x < -RADIUS) {
  //   x = canvas.width + RADIUS;
  // }
  // if (y < -RADIUS) {
  //   y = canvas.height + RADIUS;
  // }
  // console.log("X position: " + x + ", Y position: " + y);

  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvasDraw();
    });
  }
}

function click() {
  if (
    x >= window.innerWidth - 150 &&
    x <= window.innerWidth - 100 &&
    y >= 100 &&
    y <= 150
  ) {
    x = window.innerWidth / 2;
    y = window.innerHeight / 2;
    click_R();
  }
  if (x >= 100 && x <= 150 && y >= 100 && y <= 150) {
    x = window.innerWidth / 2;
    y = window.innerHeight / 2;
    click_L();
  }
  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvasDraw();
    });
  }
}
