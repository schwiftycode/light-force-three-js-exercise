import * as THREE from 'three';
import * as CANNON from 'cannon';
import { makeEarth } from './earth.ts';
import { makeMoon } from './moon.ts';
import { makeSatellite } from './satellite.ts';
import { makeRocket } from './rocket.ts';

const width = 700;
const height = 500;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);

const cannonWorld = new CANNON.World();
cannonWorld.gravity.set(0, 0, 0);
let fixedTimeStep = 1.0 / 60.0; // seconds
let maxSubSteps = 3;

let lastTime;
(function simloop(time) {
  requestAnimationFrame(simloop);
  if (lastTime !== undefined && cannonWorld) {
    let dt = (time - lastTime) / 1000;
    cannonWorld.step(fixedTimeStep, dt, maxSubSteps);
  }
  lastTime = time;
})();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.insertBefore(renderer.domElement, document.body.children[0]);

const geometry = new THREE.SphereGeometry(
  3,
  50,
  50,
  0,
  Math.PI * 2,
  0,
  Math.PI * 2
);

const [earth, earthBody] = makeEarth(geometry, cannonWorld);

const [moon, moonBody] = makeMoon(geometry, cannonWorld);

const [satelliteGroup, satelliteBodyGroup] = makeSatellite(cannonWorld);

const [rocketGroup, rocketBodyGroup] = makeRocket(cannonWorld);

/* Sunlight */
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.x = 25;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
sunLight.castShadow = true;

const sunGroup = new THREE.Group();
sunGroup.position.x = 5;
sunGroup.rotation.x = (23.4 / 180) * Math.PI;
sunGroup.rotation.y = -(140 / 180) * Math.PI;

sunGroup.add(sunLight);

const light = new THREE.AmbientLight(0x101010); // soft white light
scene.add(light);
/* End Sunlight */

moon.add(satelliteGroup);
scene.add(rocketGroup);
earth.add(moon);
scene.add(earth);
scene.add(sunGroup);

camera.position.z = 15;

document
  .getElementById('satellite-position-button')
  .addEventListener('click', () => {
    let relativePosition = new THREE.Vector3();
    relativePosition.copy(satelliteGroup.position);
    satelliteGroup.localToWorld(relativePosition);
    earth.worldToLocal(relativePosition);
    document.getElementById(
      'satellite-position-text'
    ).innerHTML = `<p>${new Date().toLocaleString('en-US')} | x: ${
      relativePosition.x
    } | y: ${relativePosition.y} | z: ${relativePosition.z}</p>${
      document.getElementById('satellite-position-text').innerHTML
    }`;
  });

function render() {
  requestAnimationFrame(render);

  earth.position.set(
    earthBody.position.x,
    earthBody.position.y,
    earthBody.position.z
  );

  moonBody.position.set(moon.position.x, moon.position.y, moon.position.z);

  earth.rotation.y += 0.005;
  // earth.rotation.y += 0.01;
  moon.rotation.y -= 0.0175;

  rocketGroup.position.set(
    rocketBodyGroup.position.x,
    rocketBodyGroup.position.y,
    rocketBodyGroup.position.z
  );

  // if (rocketGroup.position.x > 20) {
  //   rocketGroup.position.x = -20;
  // }

  // rocketGroup.position.x += 0.04;

  renderer.render(scene, camera);
}

render();