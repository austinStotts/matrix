


 


let ttwrapper = document.getElementById("typedtext-wrapper");
let tthandler = document.getElementById("handlerimg");
let ttbody = document.getElementById("typedtext");
console.log(window)

opts = {
    debug: 0,
    pitch: 120,
    speed: 100,
    mouth: 128,
    throat: 128,
  };

let sam = new SamJs(opts);
// sam.setVolume(0.2)
console.log(sam)



let showMessage = (mission, state, goHome=false) => {

    let CONTEXT = new AudioContext();

    let speak = (string) => {
        // console.log(sam)
        let b = sam.speak(string)
        // let b = sam.buf8(string);
        console.log(b)
    }




    console.log(mission)
    let aText;
    if(state == "opening") {
        aText = mission.opening;
    } else if(state == "closing") {
        aText = mission.closing;
    } else if(state == "failure") {
        aText = mission.failure;
    }

    let iSpeed = 100; // time delay of print out
    let iIndex = 0; // start printing array at this posision
    let iArrLength = aText[0].length; // the length of the text array
    let iScrollAt = 3; // start scrolling up at this many lines
        
    let iTextPos = 0; // initialise text position
    let sContents = ''; // initialise contents letiable
    let iRow; // initialise current row
    

        
    function typewriter() {
        // console.log("hello")
        sContents = " ";
        iRow = Math.max(0, iIndex - iScrollAt);
        

        while (iRow < iIndex) {
            sContents += aText[iRow++] + "<br />";
        }
        ttbody.innerHTML =
        sContents + aText[iIndex].substring(0, iTextPos) + "_";
        if (iTextPos++ == iArrLength) {
            iTextPos = 0;
            iIndex++;
            if (iIndex != aText.length) {
                iArrLength = aText[iIndex].length;
                setTimeout(() => {typewriter(); if(aText[f] != undefined) {speak(aText[f]); f++}}, 500);
                
            } else {
                // runs at the end of message
                setTimeout(() => {
                    ttwrapper.classList.add("fadeout-t");
                    setTimeout(() => {
                        ttwrapper.classList.add("hidden-t");
                        ttwrapper.classList.remove("fadeout-t");
                        playerCanAct = true;
                        ttbody.innerHTML = "";
                        if(goHome) {
                            setTimeout(() => {
                                window.location.href = "../home/index.html";
                            }, 500)
                        }
                    }, 950)
                },1000)
            }
        } else {
            setTimeout(typewriter, iSpeed);
            
        }
    }

    tthandler.innerText = mission.handler
    ttwrapper.classList.remove("hidden-t");
    typewriter();
    let f = 0;
    speak(aText[f]);
    f++

    // let index = 0;
    // sam.speak(aText[index]);
    // setInterval(() => {
    //     sam.speak(aText[index]); 
    // }, interval);
}
    
    
    























// fix enemy projectiles to hit first cell infront of them
// add this.blocksMovement to all construct cells

let findSlope = (r1,c1,r2,c2) => {
    return Math.ceil((r2-r1)-(c2-c1))
}

let getDirection = (dr, dc) => {
    if(dr == -1) {
        return "up"
    } else if(dr == 1) {
        return "down"
    } else if(dc == -1) {
        return "left"
    } else if(dc == 1) {
        return "right"
    } else {

    }
}

let checkForConstruct = (r,c) => {
    let blocks = false;
    Object.keys(matrix[r][c].children).forEach((key) => {
        if(matrix[r][c].children[key].type == "construct") {
            if(matrix[r][c].children[key].blocksMovement) {
                blocks = true;
            }
        }
    })
    return blocks;
}

let checkAroundCell = (r, c) => {
    let cc = [[r-1,c],[r-1,c+1],[r,c+1],[r+1,c+1],[r+1,c],[r+1,c-1],[r,c-1],[r-1,c-1]];
    for(let i = 0; i < cc.length; i++) {
        if(checkForBoundry(cc[i][0], cc[i][1]) && checkIfPlayer(cc[i][0], cc[i][1])) {
            console.log("FOUND EDGE OR PLAYER AT: ", cc[i][0], cc[i][1])
        }
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

let checkIfPlayer = (r,c) => {
    let isPlayer = false;
    Object.keys(matrix[r][c].children).forEach((key) => {
        if(matrix[r][c].children[key].type == "player") {
            // contains players
            isPlayer = true;
        }
    })
    return isPlayer;
}

let checkIfEnemy = (r,c) => {
    let isEnemy = false;
    Object.keys(matrix[r][c].children).forEach((key) => {
        if(matrix[r][c].children[key].type == "enemy") {
            // contains players
            isEnemy = true;
        }
    })
    return isEnemy;
}



let getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let generateName = () => {
    names = ["tom", "bill", "roger", "fox", "zero", "gabby", "lenny", "gus", "arlo", "nora", "noland", "ethan", "paul"]
    return (names[Math.floor(Math.random()*names.length)])
}


// _________________________________________________
// cell and damage calculations


let calculateDamage = (a, b) => {
    // a is dealing damage to b
    // constructs are resistant to standard damage
    console.log("A: ",a)
    console.log("B: ",b)
}

let damageConstructs = (r,c,damage) => {
    Object.keys(matrix[r][c].children).forEach(key => {
        if(matrix[r][c].children[key].type == "construct") {
            matrix[r][c].children[key].takeDamage(damage);
            markForUpdate(r,c)
        }
    })
}

let damagePlayers = (r,c,damage) => {
    Object.keys(matrix[r][c].children).forEach(key => {
        if(matrix[r][c].children[key].type == "player" || matrix[r][c].children[key].type == "enemy") {
            matrix[r][c].children[key].takeDamage(damage);
        }
    })
}

let calculateCell = (r, c) => {
    console.log("calculate")
    let projectiles = [];
    let constructs = [];
    let players = [];
    let enemies = [];
    Object.keys(matrix[r][c].children).forEach(key => {

        if(matrix[r][c].children[key].type == "projectile") {
            projectiles.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "construct") {
            constructs.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "player") {
            players.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "enemy") {
            enemies.push(matrix[r][c].children[key]);
        }
    })



    if(constructs.length > 0 && projectiles.length > 0) {
        constructs.forEach((construct, i) => {
            projectiles.forEach((projectile, i) => {
                if(construct.owner == projectile.owner) {
                    //do nothing
                } else {
                    construct.takeDamage(projectile.damage);
                }
            })
        })
    }

    if(players.length > 0 && projectiles.length > 0) {
        players.forEach((player, i) => {
            projectiles.forEach((projectile, i) => {
                if(player.name == projectile.owner) {
                    //do nothing
                } else {
                    player.takeDamage(projectile.damage);
                }
            })
        })
    }

    if(constructs.length > 0 || players.length > 0) {
        projectiles.forEach(p => { p.delete = true; })
    }

    
}

let calculateTiles = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            Object.keys(matrix[i][j].children).forEach((key) => {
                if(matrix[i][j].children[key].type == "player" || matrix[i][j].children[key].type == "enemy") {
                    // contains players
                    if(matrix[i][j].tile.dot > 0) { matrix[i][j].children[key].takeDamage(matrix[i][j].tile.dot) }
                }
            })
            matrix[i][j].tile.currentDecay += matrix[i][j].tile.decay;
            if(matrix[i][j].tile.currentDecay >= matrix[i][j].tile.maxDecay) {
                matrix[i][j].tile = new Plains();
            }
        }
    }
}

// add decay to tiles for things like constructs and biomes
// also change the meteor to break if used on a player
// _____________________________________________________





let matrix_wrapper = document.getElementById("matrix");




let animatePlayerMove = (r, c) => {
    // let cell = document.getElementById(`r${r}c${c}`);
    // cell.classList.add("playermove");
    // setTimeout(() => {
    //     cell.classList.remove("playermove")
    // }, 300)
}





// _________________________________________________________
// log events

let logw = document.getElementById("info-log");
let anchor = document.getElementById("anchor");
let logid = 1;
let addLog = (log) => {
    let l = document.createElement("div");
    l.classList.add("log-row")
    l.innerHTML = `<span class="log-id ${logid % 2 == 0 ? "log-even" : "log-odd"}">${logid}</span><span class="log-player">${log.name}</span><span class="log-content ${log.type}">${log.content}</span>`
    logw.insertBefore(l, anchor);
    logid++;
}

logw.scroll(0, 100);

// ____________________________________________________________



// player inputs


let keyEvent = (e) => {
    if(e.key == ".") { playerCanAct = !playerCanAct }
    if(playerCanAct) {
        if(PLAYER.gameIndex == _activePlayer) {
            if(inputMethod == "movement") {
                switch (e.key) {
                    case "w":
                        movePlayer(PLAYER.row-1, PLAYER.column);
                        break;
                    case "a":
                        movePlayer(PLAYER.row, PLAYER.column-1);
                        break;
                    case "s":
                        movePlayer(PLAYER.row+1, PLAYER.column);
                        break;
                    case "d":
                        movePlayer(PLAYER.row, PLAYER.column+1);
                        break;
                    case " ":
                        PLAYER.endTurn();
                        break
                    case "f":
                        PLAYER.ability(1);
                        break
                    case "e":
                        PLAYER.ability(2);
                        break
                    case "q":
                        PLAYER.ability(3);
                        break
                    default:
                        break;
                }
            } else if(inputMethod == "ability") {
                switch (e.key) {
                    case "w":
                        PLAYER.useAbility(-1, 0);
                        break;
                    case "a":
                        PLAYER.useAbility(0, -1);
                        break;
                    case "s":
                        PLAYER.useAbility(1, 0);
                        break;
                    case "d":
                        PLAYER.useAbility(0, 1);
                        break;
                    case "f":
                        if(PLAYER.selectedAbility == 1) { PLAYER.ability(); inputMethod = "movement"; updateLabels(); showSelectedAbility(0); removeGridlines(); }
                        break
                    case "e":
                        if(PLAYER.selectedAbility == 2) { PLAYER.ability(); inputMethod = "movement"; updateLabels(); showSelectedAbility(0); removeGridlines(); }
                        break
                    case "q":
                        if(PLAYER.selectedAbility == 3) { PLAYER.ability(); inputMethod = "movement"; updateLabels(); showSelectedAbility(0); removeGridlines(); }
                        break
                    default:
                        break;
                }
            }
        }
    }
}
document.addEventListener("keydown", keyEvent);

let helpdialog = document.getElementById("game-help-dialog");
let helpdialogIsHidden = true;

let gamehelp = (e) => {
    if(helpdialogIsHidden) {
        helpdialog.show();
        helpdialogIsHidden = !helpdialogIsHidden;
    } else {
        helpdialog.close();
        helpdialogIsHidden = !helpdialogIsHidden;
    }
}

document.getElementById("togglehelp").addEventListener("click", gamehelp);
document.getElementById("closehelp").addEventListener("click", gamehelp);

let showGridLines = (r, c) => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            if(i == r || j == c) {
                matrix[i][j].children.gridlines = new Gridline()
            } 
        }
    }
}

let removeGridlines = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            delete matrix[i][j].children.gridlines;
        }
    }
}




let idToCord = (id) => {
    let row = id.split("r")[1].split("c")[0];
    let column = id.split("r")[1].split("c")[1];

    return [row, column]
}

let cellClick = (e) => {
    if(inputMethod == "ability" && PLAYER[`ability${PLAYER.selectedAbility}`].allowClick) {
        let [row, column] = idToCord(e.target.id);
        PLAYER.useAbility(Number(row), Number(column));
    }
}




let childFormatter = (node) => {
    return (`<div class="child-line-tt"><span class="child-type-tt ${node.type}-tt">${node.type}</span> <span class="child-name-tt">${node.name}</span> <span class="child-hp-tt">${node.hp}</span></div>`)
}

let relicFormatter = (node) => {
    return (`<div class="child-line-tt"><span class="child-type-tt relic-tt">relic</span> <span class="child-name-tt">${node.id.split("_").join(" ")}</span></div>`)
}

let cellHover = (e) => {
    let t = document.createElement("div");
    let [row, column] = idToCord(e.target.id);

    t.id = `r${row}c${column}-tt`
    t.classList.add("cell-tooltip");
    t.style.left = (e.target.offsetLeft + 32) + "px";
    t.style.top = (e.target.offsetTop) + "px";
    t.innerHTML = `
        <div class="cordinates">X <span class="x-cord">${column}</span> Y <span class="y-cord">${row}</span> <span class="tile-label-tt ${matrix[row][column].tile.name}-tt">${matrix[row][column].tile.dot ? '<span class="mc-dot-tt">'+ matrix[row][column].tile.dot + '</span>' : ""}<span class="mc-tt">${matrix[row][column].tile.movementCost}</span>${matrix[row][column].tile.name}</span></div>
        <div class="cell-children-tt">
            ${Object.keys(matrix[row][column].children).map((key) => { return (childFormatter(matrix[row][column].children[key])) }).join(`<div class="children-break-tt"></div>`)}
            ${matrix[row][column].relic ? checkForConstruct(row, column) ? "" : relicFormatter(matrix[row][column].relic) : ""}
        </div>`
    e.target.parentElement.appendChild(t)
}

let cellLeave = (e) => {
    let row = e.target.id.split("r")[1].split("c")[0];
    let column = e.target.id.split("r")[1].split("c")[1];
    let c = document.getElementById(`r${row}c${column}-tt`);
    e.target.parentElement.removeChild(c)
}

// ____________________________________________________
// ability boxes

let ab1 = document.getElementById("ab-1");
let ab2 = document.getElementById("ab-2");
let ab3 = document.getElementById("ab-3");

let classIndex = ["x", "F", "E", "Q"]

let formatAbility = (a) => {
    return (`
    <div id="as-${a.abilityClass}" class="ability-label"><span class="ability-label-name">${a.name}</span><span class="ability-label-class acc">${classIndex[a.abilityClass]}</span></div>
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

let createAbilityBox = (n, ability) => {
    if(n == 1) {
        ab1.innerHTML = formatAbility(ability);
    } else if (n == 2) {
        ab2.innerHTML = formatAbility(ability);
    } else if (n == 3) {
        ab3.innerHTML = formatAbility(ability);
    } else {
        console.log("invalid ability number")
    }
}

let showAvailableAbilities = () => {
    let options = PLAYER.canAct();
    ab1.classList.remove("available");
    ab2.classList.remove("available");
    ab3.classList.remove("available");
    options.forEach(n => {
        if(n == 1) {
            ab1.classList.add("available");
        } else if (n == 2) {
            ab2.classList.add("available");
        } else if (n == 3) {
            ab3.classList.add("available");
        } else {
            console.log("invalid ability number")
        }
    })
}

let showSelectedAbility = (n) => {
    let options = PLAYER.canAct();
    ab1.classList.remove("ab-selected");
    ab2.classList.remove("ab-selected");
    ab3.classList.remove("ab-selected");
    if(n == 1) {
        ab1.classList.add("ab-selected");
    } else if (n == 2) {
        ab2.classList.add("ab-selected");
    } else if (n == 3) {
        ab3.classList.add("ab-selected");
    } else {
        // console.log("invalid ability number")
    }
}


// __________________________________________________
// matrix creation and management

let makeMatrix = (n, tile) => {
    class Cell {
        constructor (r, c) {
            this.row = r;
            this.cell = c;
            this.class = ["cell"];
            this.children = {};
            this.tile = new tile();
            this.canvas = undefined;
            this.relic = null;
        }
    }

    let m = [];
    for(let i = 0; i < n; i ++) {
        let row = [];
        for(let j = 0; j < n; j++) {
            row.push(new Cell(i, j))
        }
        m.push(row)
    }
    return m;
}


// KONVA SETUP
let stage = new Konva.Stage({
    container: 'canvas',
    width: 376,
    height: 376,
});

let layer = new Konva.Layer();
stage.add(layer);

 
// add them to the matrix so they can be updated later
let drawCanvas = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {


            matrix[i][j].canvas = {
                x: 2+(j*32)+(j*2),
                y: 2+(i*32)+(i*2),
                needsUpdate: true,
                sprite: null
            }

            // let box = new Konva.Rect({
            //     x: 2+(j*32)+(j*2),
            //     y: 2+(i*32)+(i*2),
            //     width: 32,
            //     height: 32,
            //     opacity: 0,
            //     // fill: getRandomColor(),
            //     stroke: 'black',
            //     strokeWidth: 0,
            //     draggable: false,
            // });
            // matrix[i][j].canvas = box;
            // layer.add(box);
        
        }
    }
}

let playerimage = new Image();
playerimage.src = "./sprites/player.png";
let makePlayerImg = (x, y) => {
    let player_ = new Konva.Rect({
        x: x,
        y: y,
        width: 32,
        height: 32
    });

    player_.fillPatternImage(playerimage);

    return player_
}


let relicimg = new Image();
let loadRelic = (id) => {
    relicimg.src = `./assets/${id}.png`;
}
let makeRelicImg = (x, y, src) => {
    let relic_ = new Konva.Rect({
        x: x,
        y: y,
        width: 32,
        height: 32
    });

    relic_.fillPatternImage(relicimg);

    return relic_
}


let makeEnemyImg = (x, y) => {
    let a = [];
    seekerdata.frames.forEach(frame => {
        Object.keys(frame.frame).forEach(key => {
            a.push(frame.frame[key]);
        })
    })
    
    let animations = {
      idle: a
    };
    
    let enemyImg = new Image();
    enemyImg.src = '../game/sprites/seeker.png';
    let enemy_ = new Konva.Sprite({
        x: x,
        y: y,
        image: enemyImg,
        animation: 'idle',
        animations: animations,
        frameRate: 16,
        frameIndex: 0,
    });
    
    return enemy_;
}

let markForUpdate = (row, column) => {
    matrix[row][column].canvas.needsUpdate = true;
}


let updateCanvas = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {

            if(matrix[i][j].canvas.needsUpdate) {
                if(checkIfPlayer(i, j)) {
                    let image = makePlayerImg(matrix[i][j].canvas.x, matrix[i][j].canvas.y);
                    matrix[i][j].canvas.sprite = image;
                    layer.add(image);
                    // image.start();
                    matrix[i][j].canvas.needsUpdate = false;
                }
                else if(checkIfEnemy(i, j)) {
                    let image = makeEnemyImg(matrix[i][j].canvas.x, matrix[i][j].canvas.y);
                    matrix[i][j].canvas.sprite = image;
                    layer.add(image);
                    image.start();
                    matrix[i][j].canvas.needsUpdate = false;
                }
                else if(matrix[i][j].relic && !checkForConstruct(i,j)) {
                    let image = makeRelicImg(matrix[i][j].canvas.x, matrix[i][j].canvas.y);
                    matrix[i][j].relic.sprite = image;
                    layer.add(image);
                    matrix[i][j].canvas.needsUpdate = false;
                }
                else {
                    if(matrix[i][j].canvas.sprite != null) {
                        matrix[i][j].canvas.sprite.destroy();
                        matrix[i][j].canvas.sprite = null;
                    }
                    matrix[i][j].canvas.needsUpdate = false;
                }
            }





        }
    }
    layer.draw()
}



// create the html version of the matrix
let drawMatrix = (n) => {
    for(let i = 0; i < n; i++) {
        let row = document.createElement("div");
        row.id = `r${i}`;
        row.classList.add("row");
        for(let j = 0; j < n; j ++) {
            let cell = document.createElement("div");
            cell.id = `r${i}c${j}`;
            cell.classList.add("cell");
            cell.addEventListener("mouseover", cellHover);
            cell.addEventListener("mouseleave", cellLeave);
            cell.addEventListener("click", cellClick);
            row.appendChild(cell);
        }
        matrix_wrapper.appendChild(row);
    }
}

let setHighestMission = (n) => {
    window.localStorage.setItem("highestmissioncleared", n)
}

let checkForWinner = () => {
    if(PLAYER.hp <= 0) {
        playerCanAct = false;
        console.log("YOU LOSE");
        showMessage(gametext.missions[LEVEL], "failure", true);
        let old = JSON.parse(window.localStorage.getItem("missiondata"));
        old.level += 1;
        window.localStorage.setItem("missiondata", JSON.stringify(old))
    } else {
        let numberdead = 0;
        for(let i = 0; i < ENEMIES.length; i++) {
            if (ENEMIES[i].hp <= 0) {
                numberdead++
            }
        }
        if(numberdead == ENEMIES.length) {
            playerCanAct = false;
            console.log("YOU WIN");
            showMessage(gametext.missions[LEVEL], "closing", true);
            setHighestMission(LEVEL)
        }
    }
}

// only job is to make the visual matrix match the actual matrix
let compairMatrix = () => { 
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            let cell = document.getElementById(`r${i}c${j}`);
            let classname = 'cell';
            Object.keys(matrix[i][j].children).forEach(key => {
                if(matrix[i][j].children[key].delete) {
                    // do nothing
                } else {
                    classname = classname + " " + matrix[i][j].children[key].classname;
                    
                }
            })

            classname = classname + " " + matrix[i][j].tile.classname;
            cell.className = classname;
        }
    }
}

// delete all nodes that are to be deleted
let pruneMatrix = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            Object.keys(matrix[i][j].children).forEach(key => {
                if(matrix[i][j].children[key].delete) {
                    matrix[i][j].children[key].beforeDelete();
                    delete matrix[i][j].children[key];
                }
            })
        }
    }
}

// new idea
// when a projectile is used
// do all the calculations before
// and save each cell that the projectile moved through
// when all is figured out
// animate the cells effected

let calculateProjectile = (a, ir, ic, dr, dc) => {
    let cellsTraveled = [];
    let cr = ir+dr;
    let cc = ic+dc;
    let stop = false;
    while(!stop) {
        // console.log(matrix[cr][cc].canvas)
        if(cellsTraveled.length >= a.maxDistance && a.maxDistance != -1) {
            try { a.beforeDelete(cr,cc,cr-dr,cc-dc) } catch {}
            stop = true;
        }
        else if(!checkForBoundry(cr,cc)) { // just animate the movement then move on
            try { a.beforeDelete(cr,cc,cr-dr,cc-dc) } catch {}
            stop = true;
        } 
        else if(checkForConstruct(cr,cc)) { // animate the movement then damage the construct
            damageConstructs(cr,cc,a.damage);
            try { a.beforeDelete(cr,cc,cr-dr,cc-dc) } catch {}
            stop = true;
        }
        else if (checkIfPlayer(cr,cc)) { // animate the movement then damage the player
            damagePlayers(cr,cc,a.damage);
            try { a.beforeDelete(cr,cc,cr-dr,cc-dc) } catch {}
            stop = true;
        }
        else if (checkIfEnemy(cr,cc)) { // animate the movement then damage the player
            damagePlayers(cr,cc,a.damage);
            try { a.beforeDelete(cr,cc,cr-dr,cc-dc) } catch {}
            stop = true;
        } 
        else {
            cellsTraveled.push([cr,cc]);
            cr = cr+dr;
            cc = cc+dc;
        }


    }
    // cellsTraveled.push([cr,cc]);
    animateProjectile(cellsTraveled, dr, dc, a.imagename, a.speed);
    pruneMatrix();
}

let images = {
    shell: new Image(),
    terraform_alpha: new Image(),
    terraform_beta: new Image(),
    terraform_gamma: new Image(),
}
images.shell.src = "./assets/shell.png"
images.terraform_alpha.src = "./assets/shell.png"
images.terraform_beta.src = "./assets/shell.png"
images.terraform_gamma.src = "./assets/shell.png"

let animateProjectile = (cells, dr, dc, imagename, speed) => {
    if(cells.length > 1) {


        let data = []

        let r1 = cells[0][0];
        let c1 = cells[0][1];

        let r2 = cells[cells.length-1][0];
        let c2 = cells[cells.length-1][1];

        data.push({x: matrix[r1][c1].canvas.x, y: matrix[r1][c1].canvas.y});
        data.push({x: matrix[r2][c2].canvas.x, y: matrix[r2][c2].canvas.y});



        let path = new Konva.Path({
            x: 0,
            y: 0,
        });
        layer.add(path);

        var p = "M" + data[0].x + " " + data[0].y;
        for (var i = 1; i < data.length; i = i + 1){
        p = p + " L" + data[i].x + " " + data[i].y;
        }
        path.setData(p);



        var p = new Konva.Rect({ 
            x: data[0].x,
            y: data[0].y,
            width: 32,
            height: 32,
            opacity: 1,
            // fill: getRandomColor(),
            stroke: 'black',
            strokeWidth: 0,
            draggable: false,
        });
        p.fillPatternImage(images[imagename]);
        layer.add(p);

        let s = Math.abs(findSlope(r1,c1,r2,c2))*speed
        let steps = s // number of steps in animation
        let pathLen = path.getLength();
        let step = pathLen / steps;
        let frameCnt = 0, pos =0, pt;
    
        anim = new Konva.Animation(function(frame) {
            pos = pos + 1;
            pt = path.getPointAtLength(pos * step);
            p.position({x: pt.x, y: pt.y});
            if(pos > steps) {
                anim.stop();
                path.destroy();
                p.destroy();
                layer.draw();
            }   
        }, layer);
    
        anim.start();
    }

}

let drawAbility = (p, dr, dc, speed) => {    
    p.dr = dr;
    p.dc = dc;
    if(p.update != undefined) { p.update(dr, dc, p.row, p.column, p.id) }
    let x = setInterval(() => {
        pruneMatrix()
        let con = checkForBoundry(p.row + dr, p.column + dc);
        if(p != undefined) {
            if(!con || p.delete) { 
                p.delete = true;
                p.row = p.row + dr;
                p.column = p.column + dc;
                clearInterval(x); 
                pruneMatrix();
            } else {
                if(p.update != undefined) { p.update(dr, dc, p.row, p.column, p.id) }
                removefromCell(p.row, p.column, p.id);
    
    
                p.row = p.row + dr; 
                p.column = p.column + dc;
                
                
                addToCell(p.row, p.column, p);
            }
        }

    }, speed)
}

// i think i got the order of opper ations fixed...
// no more infinire loops
// now i want to finish moving all the abilities to the othe rjs file
// keep making new ones
// and make a log under the other info items to show what has happened

// add logs to all events

// ...
// the way this works now:
// or how i think it does
// everyframe the compair function runs to draw how the matrix looks
// every action should call the prune function to actually delete nodes that are marked for deletion


// add a check to the player move funtion that can change the cost of movement
// ex: ice or goo cells can slow you down or speed you up





let checkForBoundry = (r, c) => {

    if(matrix[r] == undefined) { return false }
    else if(matrix[r][c] == undefined) { return false }
    else { return true }

    // update to not allow players in cells with constructs
}

let cid = 1;
let getID = () => {
    cid += 1;
    return cid;
}

let removefromCell = (r, c, id) => {
    if(matrix[r]) {
        if(matrix[r][c]) {
            delete matrix[r][c].children[id];
        }
    }

}

let addToCell = (r, c, x, update=true) => {
    matrix[r][c].children[x.id] = x;
    calculateCell(r, c);
}

let addRelic = (name) => {
    let relics = JSON.parse(window.localStorage.getItem("relics"));
    let hasRelic = false;
    relics.forEach(relic => {
        if(relic.id == name) { hasRelic = true }
    })
    if(!hasRelic) {
        relics.push({id: name});
        window.localStorage.setItem("relics", JSON.stringify(relics))
    }
}

let checkForRelic = (r,c) => {
    if(matrix[r][c].relic) {
        addRelic(matrix[r][c].relic.id)
        addLog({ type: "relic", name: "you", content: ` found the ${matrix[r][c].relic.id.split("_").join(" ")}` });
        matrix[r][c].relic.sprite.destroy();
        matrix[r][c].relic = null;
        markForUpdate(r,c);
        // save that the player found the relic
    }
}   

let movePlayer = (r, c) => {
    if(checkForBoundry(r,c) && PLAYER.movements >= matrix[r][c].tile.movementCost && !checkIfPlayer(r,c) && !checkForConstruct(r,c)) {
        markForUpdate(PLAYER.row, PLAYER.column); 
        removefromCell(PLAYER.row, PLAYER.column, PLAYER.id);
        addToCell(r, c, PLAYER);
        PLAYER.move(r,c, matrix[r][c].tile.movementCost);
        markForUpdate(r,c); 
        checkForRelic(r,c);
    }
}

let moveEnemy = (r, c, enemyid) => {
    console.log(enemyid)
    if(checkForBoundry(r,c) && ENEMIES[enemyid].movements >= matrix[r][c].tile.movementCost && !checkIfPlayer(r,c) && !checkForConstruct(r,c)) {
        markForUpdate(ENEMIES[enemyid].row, ENEMIES[enemyid].column);
        removefromCell(ENEMIES[enemyid].row, ENEMIES[enemyid].column, ENEMIES[enemyid].id);
        addToCell(r, c, ENEMIES[enemyid]);
        ENEMIES[enemyid].move(r,c, matrix[r][c].tile.movementCost);
        markForUpdate(r, c); 
    }
}



let updateLabels = () => {
    document.getElementById("active-player").innerText = _players[_activePlayer].name;
    document.getElementById("input-method").innerHTML = `<span><span>input: </span><span class="input-method-value ${inputMethod == "ability" ? "imv-ability" : "imv-movement"}">${inputMethod}</span></span>`;
    document.getElementById("turn").innerText = turn;
    document.getElementById("hp").innerText = PLAYER.hp;
    document.getElementById("movements").innerText = PLAYER.movements;
    document.getElementById("power").innerText = PLAYER.power;
    showAvailableAbilities()
}

let updateTurns = () => {
    checkForWinner();
    calculateTiles();
    turn += 1;
    _activePlayer = 0;
    _players[_activePlayer].startTurn()
    PLAYER.updateTurn();
    ENEMIES.forEach(enemy => { enemy.updateTurn() })
    // ENEMY.updateTurn();
    console.log(matrix);
    updateLabels();

}

let endTurn = (n) => {
    let next = n+1;
    if(next >= _players.length) {
        // all players have gone
        updateTurns();
    } else {
        _activePlayer = next;
        _players[_activePlayer].startTurn();
    }
}


let getSavedAbilities = () => {
    let ls = JSON.parse(window.localStorage.getItem("abilities"));
    if(ls) {
        PLAYER.ability1 = new abilities[ls[1]]();
        PLAYER.ability2 = new abilities[ls[2]]();
        PLAYER.ability3 = new abilities[ls[3]]();
    }

}

let buildWorldConstructs = (list) => {
    list.forEach(con => {
        addToCell(con.row, con.column, new worldconstructs[con.id]())
    })
}

let placeRelics = (list) => {
    list.forEach(relic => {
        matrix[relic.row][relic.column].relic = relic;
    })
}

let spawnPlayer = (player_) => {
    console.log(player_)
    let newplayer = new Player(player_.row, player_.column, new Shell(), new Terraform_gamma(), new Slice());
    newplayer.gameIndex = 0;
    addToCell(newplayer.row, newplayer.column, newplayer);
    _players.push(newplayer);
    return newplayer;
}

let spawnEnemies = (list) => {
    let enemylist = [];
    for(let i = 0; i < list.length; i++) {
        let newenemy = new enemies[list[i].id](list[i].row, list[i].column, i);
        newenemy.gameIndex = i+1;
        enemylist.push(newenemy);
        addToCell(newenemy.row, newenemy.column, newenemy);
        _players.push(newenemy);
    }
    return enemylist;
}



// _________________________________________________________
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// init and game loop
let LEVEL = JSON.parse(window.localStorage.getItem("missiondata")).level;
if(LEVEL > Object.keys(missionmatrixdata.missions).length) { LEVEL = Object.keys(missionmatrixdata.missions).length }
console.log("level:", LEVEL);
console.log("level data:", missionmatrixdata.missions[LEVEL])
let matrix = makeMatrix(11, tiles[missionmatrixdata.missions[LEVEL].tile.id]);
drawMatrix(11);
loadRelic(missionmatrixdata.missions[LEVEL].relics[0].id)
// let PLAYER = new Player(10,5,new Shell(), new Terraform_gamma(), new Slice());
// PLAYER.gameIndex = 0;
// addToCell(PLAYER.row, PLAYER.column, PLAYER);


// let ENEMY = new enemies[enemy.id](enemy.row, enemy.column);
// ENEMY.gameIndex = 1;
// addToCell(enemy.row, enemy.column, ENEMY);

let _players = [];
let _activePlayer = 0;
let turn = 1;
let playerCanAct = false;
let inputMethod = "movement";

let PLAYER = spawnPlayer(missionmatrixdata.missions[LEVEL].player);
let ENEMIES = spawnEnemies(missionmatrixdata.missions[LEVEL].enemies);
console.log(ENEMIES);


getSavedAbilities();


buildWorldConstructs(missionmatrixdata.missions[LEVEL].constructs);
placeRelics(missionmatrixdata.missions[LEVEL].relics);


// addToCell(ENEMY.row, ENEMY.column, ENEMY);

createAbilityBox(1, PLAYER.ability1);
createAbilityBox(2, PLAYER.ability2);
createAbilityBox(3, PLAYER.ability3);
document.getElementById("as-1").addEventListener("click", (e) => { PLAYER.ability(1) })
document.getElementById("as-2").addEventListener("click", (e) => { PLAYER.ability(2) })
document.getElementById("as-3").addEventListener("click", (e) => { PLAYER.ability(3) })

// checkAroundCell(9,5)

let str = document.getElementById("start");

let start = (e) => {
    document.getElementById("game-wrapper-body").classList.remove("blur");
    // showMessage(gametext.missions[LEVEL], "opening");
    playerCanAct = true;
    str.classList.add("hide");
}


str.addEventListener("click", start);

// setInterval(() => {
//     console.log("--------------------------");
//     console.log(matrix);
//     console.log("\n\n")
// }, 1000)

drawCanvas();
updateLabels();

setInterval(() => {
    // pruneMatrix();
    compairMatrix();
    updateCanvas();
}, (1000/60))


// setTimeout(() => {
//     unselectCell(10,5)
// }, 3000);

// document.scrollingElement.scroll(0, 1);












// 2-9-24
// todo:
//
// add damage calculations for different types of damage
// > basically most attacks should do half damage to constructs
//
// refine enemy ai
// > allow for another attack with more variation in patterns
//
// refine menus
// > should be able to go back and forth from game to menu
//
// add more animations
//
// 
// maze runner type exploring map + other factions doing the same
// world is a matrix
// distopian 




// potential gameplay loop:
// have 3 starter abilities
// each mission complete gives new abilities
// but you cannot change abilities until you die
// could be an alternate gamemode



// add S.A.M. for dialog
// use same name until the character dies
// add item pickups in map for things like new abilities
// add after match completion stars
// > 1 = complete | 2 = did not take damage | 3 = collected all items
// add another image for handler 2
