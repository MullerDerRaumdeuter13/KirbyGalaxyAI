"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import { GLTFLoader } from '../libs/three.js/loaders/GLTFLoader.js';

let renderer = null, scene = null, camera = null
const duration = 5000; // ms
let currentTime = Date.now();
let rings = [];
let ring;
let ring2;
let ring3;

let cone;
let coneCounter = 0;

let arrKirbys = []
let arrBullets = [];
let arrSnow = [];

let snow;
let snow_counter = 0;
let snow_collision_counter = 0;
let snowBBox;

let boxBBox;

let LoKirby1;
let LoKirby2;
let LoKirby3;
let LoKirby4;
let LoKirbyBBox;
let kirbysBBox;
let kirby_obj;
let score = 0;

function randomInt(min, max) { //Just an easier way to get a random int constantly for the cones and snowballs
    return Math.floor(Math.random() * (max - min) ) + min;
  }


function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    createRing1();
    createIceCream();
    createCone();
    update();
}

//function that loads the Kirby model
async function loadGLTF(gltfModelUrl)
{
    try
    {
        const gltfLoader = new GLTFLoader();
        const result = await gltfLoader.loadAsync(gltfModelUrl);

        kirby_obj = result.scene || result.scenes[0];

        //Get Kirby into position
        kirby_obj.position.y = -1;
        kirby_obj.rotation.x = Math.PI;
        kirby_obj.scale.set(0.15, 0.15, 0.15);
        kirby_obj.position.z = 50;
        kirby_obj.rotation.z = Math.PI;


        //---------------------------------------------------------------Add to the scene
        scene.add(kirby_obj); 
        //console.log(kirby_obj);
        kirbysBBox = new THREE.BoxHelper(kirby_obj, 0x00ff00);
        kirbysBBox.update();
        kirbysBBox.visible = false;
        scene.add(kirbysBBox);
        
        //----------------------------------------------------------------Controls
        //Kirby moves up, down, right and left
        //The range of Kirby's movement is -4 to 4 on x and -3 to 3 on y
        /*document.onkeydown =function (e){
            if(e.keyCode == 37){
                if(kirby_obj.position.x > -4)
                    kirby_obj.position.x -= 1;
                    
            }else if(e.keyCode == 39){
                if(kirby_obj.position.x < 4)
                    kirby_obj.position.x += 1;
                    
            }
            else if(e.keyCode == 38){
                if(kirby_obj.position.y < 3)
                    kirby_obj.position.y += 1;
                    
            }
            else if(e.keyCode == 40){
                if(kirby_obj.position.y > -3)
                    kirby_obj.position.y -= 1;
                    
            }
        }*/
             
    }
    catch(err)
    {
        console.error(err);
    }
}

function getClosestSnow(){
    let arrDistances = []
    arrSnow.forEach(snow => {
        //-----------------------Formula for finding the distance between 2 objects in 3d
        let distance = Math.sqrt((snow.position.x - LoKirby.position.x)**2 + 
                                (snow.position.y - LoKirby.position.y) **2 + 
                                (snow.position.z - LoKirby.position.z)**2)
                                
        arrDistances.push(distance)
    });
    let minimumdistance = arrDistances.min;
    let index = arrDistances.indexOf(minimumdistance);
    return arrSnow[index]

}

//Ring Creation-------------------------------------------------------------------------
//Rings that create the moving forward effect
function createRing1(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0xd10fd1});
    ring = new THREE.Mesh(geometry, material);
    rings.push(ring);
    scene.add(ring);
}

function createRing2(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0x33aa99});
    ring2 = new THREE.Mesh(geometry, material);
    rings.push(ring2);
    scene.add(ring2);
}

function createRing3(){
    const geometry = new THREE.RingGeometry(0.9,1,10);
    const material = new THREE.MeshBasicMaterial({color: 0xe8f05d});
    ring3 = new THREE.Mesh(geometry, material);
    rings.push(ring3);
    scene.add(ring3);
}

function createLoKirby1(){
    //-------Create and add to the scene
    const geometry = new THREE.SphereGeometry(0.15, 25, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xfedc8});
    LoKirby1 = new THREE.Mesh(geometry, material);
    scene.add(LoKirby1);
    arrKirbys.push(LoKirby1);

    //-------Position
    LoKirby1.position.x = 1
    LoKirby1.position.y = 1
    LoKirby1.position.z = 50;

    //------Hitbox
    LoKirbyBBox =  new THREE.BoxHelper(LoKirby1, 0x00ff00);
    LoKirbyBBox.update();
    LoKirbyBBox.visible = false;
}

function createLoKirby2(){
    //-------Create and add to the scene
    const geometry = new THREE.SphereGeometry(0.15, 25, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xfedc8});
    LoKirby2 = new THREE.Mesh(geometry, material);
    scene.add(LoKirby2);
    arrKirbys.push(LoKirby2);

    //-------Position
    LoKirby2.position.x = -1
    LoKirby2.position.y = 1
    LoKirby2.position.z = 50;

    //------Hitbox
    LoKirbyBBox =  new THREE.BoxHelper(LoKirby2, 0x00ff00);
    LoKirbyBBox.update();
    LoKirbyBBox.visible = false;
}

function createLoKirby3(){
    //-------Create and add to the scene
    const geometry = new THREE.SphereGeometry(0.15, 25, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xfedc8});
    LoKirby3 = new THREE.Mesh(geometry, material);
    scene.add(LoKirby3);
    arrKirbys.push(LoKirby3);

    //-------Position
    LoKirby3.position.x = 1
    LoKirby3.position.y = -1
    LoKirby3.position.z = 50;

    //------Hitbox
    LoKirbyBBox =  new THREE.BoxHelper(LoKirby3, 0x00ff00);
    LoKirbyBBox.update();
    LoKirbyBBox.visible = false;
}

function createLoKirby4(){
    //-------Create and add to the scene
    const geometry = new THREE.SphereGeometry(0.15, 25, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xfedc8});
    LoKirby4 = new THREE.Mesh(geometry, material);
    scene.add(LoKirby4);
    arrKirbys.push(LoKirby4);

    //-------Position
    LoKirby4.position.x = -1
    LoKirby4.position.y = -1
    LoKirby4.position.z = 50;

    //------Hitbox
    LoKirbyBBox =  new THREE.BoxHelper(LoKirby4, 0x00ff00);
    LoKirbyBBox.update();
    LoKirbyBBox.visible = false;
}

//sphere with ice cream texture, it's the power up
function createIceCream(){ 

    //-----Create 
    const textureUrl = "../images/pink.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const Material = new THREE.MeshBasicMaterial({map: texture});
    let geometry = new THREE.SphereGeometry(0.3,32,32);
    snow = new THREE.Mesh(geometry, Material);

    //-----ID
    snow.name = 'Snow number ' + snow_counter
    snow_counter += 1

    //----Position
    snow.position.z = 30;
    snow.position.x = randomInt(-4,4);
    snow.position.y = randomInt(-4,4);

    //---Hitbox
    snowBBox =  new THREE.BoxHelper(snow, 0x00ff00);
    snowBBox.update();
    snowBBox.visible = false;

    //-------Array 
    arrSnow.push(snow)

    scene.add(snow);
    scene.add(snowBBox);
}

//Cone with crital texture, similar to a bullet, this is the obstacle
function createCone(){ 
    //-----Create
    const geometry = new THREE.ConeGeometry(0.4, 4, 9);
    const textureUrl = "../images/cristal.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({map: texture});
    cone = new THREE.Mesh(geometry, material);
    
    //----ID Cone
    cone.name = 'Cone number' + coneCounter
    coneCounter += 1

    
    //----Position and Rotation of the cone
    cone.rotation.x = Math.PI/1.89; 
    cone.position.z = 10;
    cone.position.x = randomInt(-4, 4);
    cone.position.y= randomInt(-4, 4);
    
    //------Hitbox
    boxBBox =  new THREE.BoxHelper(cone, 0x00ff00);
    boxBBox.update();
    boxBBox.visible = false; 

    //Add to the array and to the scene
    arrBullets.push(cone)
    scene.add(cone);
    scene.add(boxBBox);

}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

/**
 * Updates the rotation of the objects in the scene
 */

function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

    //Recycling rings to save memory :D
    if(ring.position.z > 20 && rings.length<3)
        createRing2();
    if(ring.position.z > 40 && rings.length<4)
        createRing3();
    for(const ring of rings)
        if(ring.position.z > 60)
            ring.position.z = -10;
        else
            ring.position.z += 26*angle;
    

    //move the snowballs and erase 
    for(const snowball of arrSnow){
        snowball.position.z += 0.5

        //--------------------------------------------------------Kirby1
        if(snowball.position.x >= 0 && snowball.position.y >= 0){
            if(snowball.position.x > LoKirby1.position.x){
                LoKirby1.position.x += 0.25
            }
            if(snowball.position.y > LoKirby1.position.y){
                LoKirby1.position.y += 0.25
            }
            if(snowball.position.x < LoKirby1.position.x){
                LoKirby1.position.x -= 0.25
            }
            if(snowball.position.y < LoKirby1.position.y){
                LoKirby1.position.y -= 0.25
            }
        }
        
        //--------------------------------------------------------Kirby2
        if(snowball.position.x < 0 && snowball.position.y >= 0){
            if(snowball.position.x > LoKirby2.position.x){
                LoKirby2.position.x += 0.25
            }
            if(snowball.position.y > LoKirby2.position.y){
                LoKirby2.position.y += 0.25
            }
            if(snowball.position.x < LoKirby2.position.x){
                LoKirby2.position.x -= 0.25
            }
            if(snowball.position.y < LoKirby2.position.y){
                LoKirby2.position.y -= 0.25
            }
        }

        //-------------------------------------------------------------Kirby3
        if(snowball.position.x >= 0 && snowball.position.y < 0){
            if(snowball.position.x > LoKirby3.position.x){
                LoKirby3.position.x += 0.25
            }
            if(snowball.position.y > LoKirby3.position.y){
                LoKirby3.position.y += 0.25
            }
            if(snowball.position.x < LoKirby3.position.x){
                LoKirby3.position.x -= 0.25
            }
            if(snowball.position.y < LoKirby3.position.y){
                LoKirby3.position.y -= 0.25
            }
        }

        //-------------------------------------------------------------Kirby4
        if(snowball.position.x < 0 && snowball.position.y < 0){
            if(snowball.position.x > LoKirby4.position.x){
                LoKirby4.position.x += 0.25
            }
            if(snowball.position.y > LoKirby4.position.y){
                LoKirby4.position.y += 0.25
            }
            if(snowball.position.x < LoKirby4.position.x){
                LoKirby4.position.x -= 0.25
            }
            if(snowball.position.y < LoKirby4.position.y){
                LoKirby4.position.y -= 0.25
            }
        }
        
        if(snowball.position.z > 51){
            scene.remove(snowball)
            scene.remove(snowBBox)

            arrSnow.pop(snowball)
            createIceCream()
        }
    }

    //move cones/bullets and erase
    for (const bullet of arrBullets){
        bullet.position.z += 0.5

    
        //------------------------Kirby 1
        if(LoKirby1.position.x === bullet.position.x && LoKirby1.position.y === bullet.position.y){
            let randomMovement = randomInt(0,3);
            switch (randomMovement){
                case 0:
                    LoKirby1.position.x +=1;
                case 1:
                    LoKirby1.position.x -=1;
                case 2:
                    LoKirby1.position.y +=1;
                case 3:
                    LoKirby1.position.y -=1;
            }
        }
        //-------------------Kirby2
        if(LoKirby2.position.x === bullet.position.x && LoKirby2.position.y === bullet.position.y){
            let randomMovement = randomInt(0,3);
            switch (randomMovement){
                case 0:
                    LoKirby2.position.x +=1;
                case 1:
                    LoKirby2.position.x -=1;
                case 2:
                    LoKirby2.position.y +=1;
                case 3:
                    LoKirby2.position.y -=1;
            }
        }
        //----------------------Kirby3
        if(LoKirby3.position.x === bullet.position.x && LoKirby3.position.y === bullet.position.y){
            let randomMovement = randomInt(0,3);
            switch (randomMovement){
                case 0:
                    LoKirby3.position.x +=1;
                case 1:
                    LoKirby3.position.x -=1;
                case 2:
                    LoKirby3.position.y +=1;
                case 3:
                    LoKirby3.position.y -=1;
            }
        }
        //-----------------------Kirby4
        if(LoKirby4.position.x === bullet.position.x && LoKirby4.position.y === bullet.position.y){
            let randomMovement = randomInt(0,3);
            switch (randomMovement){
                case 0:
                    LoKirby4.position.x +=1;
                case 1:
                    LoKirby4.position.x -=1;
                case 2:
                    LoKirby4.position.y +=1;
                case 3:
                    LoKirby4.position.y -=1;
            }
        }
        if(bullet.position.z > 51){
            scene.remove(bullet)
            scene.remove(boxBBox)
            arrBullets.pop(bullet)
            createCone()
        }
    }

    //--------------------------------------------------------------AI

    //if(closestSnow){console.log("Closest Snow \n" + closestSnow.position)}
    arrBullets.forEach(bullet => {
        
        
    });
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render(scene, camera);
    //controls.update();

    //Update hitbox  
    //kirbysBBox.update();
    boxBBox.update();
    snowBBox.update();

    //Check for collisions
    const kirbyBox1 = new THREE.Box3().setFromObject(LoKirby1);
    const kirbyBox2 = new THREE.Box3().setFromObject(LoKirby2);
    const boxBox = new THREE.Box3().setFromObject(cone);
    const snowsBox = new THREE.Box3().setFromObject(snow);
    if(boxBox.intersectsBox(kirbyBox1)){
        localStorage.setItem("SCORE", JSON.stringify(score));
        //Bullet hit Kirby so Game Over :(
        //window.location.replace('gameOver.html')
    }
    if(boxBox.intersectsBox(kirbyBox2)){
        localStorage.setItem("SCORE", JSON.stringify(score));
        //Bullet hit Kirby so Game Over :(
        //window.location.replace('gameOver.html')
    }
    if(snowsBox.intersectsBox(kirbyBox1)){
        scene.remove(snow)
        //Kirby touched a snowball, points for the player
        powerUp();
    }
    if(snowsBox.intersectsBox(kirbyBox2)){
        scene.remove(snow)
        //Kirby touched a snowball, points for the player
        console.log("Hit 2\nPrevious: " + score)
        powerUp();
        console.log("Hit 2\n After: " + score)
    }
    
    animate();
    
}

//
function powerUp(){ //Function that gets called when the user hits a power up, the score goes up and sound effect is played
    loadSoundEffect()
    score +=10;
    const myDiv = document.getElementById("num_score");
    myDiv.innerHTML = score;
  }

  function loadSoundEffect(){
    // create an AudioListener and add it to the camera
    const listenerS = new THREE.AudioListener();
    scene.add( listenerS );

    // create a global audio source
    const sound = new THREE.Audio( listenerS );

    // load a sound and set it as the Audio object's buffer
    const audioLoaderS = new THREE.AudioLoader();
    audioLoaderS.load( '../images/sound/pop.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.05 );
        sound.play();
    });
  }

  function loadMusic(){
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    scene.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../images/sound/Caramelldansen.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.05 );
        sound.play();
    });
  }
/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 60;
    scene.add(camera);
    //Light
    const ambientLight = new THREE.AmbientLight(0xffccaa, 5);
    scene.add(ambientLight);
    //kirby model
    //loadGLTF('../models/obj/Kirbo.glb');
    createLoKirby1();
    createLoKirby2();
    createLoKirby3();
    createLoKirby4();

    //Music
    loadMusic();

}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize);