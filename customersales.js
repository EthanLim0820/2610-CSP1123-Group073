let money =0;
let currentCustomer = null;

let Pets = ["rabbit", "hamster", "guinea pig"];

let products = [
    { name: "Big Dry Feed", wetness: "dry", size: "big", price: 12 },
    { name: "Small Dry Feed", wetness: "dry", size: "small", price: 10 },
    { name: "Big Wet Feed", wetness: "wet", size: "big", price: 14 },
    { name: "Small Wet Feed", wetness: "wet", size: "small", price: 11 },
];

function spawnCustomer() {
    let pet = pets[Math.floor(Math.random()* pets.length)];

    let pref = {
        wetness: pet === "rabbit" ? "dry" : "wet",
        size: pet === "hamster" ? "small" : "big"   
    };

    currentCustomer = {
        pet: pet,
        wetness: pref.wetness,
        size: pref.size
    };

    let orderDiv = document.getElementById("order");
    orderDiv.innerText = 
        pet + " wants " + pref.wetness + ", " + pref.size;

    showButtons();
}
function showButtons(){
    let btnDiv = document.getElementById("button");
    btnDiv.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let btn = document.createElement("button");

        btn.innerText =
            products[i].name + " ($" + products[i].price + ")";
        
        btn.onclick = function () {
            sell(products[i]);
        };

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

        setTimer(spawnCustomer, 1500);
    } else {
        status.innerText = "Wrong item!";
    }
}

spawnCustomer();