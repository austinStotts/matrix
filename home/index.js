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
let voice = document.getElementById("voice");

unlock.onclick = (e) => {
    window.localStorage.setItem("relics", JSON.stringify([{"id":"standard_issue"},{"id":"tape_measure"},{"id":"calculator"},{"id":"toothpaste"},{"id":"research_paper"},{"id":"neptunium"}]));
    window.localStorage.setItem("missiondata", JSON.stringify({"level":5}));
    window.localStorage.setItem("highestmissioncleared", 5);
}

reset.onclick = (e) => {
    window.localStorage.setItem("relics", JSON.stringify([{"id":"standard_issue"}]));
    window.localStorage.setItem("missiondata", JSON.stringify({"level":1}));
    window.localStorage.setItem("highestmissioncleared", 0);
}

let settings = JSON.parse(window.localStorage.getItem("settings"));
if(settings == undefined) {
    let s = {
        voice: true,
    }
    window.localStorage.setItem("settings", JSON.stringify(s));
    voice.checked = settings.voice;
} else {
    voice.checked = settings.voice;
}


voice.onclick = (e) => {
    let s = JSON.parse(window.localStorage.getItem("settings"));
    s.voice = voice.checked;
    window.localStorage.setItem("settings", JSON.stringify(s))
    // console.log(voice.checked)
}


