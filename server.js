let express = require("express");
let cors = require("cors")
let app = express();

app.use(cors());

app.use(express.static("./game/"))

app.listen(5000, () => { console.log("[matrix] roger roger 5000") })