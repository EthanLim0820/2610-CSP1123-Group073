let money = 100;

const shopItems = [
    { name: "Fish", price: 10 },
    { name: "Meat", price: 25 },
    { name: "Carrot", price: 20 }
];

function buyItem(itemName) {

    const item = shopItems.find(i => i.name === itemName);

    if (money >= item.price) {

        money -= item.price;

        document.getElementById("moneyText").innerText =
        "Money: " + money;

        document.getElementById("resultText").innerText =
        "You bought " + item.name;

    } else {

        document.getElementById("resultText").innerText =
        "Not enough money!";

    }
}