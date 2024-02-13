console.log("hello");
let loadeddata = window.localStorage.getItem("missiondata");
if(loadeddata != undefined) {
    console.log(loadeddata);
} else {
    window.localStorage.setItem("missiondata", JSON.stringify({ level: 1, name: undefined }))
}