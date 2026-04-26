const menu = ["Join", "Data", "Exit"];
let selected = 0;
let running = true;

document.title = "Mini Gardening Pets Edition";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.backgroundColor = "black";
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth || 1920;
  canvas.height = window.innerHeight || 1080;
}

function drawMenu() {
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.font = "100px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";


  menu.forEach((item, index) => {
    ctx.fillStyle = index === selected ? "lightgreen" : "white";
    const textY = Math.floor(height / 3.5) + index * 130;
    ctx.fillText(item, Math.floor(width / 2), textY);
  });
}

function handleSelection() {
  const choice = menu[selected];
  console.log(choice);

  if (choice === "Join") {

  }
  else if (choice === "Data") {

  }

else if (choice === "Exit") {
  running = false;
  showExitScreen();
}

}

function showExitScreen() {
  document.body.innerHTML = "";
  document.body.style.backgroundColor = "black";

  const message = document.createElement("h1");
  message.textContent = "Game Over";
  message.style.color = "red";
  message.style.textAlign = "center";
  message.style.marginTop = "20%";
  message.style.fontFamily = "sans-serif";
  message.style.fontSize = "150px";

  document.body.appendChild(message);
}


function handleKeyDown(event) {
  if (!running) {
    return;
  }

  if (event.key === "ArrowUp") {
    selected = (selected - 1 + menu.length) % menu.length;
  } else if (event.key === "ArrowDown") {
    selected = (selected + 1) % menu.length;
  } else if (event.key === "Enter") {
    handleSelection();
  }
}

function gameLoop() {
  if (!running) {
    return;
  }

  drawMenu();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeyDown);

resizeCanvas();
gameLoop();
