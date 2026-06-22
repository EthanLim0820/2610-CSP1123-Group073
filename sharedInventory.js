const InventoryStore = {
    key: "inventory",

    getItems() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    saveItems(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
    },

    addItem(itemName) {
        const items = this.getItems();
        items.push(itemName);
        this.saveItems(items);
    },

    removeItem(itemName) {
        const items = this.getItems();
        const index = items.indexOf(itemName);

        if (index === -1) {
            return false;
        }

        items.splice(index, 1);
        this.saveItems(items);
        return true;
    },

    hasItem(itemName) {
        return this.getItems().includes(itemName);
    },

    countItems() {
        const itemCount = {};

        for (const item of this.getItems()) {
            itemCount[item] = (itemCount[item] || 0) + 1;
        }

        return itemCount;
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

const MoneyStore = {
    key: "money",
    startingMoney: 100,

    getMoney() {
        const savedMoney = localStorage.getItem(this.key);
        return savedMoney === null ? this.startingMoney : Number(savedMoney);
    },

    saveMoney(money) {
        localStorage.setItem(this.key, money);
    },

    addMoney(amount) {
        const money = this.getMoney() + amount;
        this.saveMoney(money);
        return money;
    },

    spendMoney(amount) {
        const money = this.getMoney();

        if (money < amount) {
            return false;
        }

        this.saveMoney(money - amount);
        return true;
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

const refreshWarningMessage = "You will lose every data once you refresh.";
let gamePageChangeAllowed = false;

function allowGamePageChange() {
    gamePageChangeAllowed = true;
}

function goToGamePage(page) {
    allowGamePageChange();
    window.location.href = page;
}

window.addEventListener("beforeunload", (event) => {
    if (gamePageChangeAllowed) return;

    event.preventDefault();
    event.returnValue = refreshWarningMessage;
});
