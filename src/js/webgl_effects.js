import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";
import { WEBGL } from "./detector";
import * as THREE from "three";
import flare1 from "../static/images/lensflare0.png";
import flare2 from "../static/images/lensflare2.jpg";
import flare3 from "../static/images/lensflare3.png";
import worldModel from "../static/models/earth.gltf";
import skeletonModel from "../static/models/skeleton/plotting.gltf";
import skyboxFront from "../static/images/skyboxes/ame_nebula/purplenebula_ft.jpg";
import skyboxBack from "../static/images/skyboxes/ame_nebula/purplenebula_bk.jpg";
import skyboxUp from "../static/images/skyboxes/ame_nebula/purplenebula_up.jpg";
import skyboxDown from "../static/images/skyboxes/ame_nebula/purplenebula_dn.jpg";
import skyboxRight from "../static/images/skyboxes/ame_nebula/purplenebula_rt.jpg";
import skyboxLeft from "../static/images/skyboxes/ame_nebula/purplenebula_lf.jpg";
import { registerNavEvent, handleCommandLineMessage } from "../js/index";
import "intersection-observer";
import { updateCartDisplay } from "./cart";
const dracoDecodePath = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/";
var container;
var clock;
var camera, scene, renderer;
var spheres = [];
var mixer;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
const introMessage =
  "Elseif is an online clothing store created as a collaboration between a programmer and a designer. Products range from modern clothing to fan merchandise for current artists. The brand name and logo is tentative and subject to change .";

// THREE.Cache.enabled = true;

const loadingScreen = document.getElementById("loader-wrap");
loadingScreen.addEventListener("transitionend", onTransitionEnd);

function handleOrientation(event) {
  var beta = event.beta; // x-axis -180- 180
  mouseY = (beta * 5 - windowHalfY) * 0.3;
}

function onTransitionEnd(event) {
  event.target.remove();
}

function createObserver() {
  const cmd = document.getElementsByClassName("typing")[0];
  let observer;
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: [0.5]
  };
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(cmd);
}

function handleIntersect(entries, observer) {
  const cmd = document.getElementsByClassName("typing")[0];
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0.5) {
      handleCommandLineMessage(introMessage);
      // Only happens once
      observer.unobserve(cmd);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (WEBGL.isWebGLAvailable()) {
    updateCartDisplay();
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    if (isTouchEnabled()) window.addEventListener("deviceorientation", handleOrientation);
    registerNavEvent(onWindowResize);
    createObserver();
    init();
    animate();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
});

function init() {
  container = document.getElementById("scene");
  const main = document.getElementsByTagName("main")[0];
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 50;
  camera.position.y = 5;
  camera.position.x = 3;
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
  dirLight.position.set(0, -1, 0).normalize();
  dirLight.color.setHSL(0.1, 0.7, 0.5);
  scene.add(dirLight);
  const manager = new THREE.LoadingManager();
  let root = document.documentElement;
  const loadingScreen = document.getElementById("loader-wrap");
  manager.onLoad = function () {
    loadingScreen.classList.add("fade-out");
    // container.children[0].remove();
    // root.style.setProperty("--navZIndex", "1007");
    // document.getElementsByTagName("main")[0].classList.remove("hidden");
  };
  /* Sometimes the loader will not trigger onLoad*/
  if (!loadingScreen.classList.contains("fade-out")) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      // root.style.setProperty("--navZIndex", "1007");
      // document.getElementsByTagName("main")[0].classList.remove("hidden");
    }, 2000);
  }
  // Function to add the lens flare light
  var textureLoader = new THREE.TextureLoader();
  var textureFlare0 = textureLoader.load(flare1);
  var textureFlare2 = textureLoader.load(flare2);
  var textureFlare3 = textureLoader.load(flare3);
  addLight(0.55, 0.9, 0.6, 300, 525, -2000);
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
    }
  };

  const onError = function (url) {
    alert("There was an error loading " + url);
  };
  // var ambient = new THREE.AmbientLight(0x444444);
  var ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);
  const loader = new GLTFLoader(manager);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecodePath);
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    worldModel,
    function (gltf) {
      gltf.scene.position.y = 0;
      gltf.scene.position.x = 3;
      gltf.scene.position.z = 11;
      gltf.scene.scale.x = 18;
      gltf.scene.scale.y = 18;
      gltf.scene.scale.z = 18;
      scene.add(gltf.scene);
    },
    onProgress,
    onError
  );
  /* Add skull obeject*/
  loader.load(
    skeletonModel,
    function (gltf) {
      var animations = gltf.animations;
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.clipAction(animations[0]).play();
      gltf.scene.position.y = -1;
      gltf.scene.scale.x = 1500;
      gltf.scene.scale.y = 1500;
      gltf.scene.scale.z = 1500;
      scene.add(gltf.scene);
    },
    onProgress,
    onError
  );

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
    mesh.position.x = Math.random() * 5000 - 2500;
    mesh.position.y = Math.random() * 5000 - 2500;
    mesh.position.z = Math.random() * 5000 - 2500;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
    scene.add(mesh);
    spheres.push(mesh);
  }

  //Create the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xc5c5c3);
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
  mouseX = (event.clientX - windowHalfX) * 0.05;
  mouseY = (event.clientY - windowHalfY) * 0.05;
}

function isTouchEnabled() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
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
