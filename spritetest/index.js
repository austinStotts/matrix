var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'canvas',
  width: width,
  height: height,
});

var layer = new Konva.Layer();

let a = [];
seekerdata.frames.forEach(frame => {
    Object.keys(frame.frame).forEach(key => {
        a.push(frame.frame[key]);
    })
})

var animations = {
  idle: a
};

var imageObj = new Image();
imageObj.src = '../game/sprites/seeker.png';
imageObj.onload = function () {
  var blob = new Konva.Sprite({
    x: 32,
    y: 32,
    image: imageObj,
    animation: 'idle',
    animations: animations,
    frameRate: 16,
    frameIndex: 0,
  });

  // add the shape to the layer
  layer.add(blob);

  // add the layer to the stage
  stage.add(layer);

  // start sprite animation
  blob.start();

};











