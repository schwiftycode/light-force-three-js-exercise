import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeMoon = (geometry, cannonWorld = null) => {
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xefefef,
    emissive: 0xefefef,
    emissiveIntensity: 0.05
  });

  const moon = new THREE.Mesh(geometry, moonMaterial);
  moon.scale.set(0.2, 0.2, 0.2);
  moon.position.x = 10;
  moon.castShadow = true;

  var moonBody = new CANNON.Body({
    mass: 0, // kg
    position: new CANNON.Vec3(
      moon.position.x,
      moon.position.y,
      moon.position.z
    ), // m
    rotation: new CANNON.Vec3(
      moon.rotation.x,
      moon.rotation.y,
      moon.rotation.z
    ),
    shape: new CANNON.Sphere(3),
    linearDamping: 0,
    velocity: 0
  });

  if (cannonWorld) {
    cannonWorld.add(moonBody);
  }

  return [moon, moonBody];
};
export { makeMoon };
