let relicswrapper = document.getElementById("relics-wrapper");
let examine = document.getElementById("examine");
let examineState = false;
let examineRelic = (relic) => {
    if(examineState) {
        examine.close();
        examineState = !examineState;
    } else {
        examine.show();
        examineState = !examineState;
    }
    
}

let formatRelic = (relic) => {
    let r = document.createElement("div");
    r.classList.add("relic-wrapper");
    r.addEventListener("click", () => examineRelic(relic.id))
    r.innerHTML =
    `
        <div class="relic-img-wrapper"><img class="relic-img" src="../game/assets/${relic.id}.png"></div>
        <div class="relic-name">${relic.name}</div>
        <div class="relic-found">${relic.found}</div>
        <div class="relic-effect">${relic.effect}</div>
        <div class="relic-description">${relic.description}</div>
    `

    return r;
}



let relicslist = JSON.parse(window.localStorage.getItem("relics"));
if(relics == undefined) {

} else {
    relicslist.forEach(relic => {
        // console.log(relics[relic.id])
        relicswrapper.appendChild(formatRelic(relics[relic.id]))
    })
}