let money = 0;
let currentCustomer = null;
let strikes = 0;
let currentMode = null;
const MAX_STRIKES = 3;

let streak = 0;

let CustomerData = {
  current: null,
  history: [],
  totalServed: 0
};

let pets = ["rabbit", "hamster", "guinea pig", "bird", "horse", "duck"];

let dialogues = {
  rabbit:       ["My rabbit wants a big dry carrot feast!", "Big dry carrot feast, please. My bunny is hungry!", "Nothing wet today, just a big dry carrot feast!"],
  hamster:      ["My hamster needs a small dry seed pack!", "Small dry seed pack, please. He's tiny!", "Don't give me anything big, just a small dry seed pack!"],
  "guinea pig": ["My guinea pig wants a big wet lettuce bowl!", "Big wet lettuce bowl, just how she likes it!", "Make it quick, she needs a big wet lettuce bowl!"],
  bird:         ["My bird needs a small wet corn cup!", "Small wet corn cup, just right for her beak!", "She only pecks at a small wet corn cup!"],
  horse:        ["My horse wants a big dry wheat feed!", "He's a big fella, give him a big dry wheat feed!", "Nothing but big dry wheat feed for my stallion!"],
  duck:         ["My duck loves a small wet grass feast!", "Small wet grass feast, just how she waddles for it!", "Quack! She wants a small wet grass feast!"],
};

let products = [];
let cookedInventory = [];

const foodPrices = {
  Carrot: 120,
  Seeds: 110,
  Lettuce: 130,
  Wheat: 110,
  Corn: 120,
  Grass: 120,
};

const foodNames = {
  Carrot: "Carrot Feast",
  Seeds: "Seed Pack",
  Lettuce: "Lettuce Bowl",
  Wheat: "Wheat Feed",
  Corn: "Corn Cup",
  Grass: "Grass Feast",
};

function loadCookedInventory() {
  cookedInventory = JSON.parse(localStorage.getItem("cookedInventory")) || [];
  products = getCookedProducts();
}

function saveCookedInventory() {
  localStorage.setItem("cookedInventory", JSON.stringify(cookedInventory));
}

function countCookedItems() {
  const itemCount = {};

  cookedInventory.forEach(item => {
    itemCount[item] = (itemCount[item] || 0) + 1;
  });

  return itemCount;
}

function parseCookedItem(item) {
  const match = item.match(/^(.+) \((.+)\) \[(.+), (.+)\]$/);

  if (!match) {
    return null;
  }

  const cookedName = match[1];
  const food = Object.keys(foodNames).find(key => foodNames[key] === cookedName) || cookedName;
  const quality = match[2];
  const wetness = match[3].toLowerCase();
  const size = match[4].toLowerCase();

  return {
    name: item,
    cookedName,
    food,
    quality,
    wetness,
    size,
    price: foodPrices[food] || 100,
    image: "image/" + (foodNames[food] || food.toLowerCase()) + ".png",
  };
}

function getCookedProducts() {
  return Object.keys(countCookedItems())
    .map(parseCookedItem)
    .filter(Boolean);
}

function getCookedItemCount(itemName) {
  return countCookedItems()[itemName] || 0;
}

function removeCookedItem(itemName) {
  const index = cookedInventory.indexOf(itemName);

  if (index !== -1) {
    cookedInventory.splice(index, 1);
    saveCookedInventory();
    loadCookedInventory();
  }
}

function renderStock() {
  const list = document.getElementById("inv-list");
  const itemCount = countCookedItems();

  list.innerHTML = "";

  if (Object.keys(itemCount).length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No cooked food yet";
    list.appendChild(li);
    return;
  }

  Object.keys(itemCount).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item + ": " + itemCount[item];
    list.appendChild(li);
  });
}

function resetStock() {
  cookedInventory = [];
  saveCookedInventory();
  loadCookedInventory();
  renderStock();
  buildProductButtons();
}

function loadStats() {
  const saved = localStorage.getItem("petDiningStats");
  if (saved) {
    const s = JSON.parse(saved);
    money = s.money || 0;
    CustomerData.totalServed = s.totalServed || 0;
  }
}

function saveStats() {
  localStorage.setItem("petDiningStats", JSON.stringify({ money, totalServed: CustomerData.totalServed }));
}

function resetStats() {
  money = 0;
  CustomerData.totalServed = 0;
  saveStats();
  document.getElementById("money").innerText = "Money: $0";
  updateFooter();
}


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRating(strikesCount, customerLeft) {
  if (customerLeft) return 0;
  if (strikesCount === 0) return randInt(4, 5);
  if (strikesCount === 1) return randInt(3, 4);
  if (strikesCount === 2) return randInt(2, 3);
  return 1;
}

function renderStars(rating) {
  if (rating === 0) return '<span class="stars zero">✗ 0 stars</span>';
  return '<span class="stars">' + "★".repeat(rating) + "☆".repeat(5 - rating) + "</span>";
}

function getTip(rating) {
  if (rating === 5) {
    return { grade: "Excellent", tip: 10 };
  }

  if (rating >= 3) {
    return { grade: "Good", tip: 5 };
  }

  return { grade: "Bad", tip: 0 };
}

function showRating(rating, reward) {
  let ratingDiv = document.getElementById("rating");
  reward = reward || { grade: "Bad", tip: 0 };

  let html =
    "Customer rated: " +
    renderStars(rating) +
    " | Grade: " +
    reward.grade;

  if (reward.tip > 0) {
    html += ' <span class="tip">+$' + reward.tip + ' tip!</span>';
  }

  ratingDiv.innerHTML = html;
  ratingDiv.className = "rating-show";
}

function updateStreakBar() {
  for (let i = 1; i <= 5; i++) {
    const seg = document.getElementById("seg-" + i);
    if (i <= streak) {
      seg.classList.add("filled");
    } else {
      seg.classList.remove("filled");
    }
  }
}

function selectMode(mode) {
  currentMode = mode;

  document.getElementById("btn-counter").classList.toggle("active", mode === "counter");
  document.getElementById("btn-delivery").classList.toggle("active", mode === "delivery");

  const banner = document.getElementById("delivery-banner");
  const label  = document.getElementById("product-label");

  if (mode === "delivery") {
    banner.classList.add("show");
    label.textContent = "Choose a product to deliver:";
  } else {
    banner.classList.remove("show");
    label.textContent = "Choose a product:";
  }

  document.getElementById("product-section").classList.add("visible");
}

function spawnCustomer() {
  strikes = 0;
  currentMode = null;

  document.getElementById("strikes").innerText = "";
  document.getElementById("rating").innerHTML = "";
  document.getElementById("rating").className = "";

  const status = document.getElementById("status");
  status.innerText = "";
  status.className = "";

  document.getElementById("mode-selector").classList.remove("visible");
  document.getElementById("delivery-banner").classList.remove("show");
  document.getElementById("product-section").classList.remove("visible");
  document.getElementById("btn-counter").classList.remove("active");
  document.getElementById("btn-delivery").classList.remove("active");
  document.getElementById("customer-info").classList.remove("visible");

  const pet = pets[Math.floor(Math.random() * pets.length)];

  const prefMap = {
    rabbit:       { food: "Carrot",  size: "big",   wetness: "dry" },
    hamster:      { food: "Seeds",   size: "small", wetness: "dry" },
    "guinea pig": { food: "Lettuce", size: "big",   wetness: "wet" },
    bird:         { food: "Corn",    size: "small", wetness: "wet" },
    horse:        { food: "Wheat",   size: "big",   wetness: "dry" },
    duck:         { food: "Grass",   size: "small", wetness: "wet" },
  };

  const pref = prefMap[pet];
  currentCustomer = { pet, food: pref.food, wetness: pref.wetness, size: pref.size };
  CustomerData.current = currentCustomer;

  const line = dialogues[pet][Math.floor(Math.random() * dialogues[pet].length)];

  setTimeout(function () {
    document.getElementById("dialogue").innerText = '"' + line + '"';
    document.getElementById("order").innerText =
      pet + " wants: " + foodNames[pref.food] + ", " + pref.wetness + ", " + pref.size;
    document.getElementById("customer-info").classList.add("visible");

    setTimeout(function () {
      buildProductButtons();
      document.getElementById("mode-selector").classList.add("visible");
    }, 600);

  }, 300);
}

function buildProductButtons() {
  loadCookedInventory();

  const btnDiv = document.getElementById("button");
  btnDiv.innerHTML = "";

  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Cook food in inventory first.";
    empty.style.color = "#c62828";
    empty.style.fontWeight = "800";
    btnDiv.appendChild(empty);
    return;
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    const btn = document.createElement("button");
    btn.className = "prod-btn";

    const imgWrap = document.createElement("div");
    imgWrap.className = "prod-img-wrap";

    const img = document.createElement("img");
    img.className = "prod-img";
    img.src = p.image;
    img.alt = p.food;
    img.style.objectFit = "contain";
    img.style.padding = "10px";
    imgWrap.appendChild(img);

    const nameSpan = document.createElement("span");
    nameSpan.innerText = p.name;

    const amountSpan = document.createElement("span");
    amountSpan.innerText = "Amount: " + getCookedItemCount(p.name);

    const priceSpan = document.createElement("span");
    priceSpan.className = "prod-price";
    priceSpan.innerText = "$" + p.price;

    btn.appendChild(imgWrap);
    btn.appendChild(nameSpan);
    btn.appendChild(amountSpan);
    btn.appendChild(priceSpan);

    btn.onclick = (function (product) {
      return function () { sell(product); };
    })(p);

    btnDiv.appendChild(btn);
  }
}

function sell(product) {
  if (!currentMode) {
    const status = document.getElementById("status");
    status.innerText = "Pick Counter or Delivery first!";
    status.className = "wrong";
    return;
  }

  if (getCookedItemCount(product.name) <= 0) {
    const status = document.getElementById("status");
    status.innerText = "Out of stock!";
    status.className = "wrong";
    return;
  }

  const status = document.getElementById("status");
  const correct =
    product.food    === currentCustomer.food &&
    product.wetness === currentCustomer.wetness &&
    product.size    === currentCustomer.size;

  if (correct) {
    money += product.price;

    if (streak < 5) streak++;
    updateStreakBar();

    const rating = getRating(strikes, false);
    const reward = getTip(rating);
    money += reward.tip;

    document.getElementById("money").innerText = "Money: $" + money;
    showRating(rating, reward);

    const modeLabel = currentMode === "delivery" ? " (delivered)" : "";
    status.innerText = "Correct! Sold " + product.name + modeLabel;
    status.className = "correct";

    removeCookedItem(product.name);
    renderStock();
    buildProductButtons();

    CustomerData.history.push({
      pet:    currentCustomer.pet,
      sold:   product.name,
      price:  product.price,
      rating: rating,
      mode:   currentMode,
    });
    CustomerData.totalServed++;

    updateFooter();
    setTimeout(spawnCustomer, 1600);

  } else {
    streak = 0;
    updateStreakBar();

    strikes++;
    if (strikes >= MAX_STRIKES) {
      const rating = getRating(strikes, true);
      showRating(rating, false);
      status.innerText = "Too many wrong items! Customer left.";
      status.className = "wrong";
      document.getElementById("strikes").innerText = "";

      CustomerData.history.push({ pet: currentCustomer.pet, sold: null, price: 0, rating: 0, mode: currentMode });
      updateFooter();
      setTimeout(spawnCustomer, 1900);
    } else {
      document.getElementById("strikes").innerText = "Wrong! Strikes: " + strikes + "/" + MAX_STRIKES;
      status.innerText = "Wrong item! Try again.";
      status.className = "wrong";
    }
  }
}

function updateFooter() {
  document.getElementById("served").innerText = "Served: " + CustomerData.totalServed;
  document.getElementById("earned").innerText = "Earned: $" + money;
  saveStats();
}

loadCookedInventory();
renderStock();
loadStats();
document.getElementById("money").innerText = "Money: $" + money;
updateFooter();
spawnCustomer();
