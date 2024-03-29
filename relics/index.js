let relicswrapper = document.getElementById("relics-wrapper");
let relicslist = JSON.parse(window.localStorage.getItem("relics"));
let examine = document.getElementById("examine");
let d = document.getElementById("document");
console.log(relicslist)
let showImg = (i) => {
    d.innerHTML = `
        <img class="examineimg" src="../game/assets/${i}.png">
    `
}

let currentpage = 1;
let currentrelic;
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let page = document.getElementById("page");

let examineState = false;

prev.onclick = (e) => {
    if(currentpage > 1) {
        currentpage--;
        showImg(relics[currentrelic].examine[currentpage-1]);
        updatePage();
    } else {

    }
}

next.onclick = (e) => {
    if(currentpage < relics[currentrelic].examine.length) {
        currentpage++;
        showImg(relics[currentrelic].examine[currentpage-1]);
        updatePage();
    } else {

    }
}

let updatePage = () => {
    let last = relics[currentrelic].examine.length;
    page.innerText = `${currentpage} / ${last}`
}

let examineRelic = (relic) => {
    if(examineState) {
        examine.close();
        examineState = !examineState;
    } else {
        currentrelic = relic;
        currentpage = 1;
        updatePage();
        showImg(relics[relic].examine[currentpage-1])
        examine.show();
        examineState = !examineState;
    }
}





let formatRelic = (relic) => {
    let r = document.createElement("div");
    r.classList.add("relic-wrapper");
    if(relic.canExamine) {
        r.addEventListener("click", () => examineRelic(relic.id));
        r.classList.add("canexamine");
    }
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




if(relics == undefined) {

} else {
    relicslist.forEach(relic => {
        // console.log(relics[relic.id])
        relicswrapper.appendChild(formatRelic(relics[relic.id]))
    })
}

document.getElementById("closeexamine").onclick = () => { examineRelic() }