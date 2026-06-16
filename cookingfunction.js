const bgMusic = new Audio("audio/cookingMusic.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.3;

const cookSound = new Audio("audio/cook.mp3");

cookSound.volume = 0.5;

document.addEventListener("click", () => {

    if(bgMusic.paused){
        bgMusic.play();
    }

}, { once: true });

let cookedInventory =
JSON.parse(localStorage.getItem("cookedInventory")) || [];

function saveCookedInventory(){
    localStorage.setItem(
        "cookedInventory",
        JSON.stringify(cookedInventory)
    );
}

function addToCookedInventory(foodName){
    cookedInventory.push(foodName);

    saveCookedInventory();

    showCookedInventory();
}

function showCookedInventory(){

    const inventoryBox =
    document.getElementById("inventoryBox");

    inventoryBox.innerHTML = "";

    let itemCount = {};

    for(let item of cookedInventory){

        if(itemCount[item]){
            itemCount[item]++;
        } else {
            itemCount[item] = 1;
        }
    }

    for(let item in itemCount){

      let imageName =
      item.split(" (")[0].toLowerCase();
        
      inventoryBox.innerHTML += `
        <div class="inventory-item">

                <img src="image/${imageName}.png">

                <h3>${item}</h3>

                <p>Amount: ${itemCount[item]}</p>

            </div>
      `;
    }
}

showCookedInventory();

function startCooking(index) {

  cookSound.currentTime = 0;
  cookSound.play();

  const box = document.createElement("div");
  box.className = "cookUI";

  const foodselect = document.createElement("select");
  const foods = ["Carrot", "Seeds", "Lettuce", "Fish", "Meat", "Grains"];

  foods.forEach(food => {
    const option  = document.createElement("option");
    option.value = food;
    option.innerText = food;
    foodselect.appendChild(option);
  });

  const wetnessSelect = document.createElement("select");
  const wetnessOptions = ["Dry", "Wet"];

  wetnessOptions.forEach(w => {
    const option = document.createElement("option");
    option.value = w;
    option.innerText = w;
    wetnessSelect.appendChild(option);
  });

  const sizeSelect = document.createElement("select");
  const sizeOptions = ["Small", "Big"];

  sizeOptions.forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.innerText = s;
    sizeSelect.appendChild(option);
  });

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 100;

  const valueText = document.createElement("p");
  valueText.innerText = "Value:" + slider.value;
  const resultText = document.createElement("p");
  resultText.innerText = "Try to hit 40 - 60 to get Excellent";

  slider.oninput = () => {
    const value = Number(slider.value);
    valueText.innerText ="Value:" + value;
    if (value >= 40 && value <= 60) {
      resultText.innerText = "Excellent ";
      resultText.style.color = "#4CAF50";
    }   else if (value >= 30 && value <= 70) {
      resultText.innerText = "Great ";
      resultText.style.color = "#FFA500";
    }   else{
      resultText.innerText = "Bad ";
      resultText.style.color = "#E53935";
    }
  };

  let direction = 1;

  const moveSlider = setInterval(() => {
    let value = Number(slider.value);
    value += direction;

    if (value >= 100) {
      direction = -1;
    }

    else if (value <= 0){
      direction = 1;
    }

    slider.value = value;
    slider.oninput();

  }, 15);


  const btn = document.createElement("button");
  btn.innerText = "Cook";

  btn.onclick = () => {

    clearInterval(moveSlider);
    btn.disabled = true;
    slider.disabled = true;

    const value = Number(slider.value);
    const selectedFood = foodselect.value;
    const selectWetness = wetnessSelect.value;
    const selectedSize = sizeSelect.value;

    let foodQuality;

    if (value >= 40 && value <= 60) {
      foodQuality = "Excellent Food";
      resultText.style.color = "#4CAF50";
    } else if (value >= 30 && value <= 70) {
      foodQuality = "Good Food";
      resultText.style.color = "#FFA500";
    } else {
      foodQuality = "Bad Food";
      resultText.style.color = "#E53935";
    }
    resultText.innerText = "Cook Successful! You made: " + selectedFood + " ("+ foodQuality + ") [" + selectWetness + ", " + selectedSize + "]";
    
    addToCookedInventory(
    selectedFood + " (" + foodQuality + ") [" + selectWetness + ", " + selectedSize + "]"
);
    setTimeout(() => box.remove(), 2000);
  };

  box.append(foodselect, wetnessSelect, sizeSelect, valueText, resultText, slider, btn);
  document.querySelector(".game-box").appendChild(box);
}

    function resetCookedGame(){

    localStorage.removeItem("cookedInventory");

    location.reload();

} 

function toggleMusic(){

    if(bgMusic.paused){
        bgMusic.play();
    }
    else{
        bgMusic.pause();
    }

}

function openInventory(){
    document.getElementById("inventoryPopup").style.display = "block";
}

function closeInventory(){
    document.getElementById("inventoryPopup").style.display = "none";
}

window.addEventListener("click", function(event){

    const popup = document.getElementById("inventoryPopup");

    if(event.target === popup){
        popup.style.display = "none";
    }

});