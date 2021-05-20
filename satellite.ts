import * as THREE from 'three';
import * as CANNON from 'cannon';

const makeSatellite = () => {
  const satelliteGroup = new THREE.Group();
  const satelliteMaterial = new THREE.MeshPhongMaterial({
    color: 0xefefef,
    shininess: 60,
    reflectivity: 1
  });

  const satelliteGeometries = {
    dish1: new THREE.CylinderGeometry(1, 0.125, 0.5, 32, 1),
    dish2: new THREE.CylinderGeometry(0.125, 1, 0.5, 32, 1),
    dishConnector: new THREE.CylinderGeometry(0.125, 0.125, 1.5, 32, 1),
    body: new THREE.CylinderGeometry(0.5, 0.5, 3, 32, 1),
    cone: new THREE.CylinderGeometry(0.25, 0.5, 1, 32, 1),
    rocket: new THREE.CylinderGeometry(0.25, 0.5, 1, 32, 1)
  };

  const satelliteBodies = {
    dish1: new THREE.Mesh(satelliteGeometries.dish1, satelliteMaterial),
    dish2: new THREE.Mesh(satelliteGeometries.dish2, satelliteMaterial),
    dishConnector: new THREE.Mesh(
      satelliteGeometries.dishConnector,
      satelliteMaterial
    ),
    body: new THREE.Mesh(satelliteGeometries.body, satelliteMaterial),
    cone: new THREE.Mesh(satelliteGeometries.cone, satelliteMaterial),
    rocket: new THREE.Mesh(satelliteGeometries.rocket, satelliteMaterial)
  };

  satelliteBodies.dish1.position.y = 1;
  satelliteBodies.dish2.position.y = -1;
  satelliteBodies.body.rotation.z = -(90 / 180) * Math.PI;
  satelliteBodies.cone.rotation.z = -(90 / 180) * Math.PI;
  satelliteBodies.cone.position.x = -2;
  satelliteBodies.rocket.rotation.z = -(90 / 180) * Math.PI;
  satelliteBodies.rocket.position.x = 2;

  Object.values(satelliteBodies).forEach(satelliteBody => {
    satelliteGroup.add(satelliteBody);
  });

  // satelliteGroup.scale.set(0.5, 0.5, 0.5);
  satelliteGroup.position.x = 8;
  satelliteGroup.rotation.z = (45 / 180) * Math.PI;
  satelliteGroup.rotation.y = (45 / 180) * Math.PI;

  return [satelliteGroup, null];
};

export { makeSatellite };
