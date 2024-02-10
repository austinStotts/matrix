var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'canvas',
  width: width,
  height: height,
});

var layer = new Konva.Layer();

console.log(spritedata)
let a = [];
spritedata.frames.forEach(frame => {
    Object.keys(frame.frame).forEach(key => {
        a.push(frame.frame[key]);
    })
})

var animations = {
  idle: a
};

var imageObj = new Image();
imageObj.onload = function () {
  var blob = new Konva.Sprite({
    x: 50,
    y: 50,
    image: imageObj,
    animation: 'idle',
    animations: animations,
    frameRate: 4,
    frameIndex: 0,
  });

  // add the shape to the layer
  layer.add(blob);

  // add the layer to the stage
  stage.add(layer);

  // start sprite animation
  blob.start();

};
imageObj.src = '../game/sprites/enemyone_d.png';









