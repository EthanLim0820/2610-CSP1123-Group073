var slots = ["", "", "", "", "", "", "", ""];

function togglePanel() {
  var panel = document.getElementById("panel");
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
    renderSlots();
  }
}

function renderSlots() {
  var container = document.getElementById("slots");
  container.innerHTML = "";
  for (var i = 0; i < slots.length; i++) {
    var div = document.createElement("div");
    div.className = "slot";
    div.textContent = slots[i] || "empty";
    div.onclick = makeClickHandler(i);
    container.appendChild(div);
  }
}

function makeClickHandler(i) {
  return function() {
    var name = prompt("Enter item name:");
    if (name) {
      slots[i] = name;
      renderSlots();
    }
  };
}