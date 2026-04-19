function startCooking(index) {

  let box = document.createElement("div");
  box.className = "cookUI";

  let slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 100;

  let btn = document.createElement("button");
  btn.innerText = "Cook";

  btn.onclick = () => {
    finishCooking(index, slider.value);
    box.remove();
  };

  box.appendChild(slider);
  box.appendChild(btn);
  document.body.appendChild(box);
}