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
let pontuacao = 0;

//escuta o elemento de click no botão comecar, adiciona o botão resetar e recarrega a página
document.getElementById('comecar').addEventListener('click', function() {
 
	// chamar funções para criação dos asteroides e habilita o teclado após iniciar o jogo
	habilitarTeclado();
	criarAsteroides();

	//retirar botão começar
	var botaoPlay = document.getElementById('comecar');
	botaoPlay.style.display = 'none';

	//exibir botão resetar
	var botaoResetar = document.getElementById('resetar');
	botaoResetar.style.display = 'block';

	// recarregar tela no clique do botão resetar
	botaoResetar.addEventListener('click', function () {
		window.location.reload();
	});
});

//habiilita o tetclado após o bottão de sttart ser clicado
function habilitarTeclado(){
	document.onkeydown = function(event){
		//adiciona o tiro saindo da imagem ao apertar space
		if(event.key == " ") {
			tiro.position.x = elemento_nave.position.x;
			tiro.position.y = elemento_nave.position.y;
			tiro.position.z = elemento_nave.position.z;
			tiro.visible = true;
			
			//adiciona audio do tiro
			tirosom.play();
	
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
}

class simulavel {
	limiteX = 6;
	limiteY = 3; 
	limiteZ = 2;
	constructor (asteroid, velX, velY, velZ){
		this.asteroid = asteroid;

		///define a direção das elemento_naves
		this.velX = getRandomArbitrary(0.01, -0.01);;
		this.velY = 0;
		this.velZ = getRandomArbitrary(0.01, -0.01);
		this.rotX = getRandomArbitrary(0.01, 0.02);
		this.rotY = getRandomArbitrary(0.01, 0.02);
		this.rotZ = getRandomArbitrary(0.01, 0.02);

		this.asteroid.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
		this.asteroid.position.y = getRandomArbitrary(this.limiteY, -this.limiteY);
		this.asteroid.position.z = -50;

		camera.position.z = 20;

		// garantir que o áudio seja posicionado corretamente
	    camera.add(listener);
	
	}

	//detecta a colisao e faz contagem da pontuação
	detectarColisaoTiroAsteroide(){
		var deltaX = this.asteroid.position.x - tiro.position.x;
		var deltaY = this.asteroid.position.y - tiro.position.y;
		var deltaZ = this.asteroid.position.z - tiro.position.z;
		var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);

		if (dist < 1.5) {
			// Aumente a pontuação e chama a função para atualizar a exibição da pontuação
			pontuacao += 1; 
			this.atualizarPontuacao(); 
		}
		return dist < 1.5;
	}

	//atualiza o conteúdo de um elemento HTML com o ID 'pontuacao' para exibir a pontuação atual.
	atualizarPontuacao(){
		const pontuacaoElement = document.getElementById('pontuacao');
		pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
	}

	detectarColisaoAsteroideNave(){
        if(elemento_nave && this?.asteroid.position){

			// console.log(elemento_nave.visible);
			var deltaX = elemento_nave.position.x - this?.asteroid.position.x;
			var deltaY = elemento_nave.position.y - this?.asteroid.position.y;
			var deltaZ = elemento_nave.position.z - this?.asteroid.position.z;
			var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
			
			if (dist < 4.5) {
				// Colisão detectada, agora vamos recarregar a página após 3 segundos
				setTimeout(function () {
					window.location.reload();
				}, 2000); // recarrega a página após 2 segundos
			}
			return dist < 4.5;
		}
		return null;
	}

	//detetca a colisão dos elementtos, reposiciona e faz rotacao os elemento_naves
	simule(){
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

			// Tocar o som de explosão
			audio.play();	

			//sumir explosão depois de dois segundos
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

			// Tocar o som de explosão
			audio.play();

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

//Adicionao objeto e a câmera a um grupo
var group = new THREE.Object3D();
group.add(elemento_nave);
group.add(camera);

camera.position.set(0,100,200);
//camera.lookAt(elemento_nave.position);

scene.add(group);

//ADICIONANDO SOM DE EXPLOSAO DO ASTEROIDE / NAVE
const explosaoSound  = new Audio('sounds/explosao.wav');
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);
scene.add(audio);

audioLoader.load('sounds/explosao.wav', function(buffer) {
  audio.setBuffer(buffer);
  audio.setLoop(false); // Defina como true se quiser que o áudio seja reproduzido em loop
  audio.setVolume(0.5); // Defina o volume (0.0 a 1.0)
}); 

//ADICIONANDO SOM DO TIRO
const tiroSound  = new Audio('sounds/tiro.mp3');
const audioLoader1 = new THREE.AudioLoader();
const listener1 = new THREE.AudioListener();
const tirosom = new THREE.Audio(listener1);
scene.add(tirosom);

audioLoader1.load('sounds/tiro.mp3', function(buffer) {
  tirosom.setBuffer(buffer);
  tirosom.setLoop(false); // Defina como true se quiser que o áudio seja reproduzido em loop
  tirosom.setVolume(0.5); // Defina o volume (0.0 a 1.0)
}); 

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
var glbModel2;
const loader2 = new GLTFLoader();
const loader3 = new GLTFLoader();
var objetos = [];
var objetos2 = [];
let NUM_ASTEROIDS = 20;
let NUM_ASTEROIDS2 = 5;
const asteroids = []; // Array para armazenar os asteroides

function criarAsteroides(){
// Exibe asteroides na tela
	for (var i = 0; i < NUM_ASTEROIDS; i++) {
		loader2.load('model/asteroide.glb', function (gltf) {
			glbModel = gltf.scene;
			scene.add(glbModel);

			const obj1 = new simulavel(
				glbModel,
				getRandomArbitrary(-0.5, 0.5, 0.5),
				getRandomArbitrary(-0.5, 0.5, 0.5),
				getRandomArbitrary(0.5, 0.5, 0.5)
			);
			objetos.push(obj1)

			// Define a posição, escala ou outras transformações do asteroide, se necessário
			glbModel.scale.set(0.05, 0.05, 0.05);
		})
	;}

	for (var j = 0; j < NUM_ASTEROIDS2; j++) {
		loader2.load('model/asteroide.glb', function (gltf) {
			glbModel = gltf.scene;
			scene.add(glbModel);

			const obj1 = new simulavel(
				glbModel,
				getRandomArbitrary(-0.05, 0.05, 0.5),
				getRandomArbitrary(-0.05, 0.05),
				getRandomArbitrary(0.0, 0.05)
			);
			objetos.push(obj1)

			// Define a posição, escala ou outras transformações do asteroide, se necessário
			glbModel.scale.set(0.1, 0.1, 0.1);
		});
	}
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
const geometry = new THREE.SphereGeometry( 0.5, 10, 10 );
const material = new THREE.MeshStandardMaterial( { color: 0xf0f000} );
tiro = new THREE.Mesh( geometry, material );
scene.add( tiro );

tiro.visible = false;

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
	
animate();
