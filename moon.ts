import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeMoon = geometry => {
  const moonMatURL =
    'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg';

  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xefefef,
    emissive: 0xefefef,
    emissiveIntensity: 0.05
  });

  const moon = new THREE.Mesh(geometry, moonMaterial);
  moon.scale.set(0.2, 0.2, 0.2);
  moon.castShadow = true;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'Anonymous';
  textureLoader.load(
    moonMatURL,
    texture => {
      moon.material.map = texture;
      moon.material.color = new THREE.Color(0xffffff);
      moon.material.needsUpdate = true;
    },
    progress => {},
    err => {
      console.log(err);
    }
  );

  var moonBody = new CANNON.Body({
    mass: 7.3476 * Math.pow(10, 22), // kg
    // position: new CANNON.Vec3(10, 0, 0), // m
    // rotation: new CANNON.Vec3(0, 0, 0),
    scale: new CANNON.Vec3(0.2, 0.2, 0.2),
    shape: new CANNON.Sphere(3),
    linearDamping: 0
    // velocity: new CANNON.Vec3(0, 0, 0)
  });

  return [moon, moonBody];
};
export { makeMoon };
