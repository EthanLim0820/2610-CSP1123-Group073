let money =0;

function spawnCustomer() {
    let pets = ["rabbit" , "hamster" , "guinea pig"];
    let pet = pets[Math.floor(Math.random()*3)];

    let pref = {
        wetness: pet === "rabbit" ? "dry" : "wet",
        size: pet === "hamster" ? "small" : "big"
    };

    let div = document.createElement("div");
    div.innerText = pet + " wants " + pref.wetness + ", " + pref.size;

    document.getElementById("customer").appendChild(div);
}