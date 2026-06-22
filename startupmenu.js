const menu = ["Join", "Exit"];
let selected = 0;
let running = true;

document.title = "Mini Gardening Pets Edition";

const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.backgroundColor = "black";
document.body.appendChild(canvas);

const backgroundImage = new Image();
backgroundImage.src = "./mini it/image/gardening map.png";

const instructionImage = new Image();
instructionImage.src = "./mini it/image/Instruction.png";

const background = {
  x: -400,
  y: -515,
  speed: 0.1,
  minX: -500,
  maxX: -300
};

const backgroundMusic = new Audio('./mini it/music/startupmusic.mp3')
backgroundMusic.loop = true
backgroundMusic.volume = 0.10
let showingInstructions = false

backgroundMusic.play()

function playBackgroundMusic() {
  const playPromise = backgroundMusic.play()

  if (playPromise) {
    playPromise.catch(() => {
      window.addEventListener('keydown', playBackgroundMusic, { once: true })
      window.addEventListener('click', playBackgroundMusic, { once: true })
    })
  }
}

playBackgroundMusic()

function resizeCanvas() {
  canvas.width = window.innerWidth || 1920;
  canvas.height = window.innerHeight || 1080;
}

function moveBackground() {
  background.x += background.speed;

  if (background.x <= background.minX || background.x >= background.maxX) {
    background.speed *= -1;
  }
}

function drawMenu() {
  const width = canvas.width;
  const height = canvas.height;

  c.fillStyle = "black";
  c.fillRect(0, 0, width, height);

  if (backgroundImage.complete && backgroundImage.width !== 0) {
    moveBackground();
    c.drawImage(backgroundImage, background.x, background.y);
  }

  c.font = "150px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "top";

  menu.forEach((item, index) => {
    const textY = Math.floor(height / 3) + index * 180;
    const textX = Math.floor(width / 2);

    c.lineWidth = 8;
    c.strokeStyle = "#6c6c76";
    c.strokeText(item, textX, textY);
    c.fillStyle = index === selected ? "#ff6767" : "#ffffff";
    c.fillText(item, textX, textY);
  });
}

function drawInstructions() {
  const width = canvas.width;
  const height = canvas.height;

  c.fillStyle = "black";
  c.fillRect(0, 0, width, height);

  if (backgroundImage.complete && backgroundImage.width !== 0) {
    moveBackground();
    c.drawImage(backgroundImage, background.x, background.y);
  }

  c.fillStyle = "rgba(0, 0, 0, 0.45)";
  c.fillRect(0, 0, width, height);

  if (instructionImage.complete && instructionImage.width !== 0) {
    const maxWidth = width * 0.85;
    const maxHeight = height * 0.85;
    const scale = Math.min(
      maxWidth / instructionImage.width,
      maxHeight / instructionImage.height
    );
    const imageWidth = instructionImage.width * scale;
    const imageHeight = instructionImage.height * scale;
    const imageX = (width - imageWidth) / 2;
    const imageY = (height - imageHeight) / 2;

    c.drawImage(instructionImage, imageX, imageY, imageWidth, imageHeight);
  }
}

function handleSelection() {
  const choice = menu[selected];
  console.log(choice);

  if (choice === "Join") {
    showingInstructions = true;
  }
  else if (choice === "Exit") {
    running = false;
    showExitScreen();
  }

}

function showExitScreen() {
  document.body.innerHTML = "";
  document.body.style.backgroundColor = "#ff5252";

  const message = document.createElement("h1");
  message.textContent = "Game Over";
  message.style.color = "#ffffff";
  message.style.webkitTextStroke = "5px #6c6c76";
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

  if (showingInstructions) {
    if (event.key === "Enter" || event.key === " ") {
      window.location.href = "index.html";
    }
    return;
  }

  if (event.key === "w" || event.key === "ArrowUp") {
    selected = (selected - 1 + menu.length) % menu.length;
  } else if (event.key === "s" || event.key === "ArrowDown") {
    selected = (selected + 1) % menu.length;
  } else if (event.key === "Enter" || event.key === " ") {
    handleSelection();
  }
}

function gameLoop() {
  if (!running) {
    return;
  }

  if (showingInstructions) {
    drawInstructions();
  } else {
    drawMenu();
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeyDown);

resizeCanvas();
gameLoop();
