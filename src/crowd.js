const THREE = require('three')
const OBJLoader = require('three-obj-loader')(THREE)

export function Agent(symbol)
{
	this.Position = new THREE.Vector3(0,0,0);
	this.Velocity = new THREE.Vector3(0,0,0);
	this.Goal = new THREE.Vector3(0,0,0);
	this.Orientation = new THREE.Vector3(0,0,0);
	this.Size = new THREE.Vector3(0,0,0);
	this.Markers = 0; // marker id??
}

/* // materials, textures and objloaders:
var Material1 = new THREE.MeshLambertMaterial( {color: 0xf7f7e6} ); //whitish lambert
var Material2 = new THREE.MeshPhongMaterial( {color: 0x131315} ); //metal
var Material3 = new THREE.MeshLambertMaterial( {color: 0xc45e61} ); //metal
//var texture = THREE.ImageUtils.loadTexture('crate.gif');
var Material4;// = new THREE.MeshBasicMaterial({map: texture});
var loader = new THREE.TextureLoader();
loader.load('models/tex3.jpg', function ( texture ) {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.x = 2;
	texture.repeat.y = 2;
  Material4 = new THREE.MeshPhongMaterial({map: texture, overdraw: 0.5});
});
var objLoader = new THREE.OBJLoader();
// var leafOBJ;
// objLoader.load('models/leaf.obj', function(obj) {
//   leafOBJ = obj.children[0].geometry;
// });
*/

export default class Turtle
{
  constructor(scene) {
       this.scene = scene;
	   this.createTerrain();
	}

	createTerrain() {
		var geometry1 = new THREE.PlaneGeometry( 20*2, 20*2, 32 );
		var material1 = new THREE.MeshPhongMaterial( {color: 0x5386ba, side: THREE.DoubleSide} );
		var plane1 = new THREE.Mesh( geometry1, material1 );
		plane1.position.set(9,-0.01,9);
		plane1.rotateX(90*3.14/180);
		this.scene.add( plane1 );
	}

  // A function to help you debug your turtle functions
  // by printing out the turtle's current state.

  // Rotate the turtle's _dir_ vector by each of the
  // Euler angles indicated by the input.
  // rotateTurtle(x, y, z) {
  //     var e = new THREE.Euler(
  //             x * 3.14/180,
  //     				y * 3.14/180,
  //     				z * 3.14/180);
  //     this.state.dir.applyEuler(e);
  // }

  // Translate the turtle along its _dir_ vector by the distance indicated
  // moveForward(dist) {
  //     var newVec = this.state.dir.multiplyScalar(dist);
  //     this.state.pos.add(newVec);
  // };

  // Make a cylinder of given length and width starting at turtle pos
  // Moves turtle pos ahead to end of the new cylinder
  makeCylinder(nodeCyl) {
      var geometry = new THREE.CylinderGeometry(0.5,0.5,1);
      var cylinder = new THREE.Mesh(geometry, Material1);
      cylinder.position.set(nodeCyl.pos.x,nodeCyl.pos.y,nodeCyl.pos.z);
      cylinder.rotateX(nodeCyl.orient.x);
      cylinder.rotateY(nodeCyl.orient.y);
      cylinder.rotateZ(nodeCyl.orient.z);
      cylinder.scale.set(nodeCyl.scale.x,nodeCyl.scale.y,nodeCyl.scale.z);
      nodeCyl.type = 'cylinder';
      nodeCyl.mesh = cylinder;
      this.scene.add(cylinder);
  };

  makeCube(nodeCube)
  {
    var geometry = new THREE.CubeGeometry(1,1,1);
		var mat = new THREE.MeshLambertMaterial();
		//mat.copy(Material4);
    var cube = new THREE.Mesh(geometry, Material4);
    cube.position.set(nodeCube.pos.x,nodeCube.pos.y,nodeCube.pos.z);
    cube.rotateX(nodeCube.orient.x);
    cube.rotateY(nodeCube.orient.y);
    cube.rotateZ(nodeCube.orient.z);
    cube.scale.set(nodeCube.scale.x,nodeCube.scale.y,nodeCube.scale.z);
		// mat.map.wrapS = THREE.RepeatWrapping;
		// mat.map.wrapT = THREE.RepeatWrapping;
		// mat.map.repeat.x=nodeCube.scale.x;
		// mat.map.repeat.y=nodeCube.scale.y;
    nodeCube.type = 'cube';
    nodeCube.mesh = cube;
    this.scene.add(cube);
    //console.log(nodeCube);
  };

}
