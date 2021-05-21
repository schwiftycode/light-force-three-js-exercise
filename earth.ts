import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeEarth = geometry => {
  const earthMatURL =
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg';

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff
  });

  // const earthMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
  const earth = new THREE.Mesh(geometry, earthMaterial);
  earth.rotation.x = (23.4 / 180) * Math.PI;
  earth.receiveShadow = true;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'Anonymous';
  textureLoader.load(
    earthMatURL,
    texture => {
      earth.material.map = texture;
      earth.material.color = new THREE.Color(0xffffff);
      earth.material.needsUpdate = true;
    },
    progress => {},
    err => {
      console.log(err);
    }
  );

  let earthBody = new CANNON.Body({
    mass: 5.972 * Math.pow(10, 24), // kg
    position: new CANNON.Vec3(5, 0, 0), // m
    shape: new CANNON.Sphere(5),
    linearDamping: 0
    // velocity: new CANNON.Vec3(0, 0, 0)
  });

  return [earth, earthBody];
};

export { makeEarth };
