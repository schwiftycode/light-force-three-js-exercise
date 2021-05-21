import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeRocket = () => {
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

  // rocketBodies.body.rotation.z = -(90 / 180) * Math.PI;
  // rocketBodies.cone.rotation.z = -(90 / 180) * Math.PI;
  // rocketBodies.cone.position.x = -2;
  // rocketBodies.rocket.rotation.z = -(90 / 180) * Math.PI;
  // rocketBodies.rocket.position.x = 2;

  Object.values(rocketBodies).forEach(rocketBody => {
    // rocketGroup.add(rocketBody);
  });

  // rocketGroup.position.x = -10;

  let rocketBodyGroup = {
    body: new CANNON.Body({
      mass: 700, // kg
      position: new CANNON.Vec3(-8, 0, 0), // m
      shape: new CANNON.Cylinder(0.5, 0.5, 3, 32)
      // velocity: new CANNON.Vec3(5.45, 0, 0)
    }),

    cone: new CANNON.Body({
      mass: 700, // kg
      position: new CANNON.Vec3(-6, 0, 0), // m
      shape: new CANNON.Cylinder(0.125, 0.5, 1, 32)
      // velocity: new CANNON.Vec3(5.45, 0, 0)
    }),

    rocket: new CANNON.Body({
      mass: 700, // kg
      position: new CANNON.Vec3(-10, 0, 0), // m
      shape: new CANNON.Cylinder(0.125, 0.5, 1, 32)
      // velocity: new CANNON.Vec3(5.45, 0, 0)
    })
  };

  // let rocketQuatZ = new CANNON.Quaternion();
  // let angleRadians = (-90 * Math.PI) / 180;

  // rocketQuatZ.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), angleRadians);
  // rocketBodyGroup.body.quaternion = rocketQuatZ;
  // rocketBodyGroup.cone.quaternion = rocketQuatZ;
  // rocketBodyGroup.rocket.quaternion = rocketQuatZ;

  return [rocketBodies, rocketBodyGroup];
};

export { makeRocket };
