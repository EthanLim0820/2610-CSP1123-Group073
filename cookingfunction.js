function startCooking(index) {
  const box = document.createElement("div");
  box.className = "cookUI";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 100;

  const valueText = document.createElement("p");
  valueText.innerText = "Value:" + slider.value;
  slider.oninput = () =>{
  valueText.innerText ="Value:" + slider.value;
  };

  const btn = document.createElement("button");
  btn.innerText = "Cook";

  btn.onclick = () => finishCooking(index, slider.value);

  box.append(valueText, slider, btn);
  document.body.appendChild(box);

  btn.addEventListener("click", () => box.remove());
}