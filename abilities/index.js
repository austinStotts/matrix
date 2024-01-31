let a1w = document.getElementById("ac-1");
let a2w = document.getElementById("ac-2");
let a3w = document.getElementById("ac-3");

let _a = {

}

let currentSelection = {
    1: undefined,
    2: undefined,
    3: undefined
}

let save = (e) => {
    if(_a[1] && _a[1] && _a[1]) {
        window.localStorage.setItem("abilities", JSON.stringify(_a));
    }
}

let clickAbility = (a, i) => {
    console.log(a,i)
    let [n, c] = [a.id.split("-")[1],a.id.split("-")[2]];
    
    if(currentSelection[c]) { currentSelection[c].classList.remove("selected") }
    currentSelection[c] = a;
    a.classList.add("selected")
    _a[c] = n; 
    console.log(_a)
}

let formatAbility = (a) => {
    return (`
    <div class="ability-label"><span class="ability-label-name">${a.name}</span><span class="ability-label-class acc">${a.abilityClass}</span></div>
    <div class="ability-icon"></div>
    <div class="ability-data">
        <div class="ability-data-cost"><span class="ability-data-label">cost</span><span class="ability-data-value adc-${a.cost}">${a.cost}</span></div>
        <div class="ability-data-type"><span class="ability-data-label">type</span><span class="ability-data-value adv-text">${a.type}</span></div>
        <div class="ability-data-damage"><span class="ability-data-label">damage</span><span class="ability-data-value adc-${a.damage}">${a.damage}</span></div>
        <div class="ability-data-distance"><span class="ability-data-label">max distance</span><span class="ability-data-value">${a.maxDistance == -1 ? `<span class="infinity">∞</span>` : `<span class="max-distance-data">${a.maxDistance} </span>`}</span></div>
    </div>
    <div class="ability-info">${a.info}</div>
    `)
}

let listAbilities = () => {
    for(let i = 0; i < abilities.length; i++) {
        let x = new abilities[i];
        let a = document.createElement("div");
        a.classList.add("ability-box", "available");
        a.id = `a-${i}-${x.abilityClass}`
        a.addEventListener("click", (e) => { clickAbility(a, i) })
        a.innerHTML = formatAbility(x)
        
        if(x.abilityClass == 1) {
            a1w.appendChild(a);
        } else if(x.abilityClass == 2) {
            a2w.appendChild(a);
        } else if(x.abilityClass == 3) {
            a3w.appendChild(a);
        } else {

        }
    }
    
}

listAbilities();
document.getElementById("a-save").addEventListener("click", save)