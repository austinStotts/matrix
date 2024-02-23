console.log("hello");
let loadeddata = window.localStorage.getItem("missiondata");
let hm = window.localStorage.getItem("highestmissioncleared");
if(hm != undefined) {

} else {
    hm = 0;
    window.localStorage.setItem("higherstmission", hm);
}

if(loadeddata != undefined) {
    // console.log(loadeddata);
    window.localStorage.setItem("missiondata", JSON.stringify({ level: Number(hm)+1, name: undefined }))

} else {
    window.localStorage.setItem("missiondata", JSON.stringify({ level: Number(hm)+1, name: undefined }))
}

let relics = window.localStorage.getItem("relics");
if(relics == undefined) {
    window.localStorage.setItem("relics", JSON.stringify([{id:"standard_issue"}]))
} else {
    
}










let unlock = document.getElementById("unlockall");
let reset = document.getElementById("reset");

unlock.onclick = (e) => {
    window.localStorage.setItem("relics", JSON.stringify([{"id":"standard_issue"},{"id":"tape_measure"},{"id":"calculator"},{"id":"toothpaste"},{"id":"research_paper"}]));
    window.localStorage.setItem("missiondata", JSON.stringify({"level":4}));
    window.localStorage.setItem("highestmissioncleared", 4);
}

reset.onclick = (e) => {
    window.localStorage.setItem("relics", JSON.stringify([{"id":"standard_issue"}]));
    window.localStorage.setItem("missiondata", JSON.stringify({"level":1}));
    window.localStorage.setItem("highestmissioncleared", 0);
}


