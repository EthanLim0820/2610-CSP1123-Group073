let money = 0;
let currentCustomer = null;

const customerPets = ["rabbit", "hamster", "guinea pig"];

const productCatalog = [
  { id: "dry_big", name: "Big Dry Feed", wetness: "dry", size: "big", price: 12 },
  { id: "dry_small", name: "Small Dry Feed", wetness: "dry", size: "small", price: 10 },
  { id: "wet_big", name: "Big Wet Feed", wetness: "wet", size: "big", price: 14 },
  { id: "wet_small", name: "Small Wet Feed", wetness: "wet", size: "small", price: 11 }
];

function getCustomerElements() {
  let root = document.getElementById("customer");

  if (!root) {
    root = document.createElement("div");
    root.id = "customer";
    document.body.appendChild(root);
  }

  let moneyEl = document.getElementById("moneyDisplay");
  if (!moneyEl) {
    moneyEl = document.createElement("div");
    moneyEl.id = "moneyDisplay";
    root.before(moneyEl);
  }

  let orderEl = document.getElementById("customerOrder");
  if (!orderEl) {
    orderEl = document.createElement("div");
    orderEl.id = "customerOrder";
    root.appendChild(orderEl);
  }

  let buttonsEl = document.getElementById("salesButtons");
  if (!buttonsEl) {
    buttonsEl = document.createElement("div");
    buttonsEl.id = "salesButtons";
    root.appendChild(buttonsEl);
  }

  let statusEl = document.getElementById("salesStatus");
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.id = "salesStatus";
    root.appendChild(statusEl);
  }

  return { root, moneyEl, orderEl, buttonsEl, statusEl };
}

function updateMoneyDisplay() {
  const { moneyEl } = getCustomerElements();
  moneyEl.innerText = "Money: $" + money;
}

function getPreferencesForPet(pet) {
  return {
    wetness: pet === "rabbit" ? "dry" : "wet",
    size: pet === "hamster" ? "small" : "big"
  };
}

function spawnCustomer() {
  const pet = customerPets[Math.floor(Math.random() * customerPets.length)];
  const pref = getPreferencesForPet(pet);

  currentCustomer = {
    pet: pet,
    wetness: pref.wetness,
    size: pref.size
  };

  renderCustomerUI();
}

function renderCustomerUI() {
  const { orderEl, buttonsEl, statusEl } = getCustomerElements();

  if (!currentCustomer) {
    orderEl.innerText = "No customer is waiting.";
    buttonsEl.innerHTML = "";
    statusEl.innerText = "";
    return;
  }

  orderEl.innerText =
    currentCustomer.pet +
    " wants " +
    currentCustomer.wetness +
    ", " +
    currentCustomer.size +
    " food.";

  buttonsEl.innerHTML = "";

  productCatalog.forEach((product) => {
    const button = document.createElement("button");
    button.innerText = product.name + " ($" + product.price + ")";
    button.onclick = () => sellToCustomer(product.id);
    buttonsEl.appendChild(button);
  });

  statusEl.innerText = "Choose an item to sell.";
}

function sellToCustomer(productId) {
  const { statusEl } = getCustomerElements();

  if (!currentCustomer) {
    statusEl.innerText = "There is no customer right now.";
    return;
  }

  const product = productCatalog.find((item) => item.id === productId);
  if (!product) {
    statusEl.innerText = "That item does not exist.";
    return;
  }

  const correctOrder =
    product.wetness === currentCustomer.wetness &&
    product.size === currentCustomer.size;

  if (!correctOrder) {
    statusEl.innerText =
      currentCustomer.pet + " does not want " + product.name + ".";
    return;
  }

  money += product.price;
  statusEl.innerText =
    "Sold " +
    product.name +
    " to the " +
    currentCustomer.pet +
    " for $" +
    product.price +
    ".";

  currentCustomer = null;
  updateMoneyDisplay();

  setTimeout(() => {
    spawnCustomer();
  }, 1500);
}

updateMoneyDisplay();
spawnCustomer();
