let controls = document.getElementById("help-tab-controls");
let interface = document.getElementById("help-tab-interface");
let game = document.getElementById("help-tab-game");
let helptext = document.getElementById("helptext");
console.log(helptext)

let selected = "controls";


let showMenu = (s) => {
    if(s == "controls") {
        helptext.innerHTML = `
            <br>
            <span class="newline"></span> controlling the game will require the use of a keyboard and mouse
            <br>
            <br>
            <span class="newline"></span> the game has 2 input states
            <br>
            <br>
            <span class="newline"></span> when the input method is [movement]
            <br>
            <span class="newline"></span> use [w] [a] [s] [d] to move
            <br>
            <br>
            <span class="newline"></span> when the input method is [ability]
            <br>
            <span class="newline"></span> use [w] [a] [s] [d] again but to give a direction to your ability
            <br>
            <br>
            <span class="newline"></span> the default state is [movement]
            <br>
            <span class="newline"></span> to use an ability, click the ability you want to use \n
            or press the key shown on the abilty
            <br>
            <span class="newline"></span> then give a directional input
            <br>
            <br>
            <span class="newline"></span> some abilities allow for a mouse click to select a cell in the matrix
            <br>
            <span class="newline"></span> a grid will be shown on the matrix when this is an option
            <br>
        `
    } else if(s == "interface") {

        helptext.innerHTML = `
        <br>
            <div class="help-tt-wrapper">
                <div class="cordinates">X <span class="x-cord">5</span> Y <span class="y-cord">5</span> <span class="tile-label-tt lava-tt"><span class="mc-dot-tt">1</span><span class="mc-tt">1</span>Lava</span></div>
                <div class="cell-children-tt">
                    <div class="child-line-tt"><span class="child-type-tt construct-tt">construct</span> <span class="child-name-tt">terraformation y</span> <span class="child-hp-tt">2</span></div>
                    <div class="child-line-tt"><span class="child-type-tt player-tt">player</span> <span class="child-name-tt">steve</span> <span class="child-hp-tt">5</span></div>
                </div>
            </div>
        <br>
        <br>
        <div class="cordinates">X <span class="x-cord">5</span> Y <span class="y-cord">5</span> </div> <div class="tt-help-label">cordinates</div>
        <br>
        <span class="mc-dot-tt">1</span><div class="tt-help-label">damage over time</div>
        <br>
        <span class="mc-tt">1</span><div class="tt-help-label">movement cost</div>
        <br>
        <span class="tile-label-tta lava-tt">Lava</span><div class="tt-help-label">tile name</div>
        <br>
        <br>
        <span class="newline"></span> when you hover a cell with your mouse, the tooltip panel will show
        <br>
        <span class="newline"></span> this allows you to see inside of the cell and look at all the details
        <br>
        <br>
        <br>
        <span class="newline"></span> starting in the top left, you can see the cell cordinates
        <br>
        <br>
        <span class="newline"></span> continuing across, you can see two numbers
        <br>
        the first, shown in red, is the damage over time
        <br>
        if you are in this cell when the turn ends you will take this amount of damage
        <br>
        <br>
        <span class="newline"></span> the second number, shown in green, is the movement cost
        <br>
        this is how mant movements it requirest to move into this cell
        <br>
        the cell you are entering is always the cell that determines the cost
        <br>
        <br>
        <span class="newline"></span> the last thing here is the name of the tile
        <br>
        the tile is what determines the dot and the movement cost
        <br>
        <br>
        <span class="newline"></span> below is a list of all the objects currently inside the cell
        <br>
        <span class="newline"></span> from left to right
        <br> 
        the type of object, the name of the object, and the hp of the object

    `
    } else if(s == "game") {
        helptext.innerHTML = `
        <br>
            <span class="newline"></span> this is a turn based game in which the only way to win is to defeat all enemies
            <br>
            <span class="newline"></span> likewise, dying will result in you losing
            <br>
            <span class="newline"></span> each turn you are given your max movements and power plus any \n
            additional hp, movements, or power earned in the previous turn
            <br>
            <span class="newline"></span> in short there is no reason to save movements or power each turn \n
            and finding how best to maximize their use will lead to success
            <br>
        <br>
    `
    }
}








let updateSelected = (s) => {
    if(s == "controls") {
        selected = "controls";
        interface.classList.remove("tab-selected");
        game.classList.remove("tab-selected");
        controls.classList.add("tab-selected");
    } else if(s == "interface") {
        selected = "interface";
        controls.classList.remove("tab-selected");
        game.classList.remove("tab-selected");
        interface.classList.add("tab-selected");
    } else if(s == "game") {
        selected = "game";
        controls.classList.remove("tab-selected");
        interface.classList.remove("tab-selected");
        game.classList.add("tab-selected");
    }

    showMenu(s);
}

controls.addEventListener("click", () => { updateSelected("controls") });
interface.addEventListener("click", () => { updateSelected("interface") });
game.addEventListener("click", () => { updateSelected("game") });

showMenu(selected)