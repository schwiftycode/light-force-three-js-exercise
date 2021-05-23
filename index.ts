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
let fixedTimeStep = 1.0 / 60.0;
let maxSubSteps = 3;

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

const light = new THREE.AmbientLight(0x101010);
scene.add(light);
/* End Sunlight */

moon.add(satelliteGroup);
scene.add(rocketGroup.body);
scene.add(rocketGroup.cone);
scene.add(rocketGroup.rocket);
scene.add(moon);
scene.add(earth);
scene.add(sunGroup);

/* Cannon Constraints */
let moonHinge = new CANNON.HingeConstraint(earthBody, moonBody, {
  pivotA: new CANNON.Vec3(),
  axisA: new CANNON.Vec3(0, 1, 0),
  pivotB: new CANNON.Vec3(-10, 0, 0),
  axisB: new CANNON.Vec3(0, 1, 0)
});

let moonDistance = new CANNON.DistanceConstraint(earthBody, moonBody, 10);
moonDistance.enable;
/* End Cannon Constraints */

cannonWorld.addConstraint(moonHinge);
cannonWorld.addConstraint(moonDistance);

cannonWorld.add(earthBody);
cannonWorld.add(moonBody);
cannonWorld.add(rocketBodyGroup.body);
cannonWorld.add(rocketBodyGroup.cone);
cannonWorld.add(rocketBodyGroup.rocket);

camera.position.z = 15;
camera.position.y = 5;
camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-15 / 180) * Math.PI);

/* Relative Position Button */
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
/* End Relative Position Button */

/* Update Cannon.js Physics */
function updatePhysics(threeBody, cannonBody) {
  threeBody.position.set(
    cannonBody.position.x,
    cannonBody.position.y,
    cannonBody.position.z
  );

  const bodyRotation = {
    x: (cannonBody.quaternion.x / Math.PI) * 180,
    y: (cannonBody.quaternion.y / Math.PI) * 180,
    z: (cannonBody.quaternion.z / Math.PI) * 180
  };

  threeBody.setRotationFromQuaternion(
    new THREE.Quaternion(
      cannonBody.quaternion.x,
      cannonBody.quaternion.y,
      cannonBody.quaternion.z,
      cannonBody.quaternion.w
    )
  );
}
/* End Update Cannon.js Physics */

/* Render */
let moonRotation = 0;
function render() {
  updatePhysics(earth, earthBody);
  updatePhysics(moon, moonBody);

  moonRotation += 0.005;
  moon.rotation.y = moonRotation;

  updatePhysics(rocketGroup.body, rocketBodyGroup.body);
  updatePhysics(rocketGroup.cone, rocketBodyGroup.cone);
  updatePhysics(rocketGroup.rocket, rocketBodyGroup.rocket);

  renderer.render(scene, camera);
}
/* End Render */

/* Cannon.js Simulation Loop */
let lastTime;
let angleY = 0;
(function simloop(time) {
  requestAnimationFrame(simloop);
  if (lastTime !== undefined && cannonWorld) {
    let dt = (time - lastTime) / 1000;
    cannonWorld.step(fixedTimeStep, dt, maxSubSteps);
  }

  let quatY = new CANNON.Quaternion();
  angleY += 0.005;
  if (angleY > 360) {
    angleY = 0;
  }
  quatY.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    (angleY * Math.PI) / Math.PI
  );
  earthBody.quaternion = quatY;

  render();
  lastTime = time;
})();
/* End Cannon.js Simulation Loop */

render();
