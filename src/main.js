const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Crowd from './crowd.js'

var crowd;
var framectr = 0;
var anim = false;

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // set camera position
  camera.position.set(25, 10, 25);
  camera.lookAt(new THREE.Vector3(10,0,10));

  // initialize LSystem and a Turtle to draw
  crowd = new Crowd(scene);
  framectr = 0;

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  var update= new GUIoptions();
  gui.add(update,'Start').onclick;
  gui.add(update,'Reset').onChange(function(newVal) {
      clearScene(crowd);
      crowd = new Crowd(scene);
  });
  // gui.add(update, 'kaipan', 0, 12).step(1).onChange(function(newVal) {
  //
  // });
}

var GUIoptions = function()
{
	this.Start=function(){
        anim = !anim;
	};
    this.Reset=function(){
	};
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(crowd) {
  var obj;
  for( var i = crowd.scene.children.length - 1; i > 3; i--) {
      obj = crowd.scene.children[i];
      crowd.scene.remove(obj);
  }
}

// function doLsystem(lsystem, iterations, turtle) {
//     turtle.renderSymbols(result);
// }

// called on frame updates
function onUpdate(framework) {
    if(anim)
        crowd.moveAgents(framectr);
    framectr++;
    if(framectr>=60)
        framectr=0;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
