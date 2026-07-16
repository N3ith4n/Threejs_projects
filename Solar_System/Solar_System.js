import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 2000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-70, 100, 150);

const loader = new THREE.TextureLoader();

const textures = [
  loader.load('/resources/sun.jpg'),
  loader.load('/resources/mercury.jpg'),
  loader.load('/resources/venus.jpg'),
  loader.load('/resources/earth.jpg'),
  loader.load('/resources/mars.jpg'),
  loader.load('/resources/jupiter.jpg'),
  loader.load('/resources/saturn.jpg'),
  loader.load('/resources/uranus.jpg'),
  loader.load('/resources/neptune.jpg')
];

const distance = [0,20,32,45,58,82,110,140,165];

const planet_tilts = [7,2,177,23,25,5,27,98,30];

const orbit_speeds = [0.005,0.003,0.002,0.0015,0.0007,0.0005,0.0003,0.0002];

const spheres = [];

for (let i = 0; i < textures.length; i++) {

  const geometry = new THREE.SphereGeometry(0.1, 32, 32);

  let material;

  if (i === 0) {
    material = new THREE.MeshBasicMaterial({
        map: textures[i]
    });
  } else {
    material = new THREE.MeshStandardMaterial({
        map: textures[i]
    });
  }
  
  const sphere = new THREE.Mesh(geometry,material);

  sphere.rotation.z = THREE.MathUtils.degToRad(planet_tilts[i]);

  if (i === 6) {
    const geometry = new THREE.RingGeometry(0.122, 0.311, 64);
    const texture2 = loader.load('/resources/saturn ring.png');
    const material = new THREE.MeshStandardMaterial({ map: texture2, transparent: true, side: THREE.DoubleSide });
    const saturn_ring = new THREE.Mesh(geometry,material);
    saturn_ring.rotateX(Math.PI / 2)
    sphere.add(saturn_ring);
  }

  if (i === 7) {  
    const geometry = new THREE.RingGeometry(0.072, 0.22, 64);
    const texture3 = loader.load('/resources/uranus ring.png');
    const material = new THREE.MeshStandardMaterial({ map: texture3, transparent: true, side: THREE.DoubleSide });
    const uranus_ring = new THREE.Mesh(geometry,material);
    sphere.add(uranus_ring);
  }  

  sphere.position.set(distance[i], 0, 0); 

  scene.add(sphere);
  spheres.push(sphere);
}

const PointLight = new THREE.PointLight('#ffffff', 3000, 3000);
PointLight.position.copy(spheres[0].position);
scene.add(PointLight);
const Ambientlight = new THREE.AmbientLight('#333333');
scene.add(Ambientlight);

const orbits = [];

for (let i = 1; i < spheres.length; i++) {
  const orbit = new  THREE.Group();
  scene.add(orbit);

  orbit.add(spheres[i]);

  spheres[i].position.x = distance[i];

  orbits.push(orbit);
}

spheres[0].scale.setScalar(150); // Sun x7.5
spheres[1].scale.setScalar(10);  // Mercury /2
spheres[2].scale.setScalar(20);  // Venus ==
spheres[3].scale.setScalar(20);  // Earth default
spheres[4].scale.setScalar(10);  // Mars x25%
spheres[5].scale.setScalar(60); // Jupiter x2.5
spheres[6].scale.setScalar(45);  // Saturn x2.25
spheres[7].scale.setScalar(30);  // Uranus x1.5
spheres[8].scale.setScalar(30);  // Neptune x1.5

function animate( time ) {
  controls.update()
  renderer.render( scene, camera );
  requestAnimationFrame( animate );

  for (let i = 0; i < orbits.length; i++) {
    orbits[i].rotation.y += orbit_speeds[i];
  }
  
  spheres.forEach(sphere => {
  spheres[0].rotation.y += 0.00002; // Sun
  spheres[1].rotation.y += 0.00020; // Mercury
  spheres[2].rotation.y += 0.00005; // Venus
  spheres[3].rotation.y += 0.00030; // Earth
  spheres[4].rotation.y += 0.00025; // Mars
  spheres[5].rotation.y += 0.00060; // Jupiter
  spheres[6].rotation.y += 0.00050; // Saturn
  spheres[7].rotation.y += 0.00035; // Uranus
  spheres[8].rotation.y += 0.00016; // Neptune
      });

}
animate();
