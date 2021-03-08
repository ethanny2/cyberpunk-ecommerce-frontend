import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";
import { WEBGL } from "./detector";
import * as THREE from "three";
import flare1 from "../static/images/lensflare0.png";
import flare2 from "../static/images/lensflare2.jpg";
import flare3 from "../static/images/lensflare3.png";
import worldMtl from "../static/models/earth.mtl";
import earthTexture from "../static/models/earthTexture.jpg";
console.log(earthTexture);
import worldModel from "../static/models/earth.obj";
import skeletonModel from "../static/models/skeleton/plotting.dae";
import skyboxFront from "../static/images/skyboxes/ame_nebula/purplenebula_ft.png";
import skyboxBack from "../static/images/skyboxes/ame_nebula/purplenebula_bk.png";
import skyboxUp from "../static/images/skyboxes/ame_nebula/purplenebula_up.png";
import skyboxDown from "../static/images/skyboxes/ame_nebula/purplenebula_dn.png";
import skyboxRight from "../static/images/skyboxes/ame_nebula/purplenebula_rt.png";
import skyboxLeft from "../static/images/skyboxes/ame_nebula/purplenebula_lf.png";

if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  var container;
  var clock;
  var camera, scene, renderer;
  // var mesh, lightMesh, geometry;
  var spheres = [];
  // var directionalLight, pointLight;
  var mixer;
  var mouseX = 0;
  var mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  init();
  animate();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

// animate();
function init() {
  container = document.createElement("div");
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 5000;
  camera.position.y = -2000;
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
  dirLight.position.set(0, -1, 0).normalize();
  dirLight.color.setHSL(0.1, 0.7, 0.5);
  scene.add(dirLight);
  const manager = new THREE.LoadingManager();
  // Function to add the lens flare light
  var textureLoader = new THREE.TextureLoader();
  var textureFlare0 = textureLoader.load(flare1);
  var textureFlare2 = textureLoader.load(flare2);
  var textureFlare3 = textureLoader.load(flare3);
  addLight(0.55, 0.9, 0.6, 3500, 4000, -4000);
  function addLight(h, s, l, x, y, z) {
    var light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);
    var flareColor = new THREE.Color(0xffffff);
    flareColor.setHSL(h, s, l + 0.5);
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0.0, flareColor));
    lensflare.addElement(new LensflareElement(textureFlare2, 512, 0.0));
    lensflare.addElement(new LensflareElement(textureFlare2, 512, 0.0));
    lensflare.addElement(new LensflareElement(textureFlare2, 512, 0.0));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1.0));
    light.add(lensflare);
    scene.add(light);
  }
  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  const onError = function () {};
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  new MTLLoader(manager).setResourcePath("../static/models/").load(worldMtl, function (materials) {
    materials.preload();
    new OBJLoader(manager).setMaterials(materials).load(
      worldModel,
      function (object) {
        object.position.y = -95;
        object.scale.x = 3000;
        object.scale.y = 3000;
        object.scale.z = 3000;
        scene.add(object);
      },
      onProgress,
      onError
    );
  });

  /* Add skull obeject*/
  var loader = new ColladaLoader();
  //loader.options.convertUpAxis = true;
  loader.load(skeletonModel, function (collada) {
    var object = collada.scene;
    var animations = collada.animations;
    mixer = new THREE.AnimationMixer(object);
    var action = mixer.clipAction(animations[0]).play();
    object.scale.x = 2000;
    object.scale.y = 2000;
    object.scale.z = 2000;
    object.position.y = -200;
    object.position.x = -100;
    object.position.z = -1400;
    scene.add(object);
  });

  //load the skybox
  scene.background = new THREE.CubeTextureLoader().load([
    skyboxFront,
    skyboxBack,
    skyboxUp,
    skyboxDown,
    skyboxRight,
    skyboxLeft
  ]);
  let geometry = new THREE.SphereBufferGeometry(100, 32, 16);

  var material = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 0x12ff3d
  });
  for (var i = 0; i < 50; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
    scene.add(mesh);
    spheres.push(mesh);
  }

  //Create the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
} /* End of init function*/

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  //Camera control on mouse move events
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  var timer = 0.0001 * Date.now();
  //Move the spheres around the screen
  for (var i = 0, il = spheres.length; i < il; i++) {
    var sphere = spheres[i];
    sphere.position.x = 5000 * Math.cos(timer + i);
    sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
  }
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  var delta = clock.getDelta();
  if (mixer !== undefined) {
    mixer.update(delta);
  }
  renderer.render(scene, camera);
}
