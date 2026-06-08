const bgMusic = new Audio("audio/shopMusic.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

const buySound = new Audio("audio/buy.mp3");
buySound.volume = 0.5;

document.addEventListener("click", () => {

    if (bgMusic.paused) {
        bgMusic.play();
    }

}, { once: true });

let money =
Number(localStorage.getItem("money")) || 100;

let inventory =[] 
inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const shopItems = [
    { name: "Fish", price: 10 },
    { name: "Meat", price: 25 },
    { name: "Carrot", price: 20 },
    { name: "Corn", price: 10 },
    { name: "Seed", price: 20 },
    { name: "Lettuce", price: 15 }, 
    { name: "Wheat", price: 10 }, 
    { name: "Grass", price: 10 }
];

document.getElementById("moneyText").innerText = "Money: " + money;

showInventory()

function buyItem(itemName) {

    const item = shopItems.find(i => i.name === itemName);

    if (money >= item.price) {

        buySound.currentTime = 0;
        buySound.play();

        money -= item.price;
        inventory.push(item.name);

        localStorage.setItem( "inventory", JSON.stringify(inventory) );
        localStorage.setItem( "money", money );

        showInventory();

        localStorage.setItem(
            "inventory",
            JSON.stringify(inventory)
    );

    localStorage.setItem(
        "money", 
        money
    );

        showInventory();

        document.getElementById("moneyText").innerText =
        "Money: " + money;

        document.getElementById("resultText").innerText =
        "You bought " + item.name;

    } else {

        document.getElementById("resultText").innerText =
        "Not enough money!";

    }
}

function showInventory(){
    const inventoryBox = document.getElementById("inventoryBox");

    inventoryBox.innerHTML = "";

    let itemCount = {};

    for(let item of inventory){
        if(itemCount[item]){ 
            itemCount[item]++;

            } else {
                 itemCount[item] =1;
    }
}

for(let item in itemCount){

    let imageName = item.toLowerCase();
    inventoryBox.innerHTML += `
        <div class="item-box">

            <img
                    src="image/${imageName}.png"
                    alt="${item}"
                    class="item-image"
            >
            <h3>${item}</h3>

            <p>Amount: ${itemCount[item]}</p>

        </div>
        `;
    } 
}

function toggleMusic() {

    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

function resetGame(){

    localStorage.clear();

    location.reload();
}