const THREE = require('three')
const OBJLoader = require('three-obj-loader')(THREE)

export function Agent()
{
	this.id = -1;
	this.position = new THREE.Vector3(0,0,0);
	this.velocity = new THREE.Vector3(0,0,0);
	this.goal = new THREE.Vector3(0,0,0);
	this.orientation = new THREE.Vector3(0,0,0);
	this.geometry = null;
	//this.cell = null;
	//this.size = new THREE.Vector3(0,0,0);
	this.markers = []; // marker id??
}

export function Marker()
{
	this.id = 0;
	this.position = new THREE.Vector3(0,0,0);
	this.geometry = null;
	this.active = false;
	this.agent = -1;
}

export function Cell()
{
	this.minx = -1;
	this.maxx = -1;
	this.miny = -1;
	this.maxy = -1;
//	this.position = new THREE.Vector3(0,0,0);
	this.markers = [];
	this.agents = [];
}

var Material1 = new THREE.MeshLambertMaterial( {color: 0xf7f7e6} ); //whitish lambert
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

export default class Crowd
{
	constructor(scene)
  	{
		this.scene = scene;
		this.markers = [];
		this.agents = [];

		this.cells = [];
		for(var i=0; i<10; i++)
		{
			var cellrow = [];
			for(var j=0; j<10; j++)
			{
				var cell = new Cell();
				cell.minx = i*2; cell.miny = j*2;
				cell.maxx = i*2 + 2; cell.maxy = j*2 + 2;
				cellrow.push(cell);
			}
			this.cells.push(cellrow);
		}

		this.createTerrain();
		this.generateMarkers();
		this.generateAgents(20);
	};

	createTerrain()
	{
		var geometry1 = new THREE.PlaneGeometry(20,20,100);
		var material1 = new THREE.MeshLambertMaterial( {color: 0x5386ba, side: THREE.DoubleSide} );
		var plane1 = new THREE.Mesh( geometry1, material1 );
		plane1.position.set(10,0,10);
		plane1.rotateX(90*3.14/180);
		this.scene.add( plane1 );
	};

	generateMarkers()
	{
		var num = 50;
		var geom = new THREE.Geometry();
		this.materials = [];
		for(var i=0; i<num; i++)
		{
			for(var j=0; j<num; j++)
			{
				var m = new Marker();
				var geometry = new THREE.SphereGeometry(0.025,8,8);
				var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
		        var sphere = new THREE.Mesh(geometry);
		        sphere.position.set(i*20/num+Math.random(),0,j*20/num+Math.random());
		    //    this.scene.add(sphere);
				this.materials.push(material);

				sphere.updateMatrix();
				geom.mergeMesh(sphere);//.geometry, sphere.matrix, i*j);

				m.id = i*j;
				m.position.set(sphere.position.x,sphere.position.y,sphere.position.z);
				m.geometry = sphere;

				var x = Math.round(m.position.x/2);
				var z = Math.round(m.position.z/2);
				x = Math.min(Math.max(0, x), 9); // CLAMP
				z = Math.min(Math.max(0, z), 9); // CLAMP

				this.cells[x][z].markers.push(m);

				this.markers.push(m);
			}
		}

		 var materialList = new THREE.MeshFaceMaterial(this.materials);
		 var mesh = new THREE.Mesh( geom, materialList );
		 this.scene.add( mesh );
		//console.log(this.cells);
	};

	generateAgents(numAgents)
	{
		//var numAgents = 20;
		for(var i=0; i<numAgents; i++)
		{
			var a = new Agent();
			var geometry = new THREE.CylinderGeometry(0.05,0.1,1);
			var material = new THREE.MeshLambertMaterial( {color: Math.random() * 0xffffff} );
			//material.color.setHex( Math.random() * 0xffffff );

			var cylinder = new THREE.Mesh(geometry, material);
			cylinder.position.set(i*19/numAgents+Math.random(),0,0.5+Math.random());
			this.scene.add(cylinder);

			// GOAL FOR DEBUGGING
			var g = Math.floor(Math.random() * 18 + 1);//20-i*20/numAgents
			a.goal = new THREE.Vector3(g,0,19);
			var geom = new THREE.SphereGeometry(0.1,8,8);
			var sphere = new THREE.Mesh(geom, material);
			sphere.position.set(a.goal.x,a.goal.y,a.goal.z);
			this.scene.add(sphere);

			a.id = ''+i;
			a.position = new THREE.Vector3(cylinder.position.x,cylinder.position.y,cylinder.position.z);
			a.velocity = new THREE.Vector3(0,0,0);

			a.orientation = new THREE.Vector3(0,0,0);
			a.geometry = cylinder;

			var x = Math.floor(a.position.x/2);
			var z = Math.floor(a.position.z/2);
			// x = Math.min(Math.max(0, x), 9); // CLAMP
			// z = Math.min(Math.max(0, z), 9); // CLAMP

			if(x>=0 && x<=9 && z>=0 && z<=9)
			{
				this.cells[x][z].agents.push(a);
			}
			if(x+1>=0 && x+1<=9 && z+1>=0 && z+1<=9)
			{
				this.cells[x+1][z+1].agents.push(a);
			}
			if(x+1>=0 && x+1<=9 && z>=0 && z<=9)
			{
				this.cells[x+1][z].agents.push(a);
			}
			if(x>=0 && x<=9 && z+1>=0 && z+1<=9)
			{
				this.cells[x][z+1].agents.push(a);
			}

			//a.cell = this.cells[x][z];
			this.agents.push(a);
		}
	};

	moveAgents(framectr)
	{
		if(framectr===0)
			this.generateAgents(20);
	if(this.agents.length!==0)
	{

		var type = 2;
		// GO STRAIGHT:
		if(type===1)
		{
			for(var i=0; i<10; i++)
			{
				var a = this.agents[i];
				var d = a.position.distanceTo(a.goal);
				if(d>0.01)
				{
					a.velocity.set(a.goal.x - a.position.x,
									a.goal.y - a.position.y,
									a.goal.z - a.position.z);
					a.velocity.clamp(THREE.Vector3(0,0,0),THREE.Vector3(1,1,1));
					a.position.add(a.velocity.divideScalar(10));
					a.geometry.position.copy(a.position);

				}
			}
		}

		else
		{
			// USE MARKERS:
			for(var i=0; i<this.markers.length; i++)
			{
				this.markers[i].agent = null;
				//this.markers[i].active = false;
				this.markers[i].geometry.material.color.setHex(0xffffff);
			}

			for(var i=0; i<this.agents.length; i++)
				this.agents[i].markers = [];

			// FIND NEAREST AGENTS:
			for(var i=0; i<this.cells.length; i++)
			{
				for(var j=0; j<this.cells[i].length; j++)
				{
					var c = this.cells[i][j];
					if(c.agents.length===0) // only process markers if the cell has some agent..
						continue;

					// COMPARE ALL THE MARKERS TO ALL THE AGENTS IN THE CELLS
					for(var k=0; k<c.markers.length; k++)
					{
					//	c.markers[k].active=true;

						var m = c.markers[k];
						var a;
						var minD = 0;
						// if(m.agent!==null)
						// 	minD = m.position.distanceTo(m.agent.position);
						for(var l=0; l<c.agents.length; l++)
						{
							a = c.agents[l];
							if(a.position.distanceTo(a.goal)<0.001) // STOP AGENT ONCE AT THE GOAL
							{
								//delete(this.agents[i]);
								continue;
							}
							var d = m.position.distanceTo(a.position);
							if((l===0 || d<minD) && d<2)
							{
								minD = d;
								m.agent = a;
							}
						}

						if(m.agent!==null)
						{
							m.agent.markers.push(m);
							m.geometry.material.color.setHex(m.agent.geometry.material.color.getHex());
						//	this.materials[m.id].color.setHex(a.geometry.material.color.getHex());
							//m.geometry.material.color.setHex(0x999999);
						}
					//	debugger;
					}
				}
			}

			for(var i=0; i<this.cells.length; i++)
			{
				for(var j=0; j<this.cells[i].length; j++)
				{
					this.cells[i][j].agents = [];
				}
			}

			// FIND THE NEW VELOCITY OF THE AGENTS
			for(var i=0; i<this.agents.length; i++)
			{
				var a = this.agents[i];

				if(a===undefined)
					continue;

				var n = a.markers.length;
				// if(n===0)
				// 	continue;

				a.velocity = THREE.Vector3(0,0,0);
				if(a.position.distanceTo(a.goal)<0.01) // STOP AGENT ONCE AT THE GOAL
				{
					//delete(this.agents[i]);
					this.scene.remove(a.geometry);
					this.agents.splice(i, 1);
					continue;
				}
				//a.velocity = THREE.Vector3(0,0,0);

			if(n!==0)
			{
				var dirAG = new THREE.Vector3(0,0,0);
				dirAG.set(a.goal.x - a.position.x,
						  a.goal.y - a.position.y,
						  a.goal.z - a.position.z) // dir to get to the goal
				dirAG = dirAG.normalize();

				var vel = new THREE.Vector3(0,0,0);
				for(var j=0; j<n; j++)
				{
					var m = a.markers[j];
					var distAM = a.position.distanceTo(m.position); // agent to marker distance
					var distW = (2 - distAM); // weight.. more dist => less weight
					var dir = new THREE.Vector3(0,0,0);
					dir.set(m.position.x - a.position.x,
							m.position.y - a.position.y,
							m.position.z - a.position.z);
					dir = dir.normalize(); // compute the direction
					dir.multiplyScalar(distW * (dir.dot(dirAG)) / n); // apply weight based on AM dist, AG dir, num M..
					vel.add(dir); // add the the velocity
				}

				a.velocity = vel.divideScalar(10); // TIMESTEP
				a.position.add(a.velocity);
				a.geometry.position.copy(a.position);
			}

				var x = Math.floor((a.position.x)/2);
				var z = Math.floor((a.position.z)/2);

				// x = Math.min(Math.max(0, x), 9); // CLAMP
				// z = Math.min(Math.max(0, z), 9); // CLAMP

				if(x>=0 && x<=9 && z>=0 && z<=9)
				{
					this.cells[x][z].agents.push(a);
				}
				if(x+1>=0 && x+1<=9 && z+1>=0 && z+1<=9)
				{
					this.cells[x+1][z+1].agents.push(a);
				}
				if(x+1>=0 && x+1<=9 && z>=0 && z<=9)
				{
					this.cells[x+1][z].agents.push(a);
				}
				if(x>=0 && x<=9 && z+1>=0 && z+1<=9)
				{
					this.cells[x][z+1].agents.push(a);
				}
			}

		}
	}
	};


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
  	makeCylinder(nodeCyl)
  	{
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
