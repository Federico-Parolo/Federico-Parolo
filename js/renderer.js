"use strict";
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.182.0/examples/jsm/controls/OrbitControls.js';
import { validateMatrix } from './main.js';


let mat = [];
let cubes = [];
let textureMaterials = new Map();
let orderOfDimentions = -1;
let BASECUBEDIM = 10;
let enableBaseTexture = true;

const GRID_SIZE = 20 * BASECUBEDIM;      // total width/height
const GRID_DIVS = 20;      // 1 unit per cell
const OFF = 0.001;
const NORMMATERIAL = new THREE.MeshBasicMaterial({
    color: 0x6f6f6f,
    transparent: true,
    opacity: 0.3,        // very low fill
    depthWrite: false,  // important for transparency
});
const OPAQUEMATERIAL = new THREE.MeshBasicMaterial({
    color: 0x1f1f1f,
    transparent: false,
    opacity: 1.0,        // very low fill
    depthWrite: true,  // important for transparency
});


//console.log("prima di loaded");
function initAxes() {
const xLineMaterial = new THREE.LineBasicMaterial({color : 0x0000FF});
const yLineMaterial = new THREE.LineBasicMaterial({color : 0x00FF00});
const zLineMaterial = new THREE.LineBasicMaterial({color : 0xFF0000});

const pointsX = [];
const pointsY = [];
const pointsZ = [];
pointsX.push(new THREE.Vector3(-100,0,0));
pointsX.push(new THREE.Vector3(100,0,0));
const xLineGeometry  = new THREE.BufferGeometry().setFromPoints(pointsX);
pointsY.push(new THREE.Vector3(0,-100,0));
pointsY.push(new THREE.Vector3(0,100,0));
const yLineGeometry  = new THREE.BufferGeometry().setFromPoints(pointsY);
pointsZ.push(new THREE.Vector3(0,0,-100));
pointsZ.push(new THREE.Vector3(0,0,100));
const zLineGeometry  = new THREE.BufferGeometry().setFromPoints(pointsZ);

const coneGeometry = new THREE.ConeGeometry(2,5,32);

const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
const yLine = new THREE.Line(yLineGeometry, yLineMaterial);
const zLine = new THREE.Line(zLineGeometry, zLineMaterial);

const xCone = new THREE.Mesh(coneGeometry,xLineMaterial);
const yCone = new THREE.Mesh(coneGeometry,yLineMaterial);
const zCone = new THREE.Mesh(coneGeometry,zLineMaterial);
xCone.position.set(102,0,0);
xCone.rotation.set(0,0,-Math.PI/2);
yCone.position.set(0,102,0);
zCone.position.set(0,0,102);
zCone.rotation.set(Math.PI/2,0,0);
scene.add(xLine);
scene.add(yLine);
scene.add(zLine);
scene.add(xCone);
scene.add(yCone);
scene.add(zCone);
}

function markByValue(n) {

    if (enableBaseTexture) {
        for (const element of cubes) {
            if (element.userData.value == n) {
                element.material = OPAQUEMATERIAL;
            }else {
                element.material = NORMMATERIAL;
            }
            element.material.needsUpdate = true;
        }
    }else {
        for (const element of cubes) {
        textureMaterials.delete(element.userData.value);
        //console.log(element.userData.value);
        if (element.userData.value == n) {
            generateTexture(n,true);
        } else {
            generateTexture(element.userData.value,false);
        }
        textureMaterials.get(element.userData.value).needsUpdate = true;
        element.material = textureMaterials.get(element.userData.value);
        element.material.needsUpdate = true;
    }
    }
}

function tuneGrid(grid, opacity = 0.05) {
  grid.material.transparent = true;
  grid.material.opacity = opacity;
  grid.material.depthWrite = false;
}


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x252525);
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera , renderer.domElement);

controls.enableDamping = true;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry( BASECUBEDIM,BASECUBEDIM,BASECUBEDIM );


const gridXZ = new THREE.GridHelper(
  GRID_SIZE,
  GRID_DIVS,
  0xffffff,
  0xffffff
);
const gridYZ = new THREE.GridHelper(
  GRID_SIZE,
  GRID_DIVS,
  0xffffff,
  0xffffff
);
const gridXY = new THREE.GridHelper(
  GRID_SIZE,
  GRID_DIVS,
  0xffffff,
  0xffffff
);


gridXZ.position.set(
  OFF,
  OFF,
  OFF
);
gridYZ.position.set(
  OFF,
  OFF,
  OFF
);
gridXY.position.set(
  OFF,
  OFF,
  OFF
);
gridYZ.rotation.set(Math.PI/2,0,0);
gridXY.rotation.set(0,0,Math.PI/2);


tuneGrid(gridXZ);
tuneGrid(gridYZ);
tuneGrid(gridXY);
scene.add(gridXZ);
scene.add(gridYZ);
scene.add(gridXY);

const generateTexture = (n,opaque) => {
    if (textureMaterials.get(n) == undefined) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);

        if(opaque) {
            ctx.fillStyle = "rgba(100,100,100 1.0)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }

        // Measure the text
        const metrics = ctx.measureText(n);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        // Center of the canvas
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Padding around text
        const paddingX = 60;
        const paddingY = 60;

        // Draw rounded rectangle background using roundRect
        ctx.fillStyle = "rgba(0,0,0,0.5)";  // semi-transparent background
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(
        cx - textWidth / 2 - paddingX,
        cy - textHeight / 2 - paddingY,
        textWidth + paddingX * 2,
        textHeight + paddingY * 2,
        10 // corner radius
        );
        ctx.fill();

        ctx.font = "bold 120px Arial";
        ctx.textAlign = "center"; // horizontal
        ctx.textBaseline = "middle"; // vertical
        
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.strokeText(n,canvas.width/2,canvas.height/2);

        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillText(n, canvas.width/2, canvas.height/2);
        
        ctx.lineWidth = 10 ;
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(0,canvas.height);
        ctx.lineTo(canvas.width,canvas.height);
        ctx.lineTo(canvas.width,0);
        ctx.stroke();
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.userData.canvas = canvas;
        texture.userData.ctx = ctx;
        texture.minFilter = THREE.LinearFilter; // smooth when scaled down
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true; // forces update

        const texMat = new THREE.MeshBasicMaterial({
            map : texture,
            color: 0xafafaf,
            transparent: true,
            opacity: 1.0,        
            depthWrite: false,  
        });
        textureMaterials.set(n,texMat);
    }
};




const generateMeshes = (dims) => {
    const dimLabel = document.querySelector("#matrixDim");
    let maxY = 0;
    let maxZ = 0;
    switch (Number(dims)) {

    case 1: // single array
        
        for (let i = 0; i< mat.length; ++i) { // todo next personalize mesh by the value to the element
        
            let cube;
            if (enableBaseTexture) {
                cube = new THREE.Mesh(geometry,NORMMATERIAL);
            } else {
                generateTexture(mat[i],false);
                cube = new THREE.Mesh(geometry,textureMaterials.get(mat[i]));
            }

            cube.position.set(i * BASECUBEDIM + BASECUBEDIM/2, BASECUBEDIM/2, BASECUBEDIM/2);
            cube.userData.value = mat[i];
            cubes.push(cube);
            scene.add(cube);
        }
        if (dimLabel) {
            const xAxis = document.querySelector("#xAxis");
            xAxis.innerText = mat.length;
        }
        break;
    case 2: // 2d matrix
        
        for (let x = 0; x < mat.length; ++x) {
            if (maxY < mat[x].length) maxY = mat[x].length;
            for (let y = 0; y < mat[x].length; ++y) {

                let cube;
                if (enableBaseTexture) {
                    cube = new THREE.Mesh(geometry,NORMMATERIAL);
                } else {
                    generateTexture(mat[x][y],false);
                    cube = new THREE.Mesh(geometry,textureMaterials.get(mat[x][y]));
                }

                cube.position.set(x * BASECUBEDIM + BASECUBEDIM/2, y * BASECUBEDIM + BASECUBEDIM/2, BASECUBEDIM/2);
                cube.userData.value = mat[x][y];
                cubes.push(cube);
                scene.add(cube);
            }
            
        }
        if (dimLabel) {
            const xAxis = document.querySelector("#xAxis");
            const mult1 = document.querySelector("#showOn2D");
            const yAxis = document.querySelector("#yAxis");
            xAxis.innerText = mat.length;
            mult1.innerText = "x";
            yAxis.innerText = maxY;
        }
        break;
    case 3: // 3d matrix
        
        for (let x = 0; x < mat.length; ++x) {
            if (maxY < mat[x].length) maxY = mat[x].length;
            for (let y = 0; y < mat[x].length; ++y) {
                if (maxZ < mat[x][y].length) maxZ = mat[x][y].length;
                for (let z = 0; z < mat[x][y].length; ++z) {

                    let cube;
                    if (enableBaseTexture) {
                        cube = new THREE.Mesh(geometry,NORMMATERIAL);
                    } else {
                        generateTexture(mat[x][y][z],false);
                        cube = new THREE.Mesh(geometry,textureMaterials.get(mat[x][y][z]));
                    }

                    cube.position.set(x * BASECUBEDIM + BASECUBEDIM/2, y * BASECUBEDIM + BASECUBEDIM/2, z * BASECUBEDIM + BASECUBEDIM/2);
                    cube.userData.value = mat[x][y][z];
                    cubes.push(cube);
                    scene.add(cube);
                }
            }
        }
        if (dimLabel) {
            const xAxis = document.querySelector("#xAxis");
            const mult1 = document.querySelector("#showOn2D");
            const yAxis = document.querySelector("#yAxis");
            const mult2 = document.querySelector("#showOn3D");
            const zAxis = document.querySelector("#zAxis");
            xAxis.innerText = mat.length;
            mult1.innerText = "x";
            yAxis.innerText = maxY;
            mult2.innerText = "x";
            zAxis.innerText = maxZ;
        }
        break;
    default:
        //
}
}

camera.position.set(150,150,150);
camera.lookAt(0,0,0);



renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


initAxes();




function animate() {
    
    //requestAnimationFrame(animate);
    controls.update();

    renderer.render( scene, camera );

}



window.addEventListener('load',() => {
    //console.log("loaded");
    let str = window.localStorage.getItem("matrix");
    
    try {
        mat = JSON.parse(str);
        const {isValid, depth} = validateMatrix(mat);
        orderOfDimentions = depth;
        if (!isValid) {
            throw new Error("error");
        }
        
    } catch (error) {
        alert("The format is not valid, please insert a valid JSON.");
        window.location.replace("/");
    } finally {
        //console.log(orderOfDimentions);
        //console.log(mat);
    }

    const markedValue = document.querySelector("#highlight");
    if (markedValue) {
        markedValue.addEventListener('click', (e) => {
            markedValue.value = "";
    });
    markedValue.addEventListener('keydown', (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                const val = markedValue.value.trim();
                if (/^-?\d+$/.test(val)) {
                    markByValue(Number(val));
                    markedValue.blur();
                } else {
                    markedValue.click();
                }
            }
        });
    }

    const enableTextures = document.querySelector("#enableNumbers");
    if (enableTextures) {
        enableTextures.addEventListener('change', () => {
            if (enableTextures.checked) {
                enableBaseTexture = false;
            } else {
                enableBaseTexture = true;
            }
            console.log(enableBaseTexture);
            markByValue(undefined);
            markedValue.click();
        }); 
    }


    generateMeshes(orderOfDimentions);
    //markByValue(5);
    
});