import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "./lib/orbitControls";
import { GLTFLoader } from "./lib/GLTFLoader";

function App() {
  const ref = useRef();

  const [modelPath, setModelPath] = useState('./toyota_prius/scene.gltf');

  useEffect(() => {
    let refCurrent = ref.current;
    // Create scene
    const scene = new THREE.Scene();
    // Set background color
    scene.background = new THREE.Color(0xA9A9A9)

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50,
      refCurrent.clientWidth / refCurrent.clientHeight,
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
    renderer.setSize(refCurrent.clientWidth, refCurrent.clientHeight);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refCurrent.appendChild(renderer.domElement);

    // Control with mouse 
    let controls = new OrbitControls(camera, refCurrent);
    controls.update();

    let model, c, size; // model center and size  

    // --- data input ---
    let yRotation = 0;
    let xPosition = 0;
    let zPosition = 0;

    let loader = new GLTFLoader();
    // let car;
    loader.load(
      // URL
      modelPath,
      // Resource is loaded
      function (gltf) {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const boxHelper = new THREE.Box3Helper(box, '0xffff00');
        scene.add(boxHelper);
        scene.remove(boxHelper);

        c = box.getCenter(new THREE.Vector3());
        size = box.getSize(new THREE.Vector3());

        move(gltf);

        scene.add(gltf.scene);

        model = gltf;

        // car = gltf.scene.children[0];
        // car.scale.set(0.6, 0.6, 0.6);
        // scene.add(gltf.scene);
        // animate();
      },
    );

    animate();

    function animate() {
      requestAnimationFrame(animate);
      yRotation += 0.01;
      renderer.render(scene, camera);
      if (model) {
        move(model);
      }
    }

    function move(gltf) {
      gltf.scene.rotation.set(0, yRotation, 0);

      // rotate center
      const cz = c.z * Math.cos(yRotation) - c.x * Math.sin(yRotation);
      const cx = c.z * Math.sin(yRotation) + c.x * Math.cos(yRotation);

      gltf.scene.position.set(xPosition - cx, size.y / 2 - c.y, zPosition - cz)
    }

    return () => {
      // Callback to cleanup three js, cancel animationFrame, etc
      refCurrent.removeChild(refCurrent.firstChild);
    }
  }, [modelPath]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 800, height: 600, border: '5px solid black', borderRadius: 5, marginBottom: '2rem' }} ref={ref} />
      <div style={{ width: 800, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <button onClick={() => setModelPath('./toyota_prius/scene.gltf')}>Show Toyota Prius</button>
        <button onClick={() => setModelPath('./hyundai_accent/scene.gltf')}>Show Hyundai Accent</button>
      </div>
    </div>
  );
}

export default App;
