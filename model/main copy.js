import * as THREE from 'three';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

let velocidade = 0.0;
let aceleracao = 0.0;
let rumo = 0.0;
let velX = 0.0;
let velY = 0.0;
let velocidadeAngular = 0.0;
let tiro = null;
let tiroVelZ = 0;
let tiroVelX = 0;

class simulavel {
	limiteX = 6.0;
	limiteY = 5.0; 
	limiteZ = 2.0;
	constructor (geometria, velX, velY, velZ) {
		this.geometria = geometria;
		this.velX = getRandomArbitrary(-0.02, 0.02);
		this.velY = 0;
		this.velZ = getRandomArbitrary(-0.02, 0.02);
		this.rotX = getRandomArbitrary(0.01, 0.02);
		this.rotY = getRandomArbitrary(0.01, 0.02);
		this.rotZ = getRandomArbitrary(0.01, 0.02);

		this.geometria.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
		this.geometria.position.y = 0;
		this.geometria.position.z = getRandomArbitrary(-this.limiteZ, this.limiteZ);
	}

	 foiAtingido(){
		var deltaX = this.geometria.position.x - tiro.position.x;
		var deltaY = this.geometria.position.y - tiro.position.y;
		var deltaZ = this.geometria.position.z - tiro.position.z;
		var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
		return dist < 1.5;
	}

	simule() {

		this.geometria.rotation.x += this.rotX;
		this.geometria.rotation.y += this.rotY;
		this.geometria.rotation.z += this.rotZ;
		this.geometria.position.x += this.velX;
		this.geometria.position.y += this.velY;
		this.geometria.position.z += this.velZ;

		

		if(tiro != null && this.foiAtingido()) {
			this.geometria.position.x = 0;
			this.geometria.position.y = 0;
			this.geometria.position.z = 0;
		}

	}

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var objetos = [];

for (var i = 0; i < 10; i++) {
	const geometry = new THREE.SphereGeometry( 1, 20, 10 );
	const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

    

	const obj1 = new simulavel(cube, getRandomArbitrary(-0.05, 0.05),
					 getRandomArbitrary(-0.05, 0.05),
					 getRandomArbitrary(0.0, 0.05));
	objetos.push(obj1)
}


const light = new THREE.PointLight( 0xff00ff, 10, 50 );
light.position.set( 0, 0, 0 );
scene.add( light );

const light2 = new THREE.PointLight( 0x00ffff, 10, 50 );
light2.position.set( 0, 0, 0 );
scene.add( light2 );



camera.position.z = 5 ;

var angulo = 0.0;

//esfera do tiro
{
	const geometry = new THREE.SphereGeometry( 0.5, 10, 10 );
	const material = new THREE.MeshStandardMaterial( { color: 0xff0000} );
	tiro = new THREE.Mesh( geometry, material );
	scene.add( tiro );
	tiro.visible = true;
}

function animate() {
	requestAnimationFrame( animate );

	//obj1.simule();
	for(var i in objetos)
		objetos[i].simule();

		velocidade += aceleracao;
        angulo += 0.01;

		camera.position.x += -velocidade * Math.sin(rumo);
		camera.position.z += -velocidade * Math.cos(rumo);

         
		rumo += velocidadeAngular;
		camera.rotation.y = rumo;

		tiro.position.x += tiroVelX;
		tiro.position.z += tiroVelZ;

        light.position.x = 2.0 * Math.sin(angulo);
        light.position.z = 2.0 * Math.cos(angulo);

        light2.position.x = 2.0 * Math.sin(-angulo);
        light2.position.z = 2.0 * Math.cos(-angulo);
      
		renderer.render( scene, camera );
}

document.onkeydown = function(e) {
	console.log(e);
	if(e.key == " ") {
		tiro.position.x = camera.position.x;
		tiro.position.y = camera.position.y;
		tiro.position.z = camera.position.z;
		tiro.visible = true;
		tiroVelX = -0.4*Math.sin(rumo);
		tiroVelZ = -0.4*Math.cos(rumo);
	}


	if(e.key == "ArrowUp") {
		aceleracao = 0.1;
	}

	if(e.key == "ArrowDown") {
		aceleracao = -0.1;
	}

	if(e.key == "ArrowLeft") {
		velocidadeAngular = 50;
	}

	if(e.key == "ArrowRight") {
		velocidadeAngular = -50;
	}

}

document.onkeyup = function(e) {
	console.log(e);
	if(e.key == "ArrowUp") {
		aceleracao = 0.0;
	}

	if(e.key == "ArrowDown") {
		aceleracao = 0.0;
	}

	if(e.key == "ArrowLeft") {
		velocidadeAngular = 0.0;
	}

	if(e.key == "ArrowRight") {
		velocidadeAngular = 0.0;
	}
}

animate();










