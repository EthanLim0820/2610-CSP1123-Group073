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

        console.log("You bought " + item.name);
        console.log("Money left: " + money);

    } else {

        console.log("Not enough money!");

    }
}