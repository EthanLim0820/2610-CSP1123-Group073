const menu = ["Join", "Exit"];
let selected = 0;
let running = true;

document.title = "Group 7 Mini IT";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.backgroundColor = "black";
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth || 1000;
  canvas.height = window.innerHeight || 700;
}

function drawMenu() {
  const width = canvas.width;
  const height = canvas.height;
  const fontSize = Math.floor(width / 9);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  menu.forEach((item, index) => {
    ctx.fillStyle = index === selected ? "red" : "yellow";
    const textY = Math.floor(height / 3) + index * (fontSize + 20);
    ctx.fillText(item, Math.floor(width / 2), textY);
  });
}

function handleSelection() {
  const choice = menu[selected];
  console.log(choice);

  if (choice === "Exit") {
    running = false;
    window.removeEventListener("keydown", handleKeyDown);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
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
