function startCooking(index) {
  const box = document.createElement("div");
  box.className = "cookUI";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 100;

  const valueText = document.createElement("p");
  valueText.innerText = "Value:" + slider.value;
  const resultText = document.createElement("p");
  resultText.innerText = "try to hit 40 - 60 to get Excellent";

  slider.oninput = () =>{
    valueText.innerText ="Value:" + slider.value;
    if (slider.value >= 40 && slider.value <= 60) {
      resultText.innerText = "Excellent ";
    }   else if (slider.value >= 30 && slider.valu <= 70) {
      resultText.innerText = "Great ";
    }   else{
      resultText.innerText = "Bad ";
    }
  };

  const btn = document.createElement("button");
  btn.innerText = "Cook";

  btn.onclick = () => {
    let foodQuanlity;
    if (slider.value >= 40 && slider.value <= 60) {
      foodQuality = "Excellent Food ";
    } else if (slider.value >= 30 && slider.valu <= 70) {
      foodQuality = "Good Food ";
    } else {
      foodQuality = "Bad Food ";
    }
    resultText.innerText ="Cook Successful! You made: " + foodQuality;
    finishCooking(index, slider.value);
  };

  box.append(valueText, resultText, slider, btn);
  document.body.appendChild(box);

  btn.addEventListener("click", () => {
    setTimeout(() => box.remove(), 6000);
  });
}