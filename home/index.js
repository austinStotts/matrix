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