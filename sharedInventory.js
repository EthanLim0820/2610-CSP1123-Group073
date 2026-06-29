const AuthStore = {
    accountsKey: "miniPetsAccounts",
    activeAccountKey: "miniPetsActiveAccount",

    normalizeUsername(username) {
        return username.trim().toLowerCase();
    },

    getAccounts() {
        return JSON.parse(localStorage.getItem(this.accountsKey)) || {};
    },

    saveAccounts(accounts) {
        localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
    },

    createAccount(username, password) {
        const cleanUsername = this.normalizeUsername(username);

        if (!cleanUsername || !password) {
            return { ok: false, message: "Enter a username and password." };
        }

        const accounts = this.getAccounts();

        if (accounts[cleanUsername]) {
            return { ok: false, message: "That username already exists." };
        }

        accounts[cleanUsername] = {
            username: cleanUsername,
            password,
            createdAt: new Date().toISOString()
        };

        this.saveAccounts(accounts);
        this.setActiveAccount(cleanUsername);

        return { ok: true, message: "Account created." };
    },

    login(username, password) {
        const cleanUsername = this.normalizeUsername(username);
        const account = this.getAccounts()[cleanUsername];

        if (!account || account.password !== password) {
            return { ok: false, message: "Wrong username or password." };
        }

        this.setActiveAccount(cleanUsername);

        return { ok: true, message: "Logged in." };
    },

    logout() {
        sessionStorage.removeItem("farmReturnPosition");
        sessionStorage.removeItem(this.scopedSessionKey("farmReturnPosition"));
        localStorage.removeItem(this.activeAccountKey);
    },

    setActiveAccount(username) {
        localStorage.setItem(this.activeAccountKey, username);
    },

    getActiveAccount() {
        return localStorage.getItem(this.activeAccountKey);
    },

    isLoggedIn() {
        return Boolean(this.getActiveAccount());
    },

    requireLogin() {
        if (this.isLoggedIn()) return true;

        allowGamePageChange();
        window.location.href = "startup.html";
        return false;
    },

    scopedKey(key) {
        const account = this.getActiveAccount();
        return account ? `miniPets:${account}:${key}` : key;
    },

    scopedSessionKey(key) {
        const account = this.getActiveAccount();
        return account ? `miniPets:${account}:${key}` : key;
    },

    clearCurrentSave() {
        InventoryStore.clear();
        CookedInventoryStore.clear();
        MoneyStore.clear();
        StatsStore.clear();
        sessionStorage.removeItem(this.scopedSessionKey("farmReturnPosition"));
    }
};

const InventoryStore = {
    key: "inventory",

    getItems() {
        return JSON.parse(localStorage.getItem(AuthStore.scopedKey(this.key))) || [];
    },

    saveItems(items) {
        localStorage.setItem(AuthStore.scopedKey(this.key), JSON.stringify(items));
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
        localStorage.removeItem(AuthStore.scopedKey(this.key));
    }
};

const CookedInventoryStore = {
    key: "cookedInventory",

    getItems() {
        return JSON.parse(localStorage.getItem(AuthStore.scopedKey(this.key))) || [];
    },

    saveItems(items) {
        localStorage.setItem(AuthStore.scopedKey(this.key), JSON.stringify(items));
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
        localStorage.removeItem(AuthStore.scopedKey(this.key));
    }
};

const MoneyStore = {
    key: "money",
    startingMoney: 100,

    getMoney() {
        const savedMoney = localStorage.getItem(AuthStore.scopedKey(this.key));
        return savedMoney === null ? this.startingMoney : Number(savedMoney);
    },

    saveMoney(money) {
        localStorage.setItem(AuthStore.scopedKey(this.key), money);
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
        localStorage.removeItem(AuthStore.scopedKey(this.key));
    }
};

const StatsStore = {
    key: "petDiningStats",

    getStats() {
        return JSON.parse(localStorage.getItem(AuthStore.scopedKey(this.key))) || null;
    },

    saveStats(stats) {
        localStorage.setItem(AuthStore.scopedKey(this.key), JSON.stringify(stats));
    },

    clear() {
        localStorage.removeItem(AuthStore.scopedKey(this.key));
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
