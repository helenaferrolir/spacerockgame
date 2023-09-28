import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let angulo = 0.0;
let rolamento = 0.0;
let taxaRol = 0.0;
let inclinacao = 0.0;
let taxaIncl = 0.0;
let velocidade = 0.0;
let aceleracao = 0.0;
let rumo = 0.0;
let velocidadeAngular = 0.0;
let tiro = null;
let tiroVelZ = 0;
let tiroVelX = 0;
let NUM_ASTEROIDS = 20;


class simulavel {
	limiteX = 6.0;
	limiteY = 5.0; 
	limiteZ = 2.0;
	constructor (asteroid, velX, velY, velZ) {
		this.asteroid = asteroid;

		///define a direção das elemento_naves
		this.velX = getRandomArbitrary(0.02, -0.02);;
		this.velY = 0;
		this.velZ = getRandomArbitrary(0.02, -0.02);
		this.rotX = getRandomArbitrary(0.01, 0.02);
		this.rotY = getRandomArbitrary(0.01, 0.02);
		this.rotZ = getRandomArbitrary(0.01, 0.02);


		this.asteroid.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
		this.asteroid.position.y = getRandomArbitrary(this.limiteY, -this.limiteY);
		this.asteroid.position.z = -10;

		camera.position.z = 20;
	}

	//detecta a colisao
	detectarColisaoTiroAsteroide(){
		var deltaX = this.asteroid.position.x - tiro.position.x;
		var deltaY = this.asteroid.position.y - tiro.position.y;
		var deltaZ = this.asteroid.position.z - tiro.position.z;
		var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
		return dist < 1.5;

	}

	detectarColisaoAsteroideNave(){
        if(elemento_nave && this?.asteroid.position){

			// console.log(elemento_nave.visible);
			var deltaX = elemento_nave.position.x - this?.asteroid.position.x;
			var deltaY = elemento_nave.position.y - this?.asteroid.position.y;
			var deltaZ = elemento_nave.position.z - this?.asteroid.position.z;
			var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
			// alert('sdjn');
			return dist < 4.5;
		}
		return null;

	}

	//rotacao e posicao das elemento_naves
	simule() {
		this.asteroid.position.x += this.velX;
		this.asteroid.position.y += this.velY;
		this.asteroid.position.z += this.velZ;

		if(tiro != null && this.detectarColisaoTiroAsteroide()) {
			//criar explosao na posição do asteroide
            explosao_asteroide.position.x = this.asteroid.position.x;
			explosao_asteroide.position.y = this.asteroid.position.y;
			explosao_asteroide.position.z = this.asteroid.position.z;
			explosao_asteroide.visible = true; //aparece
			tiro.visible = false;
			tiroVelX = -0.2*Math.sin(rumo);
			tiroVelZ = -0.2*Math.cos(rumo);

			//sumir depois de dois segundos
			setTimeout(() => {
				explosao_asteroide.visible = false;
			}, 1000);
            //reposicionando os asteroides após a explosão			
			this.asteroid.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
			

		}

		if(explosao_nave != null && this.detectarColisaoAsteroideNave()) {
			//criar explosao na posição da nave
            explosao_nave.position.x = elemento_nave.position.x;
			explosao_nave.position.y = elemento_nave.position.y;
			explosao_nave.position.z = elemento_nave.position.z;
			explosao_nave.visible = true; //aparece
			elemento_nave.visible = false;
			tiroVelX = -0.2*Math.sin(rumo);
			tiroVelZ = -0.2*Math.cos(rumo);

			//sumir depois de um segundo
			setTimeout(() => {
				explosao_nave.visible = false;
				elemento_nave.visible = true;
			}, 1000);
            //reposicionando os asteroides após a explosão			
			this.asteroid.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
			this.asteroid.position.y = getRandomArbitrary(-this.limiteY, this.limiteY);
			this.asteroid.position.z = getRandomArbitrary(-this.limiteZ, this.limiteZ);
			

		}
	}
}


//criando a cena, camera e renderizando
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//criando o 360 da cena com controls

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 2, 0 );
controls.maxPolarAngle = THREE.MathUtils.degToRad( 180 );
controls.maxDistance = 80;
controls.minDistance = 20;
controls.enablePan = false;
controls.update();

// Função para atualizar o tamanho da janela
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();	

    renderer.setSize(newWidth, newHeight);
});

//adicionando e posicionando a nave
var elemento_nave;
const loader = new GLTFLoader();
loader.load('model/nave.glb', 
function(gltf){
	elemento_nave = gltf.scene;
	scene.add(elemento_nave);

	elemento_nave.position.set(0, -10, 0);
	elemento_nave.scale.set(0.25, 0.25, 0.25);
	elemento_nave.rotation.set(0, 0, 0);

	animate();
	return elemento_nave;

});

let explosao_asteroide; // Variável para armazenar a explosao_asteroide

loader.load('model/explosion.glb', (gltf) => {
	explosao_asteroide = gltf.scene;
	scene.add(explosao_asteroide);
	explosao_asteroide.visible = false;
});


let explosao_nave; // Variável para armazenar o explosao

loader.load('model/explosion_nave.glb', (gltf) => {
	explosao_nave = gltf.scene;
	scene.add(explosao_nave);
	explosao_nave.visible = false;
});

// adicionando e posicionando backgroud
const backg = new GLTFLoader();
backg.load('/model/galaxy3d.glb', (gltf) => {
    const background = gltf.scene;

    // Redimensionando o plano de fundo 
    background.scale.set(-150,-150,150); // escala x, escala y, escala z
	background.position.set(0,0,0); 

    // Adicionando o plano de fundo à cena
    scene.add(background);
});

//adicionando as elemento_naves e definindo tamanho e rotação
var glbModel;
const loader2 = new GLTFLoader();
var objetos = [];

//exibe asteroides na tela
for (var i = 0; i < NUM_ASTEROIDS; i++) {
	const loader2 = new GLTFLoader();
	loader2.load('model/asteroide.glb',	function(gltf) {	
	glbModel = gltf.scene;
	scene.add(glbModel);

	const obj1 = new simulavel( glbModel, 
								getRandomArbitrary(-0.05, 0.05, 0.5),
								getRandomArbitrary(-0.05, 0.05),
								getRandomArbitrary(0.0, 0.05)
							  );
	objetos.push(obj1)

	// Define a posição, escala ou outras transformações do explosao, se necessário
	glbModel.scale.set(0.05, 0.05, 0.05);
	});	
}

	//adicionando pontos de luz na nave
	const light = new THREE.PointLight(0xf0f000, 100, 100);
	light.position.set(0, 0, 0);
	scene.add(light);
	const light2 = new THREE.PointLight(0x0000ff, 100, 100);
	light.position.set(0, 0, 0);
	scene.add(light2);
	const light3 = new THREE.DirectionalLight(0x00ff00, 0.5);
	light.position.set(0, 0, 0);
	scene.add(light3);
	const light4 = new THREE.HemisphereLight(0x00ff00, 0xff00ff, 5 );
	light.position.set(0, 0, 0);
	scene.add(light4);
	

//criando o tiro da nave
{
	const geometry = new THREE.SphereGeometry( 0.5, 10, 10 );
	const material = new THREE.MeshStandardMaterial( { color: 0xf0f000} );
	tiro = new THREE.Mesh( geometry, material );
	scene.add( tiro );
	tiro.visible = false;
}



function animate() {
    requestAnimationFrame(animate);

	// Atualiza a posição da elemento_nave móvel ou faz qualquer outro movimento
	tiro.position.x += 0.02;

    angulo += 0.1;
    rolamento += taxaRol;
    inclinacao += taxaIncl;

	for(var i in objetos)
	objetos[i].simule();


	velocidade += aceleracao;
	angulo += 0.01;	
	
	rumo += velocidadeAngular;

	tiro.position.z += tiroVelZ;

	//nave gira em torno de y
	if(elemento_nave != null) {
	
	//tratar limite de x e y
	elemento_nave.position.x += taxaRol;
	elemento_nave.position.y += taxaIncl;

	}

	//adiciona luzes aos objetos
	light.position.x =  0.5 * Math.sin(angulo);
	light.position.z =0.5 * Math.cos(angulo);
	light2.position.x = 0.5 * Math.sin(-angulo);
	light2.position.z =0.5 * Math.cos(-angulo);
	light3.position.x = 0.5 * Math.sin(angulo);
	light3.position.z = 0.5 * Math.cos(angulo);
	light4.position.x =0.5 * Math.sin(angulo);
	light4.position.z = 0.5 * Math.cos(angulo);

	renderer.render(scene, camera);

}

document.onkeydown = function(event){

	//adiciona o tiro saindo da imagem ao apertar space
	if(event.key == " ") {
		tiro.position.x = elemento_nave.position.x;
		tiro.position.y = elemento_nave.position.y;
		tiro.position.z = elemento_nave.position.z;
		tiro.visible = true;
		
		tiroVelX = -0.4*Math.sin(rumo);
		tiroVelZ = -0.4*Math.cos(rumo);
		
	}
	
	//aperta teclado
	if(event.key == "ArrowLeft"){
	taxaRol = -0.10;
	}
	if (event.key == "ArrowRight"){
	taxaRol = 0.10;
	}
	if(event.key == "ArrowUp"){
	taxaIncl = 0.10;
	}
	if(event.key == "ArrowDown"){
	taxaIncl = -0.10;
	}
    if(event.key == "S" || event.key == "s"){  //anda para traz
	elemento_nave.position.z += 0.15;
	}
    if(event.key == "W" || event.key == "w"){  //anda para frente
 	elemento_nave.position.z -= 0.15;
    }
		

	}

	//nave se move para a direita, esquerda e para cima e para baixo
document.onkeyup = function(event){

	//solta teclado
	if(event.key == "ArrowLeft"){
	taxaRol = 0.0;
	}
	if (event.key == "ArrowRight"){
	taxaRol = 0.0;
	}
	if(event.key == "ArrowUp"){
	taxaIncl = 0.0;
	}
	if(event.key == "ArrowDown"){
	taxaIncl = 0.0;
	}
	if(event.key == "S" || event.key == "s"){
	elemento_nave.position.z += 0.0;
	}
	if(event.key == "W" || event.key == "w"){
    elemento_nave.position.z -= 0.0;
	}

	
}
	
animate();
