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

let pets = ["rabbit", "hamster", "guinea pig", "cat", "dog", "bird", "horse", "duck"];

let dialogues = {
  rabbit:       ["My rabbit only eats dry food!", "Dry and big please, my bunny is hungry!", "Nothing wet for my rabbit!"],
  hamster:      ["My little hamster needs something small!", "Small portions only, he's tiny!", "Don't give me anything big!"],
  "guinea pig": ["My guinea pig is starving!", "Big and wet, just how she likes it!", "Make it quick, she's squealing!"],
  cat:          ["My cat is very picky, dry only!", "Small and dry, she won't eat anything else!", "My fussy cat demands dry food!"],
  dog:          ["My dog eats everything, bring big wet food!", "He's a big boy, make it large and wet!", "Wet and big, he's been waiting all day!"],
  bird:         ["My bird needs small wet seeds!", "Small and wet, just right for her beak!", "She only pecks at small wet food!"],
  horse:        ["My horse only eats big grain feed!", "He's a big fella, needs his dry grain!", "Nothing but big grain for my stallion!"],
  duck:         ["My duck loves her wet mix!", "Small and wet, just how she waddles for it!", "Quack! She wants the small wet mix!"],
};

let products = [
  { name: "Big Dry Feed",   size: "big",   wetness: "dry",   price: 120, spriteClass: "sprite-0-0" },
  { name: "Small Dry Feed", size: "small", wetness: "dry",   price: 100, spriteClass: "sprite-1-0" },
  { name: "Big Wet Feed",   size: "big",   wetness: "wet",   price: 140, spriteClass: "sprite-2-0" },
  { name: "Small Wet Feed", size: "small", wetness: "wet",   price: 110, spriteClass: "sprite-0-1" },
  { name: "Big Grain Feed", size: "big",   wetness: "grain", price: 130, spriteClass: "sprite-1-1" },
  { name: "Small Mix Feed", size: "small", wetness: "mix",   price: 120, spriteClass: "sprite-2-1" },
];

let stock = {};

function loadStock() {
  const saved = localStorage.getItem("petDiningStock");
  if (saved) {
    stock = JSON.parse(saved);
  } else {
    products.forEach(p => stock[p.name] = 10);
  }
}

function saveStock() {
  localStorage.setItem("petDiningStock", JSON.stringify(stock));
}

function renderStock() {
  const list = document.getElementById("inv-list");
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    const qty = stock[p.name] !== undefined ? stock[p.name] : 10;
    li.textContent = p.name + ": " + qty;
    li.style.color = qty === 0 ? "#c62828" : "";
    list.appendChild(li);
  });
}

function resetStock() {
  products.forEach(p => stock[p.name] = 10);
  saveStock();
  renderStock();
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

function showRating(rating, tipped) {
  let ratingDiv = document.getElementById("rating");
  let html = "Customer rated: " + renderStars(rating);
  if (tipped) html += ' <span class="tip">+$3 tip!</span>';
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
    rabbit:       { size: "big",   wetness: "dry"   },
    hamster:      { size: "small", wetness: "dry"   },
    "guinea pig": { size: "big",   wetness: "wet"   },
    cat:          { size: "small", wetness: "dry"   },
    dog:          { size: "big",   wetness: "wet"   },
    bird:         { size: "small", wetness: "wet"   },
    horse:        { size: "big",   wetness: "grain" },
    duck:         { size: "small", wetness: "mix"   },
  };

  const pref = prefMap[pet];
  currentCustomer = { pet, wetness: pref.wetness, size: pref.size };
  CustomerData.current = currentCustomer;

  const line = dialogues[pet][Math.floor(Math.random() * dialogues[pet].length)];

  setTimeout(function () {
    document.getElementById("dialogue").innerText = '"' + line + '"';
    document.getElementById("order").innerText = pet + " wants: " + pref.wetness + ", " + pref.size;
    document.getElementById("customer-info").classList.add("visible");

    setTimeout(function () {
      buildProductButtons();
      document.getElementById("mode-selector").classList.add("visible");
    }, 600);

  }, 300);
}

function buildProductButtons() {
  const btnDiv = document.getElementById("button");
  btnDiv.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    const btn = document.createElement("button");
    btn.className = "prod-btn";

    const imgWrap = document.createElement("div");
    imgWrap.className = "prod-img-wrap";

    const img = document.createElement("div");
    img.className = "prod-img " + p.spriteClass;
    imgWrap.appendChild(img);

    const nameSpan = document.createElement("span");
    nameSpan.innerText = p.name;

    const priceSpan = document.createElement("span");
    priceSpan.className = "prod-price";
    priceSpan.innerText = "$" + p.price;

    btn.appendChild(imgWrap);
    btn.appendChild(nameSpan);
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

  if (stock[product.name] <= 0) {
    const status = document.getElementById("status");
    status.innerText = "Out of stock!";
    status.className = "wrong";
    return;
  }

  const status = document.getElementById("status");
  const correct =
    product.wetness === currentCustomer.wetness &&
    product.size    === currentCustomer.size;

  if (correct) {
    money += product.price;

    if (streak < 5) streak++;
    updateStreakBar();

    const rating = getRating(strikes, false);
    const tipped = rating === 5;
    if (tipped) money += 3;

    document.getElementById("money").innerText = "Money: $" + money;
    showRating(rating, tipped);

    const modeLabel = currentMode === "delivery" ? " (delivered)" : "";
    status.innerText = "Correct! Sold " + product.name + modeLabel;
    status.className = "correct";

    if (stock[product.name] > 0) stock[product.name]--;
    saveStock();
    renderStock();

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

loadStock();
renderStock();
loadStats();
document.getElementById("money").innerText = "Money: $" + money;
updateFooter();
spawnCustomer();