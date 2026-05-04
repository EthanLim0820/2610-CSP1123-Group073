function startCooking(index) {
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

  const btn = document.createElement("button");
  btn.innerText = "Cook";

  btn.onclick = () => {
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

    setTimeout(() => box.remove(), 2000);
  };

  box.append(foodselect, wetnessSelect, sizeSelect, valueText, resultText, slider, btn);
  document.querySelector(".game-box").appendChild(box);
}