import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "./lib/orbitControls";
import { GLTFLoader } from "./lib/GLTFLoader";

function App() {
  const ref = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    // Set background color
    scene.background = new THREE.Color(0xA9A9A9)

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.5,
      3000
    );

    // not sure what this does
    // camera.rotation.y = 45 / 180 * Math.PI;

    // x, y, z
    camera.position.set(5, 1, -5);

    // Light config
    let ambienLight = new THREE.AmbientLight(0x404040);
    scene.add(ambienLight);

    let directionalLight = new THREE.DirectionalLight(0x404040, 6);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    let light = new THREE.PointLight(0x404040, 6);
    light.position.set(0, 300, 500);
    scene.add(light);
    let light2 = new THREE.PointLight(0x404040, 6);
    light2.position.set(500, 100, 0);
    scene.add(light2);
    let light3 = new THREE.PointLight(0x404040, 6);
    light3.position.set(0, 100, -500);
    scene.add(light3);
    let light4 = new THREE.PointLight(0x404040, 6);
    light4.position.set(-500, 300, 500);
    scene.add(light4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    ref.current.appendChild(renderer.domElement);

    let loader = new GLTFLoader();
    let car;
    loader.load(
      // URL
      './toyota_prius/scene.gltf',
      // Resource is loaded
      function (gltf) {
        car = gltf.scene.children[0];
        car.scale.set(0.6, 0.6, 0.6);
        scene.add(gltf.scene);
        animate();
      },
      // called while loading is progressing
      function (xhr) {
        // Not usefull right now since asset is local
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }
    );

    let controls = new OrbitControls(camera, ref.current);

    // controls.autoRotate = true;

    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      // Control with mouse 
      controls.update();
      if (car) {
        // car.rotation.x += 0.01;
        // car.position.x += 0.01;
      }
    }

    animate();

    return () => {
      // Callback to cleanup three js, cancel animationFrame, etc
    }
  }, []);

  return <div ref={ref} />;
}

export default App;
