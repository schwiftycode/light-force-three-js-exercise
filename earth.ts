import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeEarth = (geometry, cannonWorld = null) => {
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff
  });

  // const earthMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
  const earth = new THREE.Mesh(geometry, earthMaterial);
  earth.position.x = 5;
  earth.rotation.x = (23.4 / 180) * Math.PI;
  earth.receiveShadow = true;

  var earthBody = new CANNON.Body({
    mass: 0, // kg
    position: new CANNON.Vec3(
      earth.position.x,
      earth.position.y,
      earth.position.z
    ), // m
    shape: new CANNON.Sphere(5),
    linearDamping: 0
  });

  var axis = new CANNON.Vec3(1, 0, 0);
  var angle = Math.PI / 3;
  earthBody.quaternion.setFromAxisAngle(axis, angle);

  if (cannonWorld) {
    cannonWorld.add(earthBody);
  }
  return [earth, earthBody];
};

export { makeEarth };
