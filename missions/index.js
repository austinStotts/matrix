let missionlist = document.getElementById("missions-wrapper");
let missions = Object.keys(gametext.missions);
console.log(missions)

let missionclick = (i) => {
    let current = JSON.parse(window.localStorage.getItem("missiondata"));
    console.log(current);
    current.level = i;
    console.log(current);
    window.localStorage.setItem("missiondata", JSON.stringify(current));
    document.querySelector("body").classList.add("fadeout");
    setTimeout(() => {
        window.location = "../game/index.html"
    },3000)
}

let buildMission = (i, data) => {
    let m = document.createElement("div")
    m.addEventListener("click", () => {missionclick(i)});
    m.classList.add("mission");
    m.innerHTML = `
        <div class="title">mission ${i}</div>
        <div class="brief">${data.brief.join("<br>")}</div>
        <div class="intel"><img class="intel-img" src="../game/assets/plains.gif"></div>
    `

    return m;
}





missions.map((mission, i) => {
    missionlist.appendChild(buildMission(mission, gametext.missions[mission]));
})

// missionlist.innerHTML = a.join("");
