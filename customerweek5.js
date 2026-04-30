let money = 0;
let currentCustomer = null;
let strikes = 0;
const MAX_STRIKES = 3;

let CustomerData = {
  current: null,
  history: [],
  totalServed: 0
};

let pets = ["rabbit", "hamster", "guinea pig", "cat", "dog", "bird"];

let dialogues = {
  rabbit: ["My rabbit only eats dry food!", "Dry and big please, my bunny is hungry!", "Nothing wet for my rabbit!"],
  hamster: ["My little hamster needs something small!", "Small portions only, he's tiny!", "Don't give me anything big!"],
  "guinea pig": ["My guinea pig is starving!", "Big and wet, just how she likes it!", "Make it quick, she's squealing!"],
  cat: ["My cat is very picky, dry only!", "Small and dry, she won't eat anything else!", "My fussy cat demands dry food!"],
  dog: ["My dog eats everything, bring big wet food!", "He's a big boy, make it large and wet!", "Wet and big, he's been waiting all day!"],
  bird: ["My bird needs small wet seeds!", "Small and wet, just right for her beak!", "She only pecks at small wet food!"]
};

let products = [
  { name: "Big Dry Feed", wetness: "dry", size: "big", price: 12 },
  { name: "Small Dry Feed", wetness: "dry", size: "small", price: 10 },
  { name: "Big Wet Feed", wetness: "wet", size: "big", price: 14 },
  { name: "Small Wet Feed", wetness: "wet", size: "small", price: 11 },
];

function spawnCustomer() {
  strikes = 0;
  document.getElementById("strikes").innerText = "";

  let pet = pets[Math.floor(Math.random() * pets.length)];

  let pref = {
    wetness: (pet === "rabbit" || pet === "cat") ? "dry" : "wet",
    size: (pet === "hamster" || pet === "cat" || pet === "bird") ? "small" : "big"
  };

  currentCustomer = { pet, wetness: pref.wetness, size: pref.size };
  CustomerData.current = currentCustomer;

  let lines = dialogues[pet];
  let dialogue = lines[Math.floor(Math.random() * lines.length)];

  document.getElementById("order").innerText = pet + " wants " + pref.wetness + ", " + pref.size;
  document.getElementById("dialogue").innerText = '"' + dialogue + '"';

  let status = document.getElementById("status");
  status.innerText = "";
  status.className = "";

  showButtons();
}

function showButtons() {
  let btnDiv = document.getElementById("button");
  btnDiv.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let btn = document.createElement("button");
    btn.innerText = products[i].name + " ($" + products[i].price + ")";
    btn.onclick = function () { sell(products[i]); };
    btnDiv.appendChild(btn);
  }
}

function sell(product) {
  let status = document.getElementById("status");

  if (
    product.wetness === currentCustomer.wetness &&
    product.size === currentCustomer.size
  ) {
    money += product.price;
    document.getElementById("money").innerText = "Money: $" + money;

    status.innerText = "Correct! Sold " + product.name;
    status.className = "correct";

    CustomerData.history.push({ pet: currentCustomer.pet, sold: product.name, price: product.price });
    CustomerData.totalServed++;

    updateFooter();
    setTimeout(function () { spawnCustomer(); }, 1000);
  } else {
    strikes++;
    if (strikes >= MAX_STRIKES) {
      status.innerText = "Too many wrong items! Customer left.";
      status.className = "wrong";
      document.getElementById("strikes").innerText = "";
      CustomerData.history.push({ pet: currentCustomer.pet, sold: null, price: 0 });
      updateFooter();
      setTimeout(function () { spawnCustomer(); }, 1200);
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
}

spawnCustomer();