import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeRocket = (cannonWorld = null) => {
  const rocketGroup = new THREE.Group();
  const rocketMaterial = new THREE.MeshPhongMaterial({
    color: 0xefefef,
    shininess: 60,
    reflectivity: 1
  });

  const rocketGeometries = {
    body: new THREE.CylinderGeometry(0.5, 0.5, 3, 32, 1),
    cone: new THREE.CylinderGeometry(0.125, 0.5, 1, 32, 1),
    rocket: new THREE.CylinderGeometry(0.25, 0.5, 1, 32, 1)
  };

  const rocketBodies = {
    body: new THREE.Mesh(rocketGeometries.body, rocketMaterial),
    cone: new THREE.Mesh(rocketGeometries.cone, rocketMaterial),
    rocket: new THREE.Mesh(rocketGeometries.rocket, rocketMaterial)
  };

  rocketBodies.body.rotation.z = -(90 / 180) * Math.PI;
  rocketBodies.cone.rotation.z = -(90 / 180) * Math.PI;
  rocketBodies.cone.position.x = -2;
  rocketBodies.rocket.rotation.z = -(90 / 180) * Math.PI;
  rocketBodies.rocket.position.x = 2;

  Object.values(rocketBodies).forEach(rocketBody => {
    rocketGroup.add(rocketBody);
  });

  rocketGroup.position.x = -10;

  let rocketBody = new CANNON.Body({
    mass: 70, // kg
    position: new CANNON.Vec3(-10, 0, 0), // m
    shape: new CANNON.Cylinder(0.5, 0.5, 5, 32),
    linearDamping: 0,
    velocity: new CANNON.Vec3(5.5, 0, 0)
  });
  if (cannonWorld) {
    cannonWorld.add(rocketBody);
  }
  return [rocketGroup, rocketBody];
};

export { makeRocket };
