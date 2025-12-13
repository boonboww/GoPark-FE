"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin, DollarSign, User, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  pricePerHour: number;
  avtImage: string;
  owner?: string;
}

export default function CarMaterialsScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const router = useRouter();
  
  const [isSceneReady, setIsSceneReady] = useState(false);
  
  // Refs to access state inside useEffect/animate loop
  const isPausedRef = useRef(isPaused);
  const movingObjectsRef = useRef<any[]>([]);
  const cameraRef = useRef<any>(null);
  const materialsRef = useRef<{ body?: any; details?: any; glass?: any }>({});

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const handleZoom = (delta: number) => {
    console.log("Zooming", delta, cameraRef.current);
    if (cameraRef.current) {
      const newZoom = cameraRef.current.zoom + delta;
      if (newZoom > 0.5 && newZoom < 3) {
        cameraRef.current.zoom = newZoom;
        cameraRef.current.updateProjectionMatrix();
      }
    }
  };

  useEffect(() => {
    let isCancelled = false;
    let camera: any,
      scene: any,
      renderer: any,
      controls: any,
      stats: any,
      raycaster: any,
      mouse: any;

    const segmentLength = 40;
    const totalSegments = 10;
    const worldLength = segmentLength * totalSegments;

    const wheels: any[] = [];
    let carModelTemplate: any = null;
    const lotsRef: any[] = []; // Store fetched lots

    (async () => {
      try {
      if (isCancelled) return;

      const THREE = await import("three");
      const Stats = (await import("three/addons/libs/stats.module.js")).default;
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );
      const { GLTFLoader } = await import(
        "three/addons/loaders/GLTFLoader.js"
      );
      const { DRACOLoader } = await import(
        "three/addons/loaders/DRACOLoader.js"
      );
      const { HDRLoader } = await import(
        "three/addons/loaders/HDRLoader.js"
      );
      const { FontLoader } = await import("three/addons/loaders/FontLoader.js");
      const { TextGeometry } = await import("three/addons/geometries/TextGeometry.js");

      if (isCancelled) return;

      // Raycaster setup
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animate);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);
      }

      // Click Handler
      const onMouseClick = (event: MouseEvent) => {
        if (!isPausedRef.current) return; // Only interact when paused

        // Calculate mouse position in normalized device coordinates
        // Use container dimensions instead of window
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check intersections with parking lot meshes
        const parkingLotGroups = movingObjectsRef.current
          .filter(obj => obj.type === 'parkingLot')
          .map(obj => obj.mesh);

        const intersects = raycaster.intersectObjects(parkingLotGroups, true);

        if (intersects.length > 0) {
          let object = intersects[0].object;
          // Traverse up to find the group with userData.lot
          while (object) {
            if (object.userData && object.userData.lot) {
              setSelectedLot(object.userData.lot);
              break;
            }
            if (object.parent === scene || !object.parent) break;
            object = object.parent;
          }
        }
      };

      window.addEventListener('click', onMouseClick);

      // Stats
      // stats = new Stats();
      // containerRef.current?.appendChild(stats.dom);

      // Camera
      camera = new THREE.PerspectiveCamera(
        40,
        width / height,
        0.1,
        100
      );
      camera.position.set(4.25, 1.4, -4.5);
      
      if (!isCancelled) {
        cameraRef.current = camera;
      }

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxDistance = 9;
      controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
      controls.target.set(0, 0.5, 0);
      controls.enableZoom = false; // Disable scroll zoom
      controls.update();

      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc); // Updated background color
      
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      new HDRLoader().load(
        "textures/equirectangular/venice_sunset_1k.hdr",
        (texture) => {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap;
          texture.dispose();
          pmremGenerator.dispose();
        }
      );

      scene.fog = new THREE.Fog(0xcccccc, 10, 90); // Updated fog color

      // LIGHTS (Added to match MapControlsScene style)
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
      dirLight1.position.set(1, 1, 1);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
      dirLight2.position.set(-1, -1, -1);
      scene.add(dirLight2);

      // Moving Objects Container
      // Variables moved to outer scope

      // Road Material
      const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

      // Helper: Create Cross Road
      const createCrossRoad = (z: number) => {
        const group = new THREE.Group();
        
        // Cross Road Plane
        const crossRoad = new THREE.Mesh(
          new THREE.PlaneGeometry(120, 20),
          roadMaterial
        );
        crossRoad.rotation.x = -Math.PI / 2;
        crossRoad.position.y = 0.02; // Slightly above main road
        group.add(crossRoad);

        // Traffic Lights at corners
        const corners = [
          { x: -12, z: -12 }, { x: 12, z: -12 },
          { x: -12, z: 12 }, { x: 12, z: 12 }
        ];
        
        corners.forEach(pos => {
          const tl = createTrafficLight(pos.x, pos.z);
          // Adjust position relative to group center
          tl.position.set(pos.x, 0, pos.z);
          // Remove from scene and add to group because createTrafficLight adds to scene
          scene.remove(tl); 
          group.add(tl);
        });

        group.position.z = z;
        scene.add(group);
        movingObjectsRef.current.push({ mesh: group, type: 'crossroad' });
      };

      // Helper: Create Low Poly Car (MapControlsScene Style)
      const createLowPolyCar = (color: number) => {
        const carGroup = new THREE.Group();
        
        // Scale factor to match MapControlsScene (approx 1/20)
        const s = 0.05;

        // Car Body
        const bodyGeo = new THREE.BoxGeometry(60 * s, 15 * s, 30 * s);
        const bodyMat = new THREE.MeshStandardMaterial({ color: color, flatShading: true });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 12 * s;
        carGroup.add(body);

        // Car Cabin
        const cabinGeo = new THREE.BoxGeometry(35 * s, 12 * s, 24 * s);
        const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.x = -6 * s;
        cabin.position.y = 25.5 * s;
        carGroup.add(cabin);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(6 * s, 6 * s, 6 * s, 32);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        
        const wheelPositions = [
          { x: -18 * s, z: 15 * s },
          { x: 18 * s, z: 15 * s },
          { x: -18 * s, z: -15 * s },
          { x: 18 * s, z: -15 * s },
        ];

        wheelPositions.forEach(pos => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(pos.x, 6 * s, pos.z);
          carGroup.add(wheel);
        });

        return carGroup;
      };

      // Helper: Create Parking Lot Model
      const createParkingLotModel = (x: number, z: number) => {
        const group = new THREE.Group();
        
        // Base (Asphalt)
        const base = new THREE.Mesh(
          new THREE.PlaneGeometry(12, 12),
          new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 })
        );
        base.rotation.x = -Math.PI / 2;
        base.position.y = 0.02;
        group.add(base);

        // Parking Lines & Cars
        const lineGeo = new THREE.PlaneGeometry(0.2, 4);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for(let i=0; i<4; i++) {
           const zPos = -3 + i * 2.5;

           // Left side lines
           const l1 = new THREE.Mesh(lineGeo, lineMat);
           l1.rotation.x = -Math.PI / 2;
           l1.position.set(-3, 0.03, zPos);
           group.add(l1);
           
           // Add car to left spot? (Random chance)
           if (Math.random() > 0.4 && carModelTemplate) {
             const car = carModelTemplate.clone();
             
             // Randomize Color
             const body = car.getObjectByName("body");
             if (body) {
                body.material = body.material.clone();
                body.material.color.setHex(Math.random() * 0xffffff);
             }

             // Scale down to fit parking spot (Ferrari is quite large)
             // Increased scale from 0.65 to 0.8 as requested
             car.scale.set(0.8, 0.8, 0.8);
             
             // Position
             car.position.set(-4.5, 0, zPos);
             // Rotate to face out or in? Let's face out (towards road)
             car.rotation.y = Math.PI / 2; 
             
             group.add(car);
           }

           // Right side lines
           const l2 = new THREE.Mesh(lineGeo, lineMat);
           l2.rotation.x = -Math.PI / 2;
           l2.position.set(3, 0.03, zPos);
           group.add(l2);

           // Add car to right spot? (Random chance)
           if (Math.random() > 0.4 && carModelTemplate) {
             const car = carModelTemplate.clone();
             
             // Randomize Color
             const body = car.getObjectByName("body");
             if (body) {
                body.material = body.material.clone();
                body.material.color.setHex(Math.random() * 0xffffff);
             }

             // Increased scale from 0.65 to 0.8 as requested
             car.scale.set(0.8, 0.8, 0.8);
             car.position.set(4.5, 0, zPos);
             car.rotation.y = -Math.PI / 2;
             
             group.add(car);
           }
        }

        // Sign Pole (Normal size)
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 3),
          new THREE.MeshStandardMaterial({ color: 0x888888 })
        );
        // Moved to x=-7 to avoid hitting cars
        pole.position.set(-7, 1.5, 5);
        group.add(pole);
        
        // Sign Box (P sign - Normal size)
        const signBox = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 0.1),
          new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        signBox.position.set(-7, 3, 5);
        group.add(signBox);
        
        // "P" Text (White Square for now)
        const pSquare = new THREE.Mesh(
          new THREE.PlaneGeometry(0.6, 0.6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        pSquare.position.set(-7, 3, 5.06);
        group.add(pSquare);

        // Billboard Pole (For Info Card - Lowered)
        const billboardPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 4), // Height reduced from 6 to 4
          new THREE.MeshStandardMaterial({ color: 0x444444 })
        );
        // Positioned at x=-7, z=2
        billboardPole.position.set(-7, 2, 2); 
        group.add(billboardPole);

        // Create Billboard Mesh (Always create it, update texture later)
        // Initialize with a white texture to ensure map slot exists
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) { ctx.fillStyle = 'white'; ctx.fillRect(0,0,1,1); }
        const defaultTexture = new THREE.CanvasTexture(canvas);

        const card = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 6),
            new THREE.MeshBasicMaterial({ map: defaultTexture, side: THREE.DoubleSide }) 
        );
        // Lowered position: Pole top is at y=4. Card height is 6. Center at y=7 sits on top.
        // User wanted it lower, so let's overlap slightly or just sit lower.
        // Let's set y=6.5
        card.position.set(-7, 6.5, 2);
        card.name = "infoCard"; // Name it to find it later
        group.add(card);

        // If we already have data, apply it immediately
        if (lotsRef.length > 0) {
            // Use a deterministic way to pick a lot based on position or index if possible
            // But here we don't have index easily. Random is fine for now.
            const lot = lotsRef[Math.floor(Math.random() * lotsRef.length)];
            group.userData.lot = lot;
            const texture = createCardTexture(lot);
            (card.material as any).map = texture;
            (card.material as any).needsUpdate = true;
        }

        group.position.set(x, 0, z);
        scene.add(group);
        movingObjectsRef.current.push({ mesh: group, type: 'parkingLot' });
      };

      // Helper: Create GoPark 3D Text
      const createGoParkText = (x: number, z: number) => {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
          if (isCancelled) return;
          
          const textGeo = new TextGeometry('GoPark', {
            font: font,
            size: 2, 
            depth: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
          });
          
          textGeo.computeBoundingBox();
          const textWidth = textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x;
          const textCenterY = (textGeo.boundingBox!.max.y + textGeo.boundingBox!.min.y) / 2;
          textGeo.translate(-textWidth / 2, -textCenterY, 0);

          const textMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x156289, 
              specular: 0x111111,
              shininess: 200
          });
          const textMesh = new THREE.Mesh(textGeo, textMaterial);
          
          // Position
          // y=1 puts it on the ground (since height is ~2 and centered at 0)
          textMesh.position.set(x, 1, z); 
          // Rotate to face the road
          textMesh.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2;

          scene.add(textMesh);
          movingObjectsRef.current.push({ mesh: textMesh, type: 'prop' });
        });
      };

      // Helper: Create Straight Segment
      const createStraightSegment = (z: number) => {
        // Dashed Line
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(0.2, segmentLength),
          lineMaterial
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.01, z);
        scene.add(line);
        movingObjectsRef.current.push({ mesh: line, type: 'roadLine' });

        // Houses or Parking Lots
        // Left side
        if (Math.random() > 0.7) {
           createParkingLotModel(-18, z);
        } else if (Math.random() > 0.3) {
           createHouse(-15 - Math.random() * 10, z);
        }

        // Background blocks (Far Left)
        if (Math.random() > 0.4) {
           createHouse(-35 - Math.random() * 20, z);
        }

        // Right side
        if (Math.random() > 0.7) {
           createParkingLotModel(18, z);
           // Add GoPark text beside the parking lot (in the empty space)
           createGoParkText(14, z + 14);
        } else if (Math.random() > 0.3) {
           createHouse(15 + Math.random() * 10, z);
        }

        // Background blocks (Far Right)
        if (Math.random() > 0.4) {
           createHouse(35 + Math.random() * 20, z);
        }
      };

      // Helper: Create House (Block Style)
      const createHouse = (x: number, z: number) => {
        // Block dimensions
        const width = 4 + Math.random() * 4;
        const depth = 4 + Math.random() * 4;
        const height = 10 + Math.random() * 30; // Taller blocks
        
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xeeeeee,
          flatShading: true 
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, height / 2, z);
        
        scene.add(mesh);
        movingObjectsRef.current.push({ mesh: mesh, type: 'prop' });
      };

      // Helper: Create Traffic Light
      const createTrafficLight = (x: number, z: number) => {
        const group = new THREE.Group();
        
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 4),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        pole.position.y = 2;
        group.add(pole);

        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 1.2, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        box.position.y = 3.5;
        group.add(box);

        // Lights
        const colors = [0xff0000, 0xffff00, 0x00ff00];
        colors.forEach((c, i) => {
          const light = new THREE.Mesh(
            new THREE.CircleGeometry(0.15),
            new THREE.MeshBasicMaterial({ color: c })
          );
          light.position.set(0, 3.8 - i * 0.3, 0.26);
          group.add(light);
        });

        group.position.set(x, 0, z);
        scene.add(group);
        // movingObjectsRef.current.push({ mesh: group, type: 'prop' }); // Don't add here, handled by caller
        return group;
      };

      // Road Base (Static)
      const roadGeometry = new THREE.PlaneGeometry(20, worldLength + 200); // Extra long
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.z = -worldLength / 2; 
      scene.add(road);

      // Grass Base (Static)
      const grassGeometry = new THREE.PlaneGeometry(200, worldLength + 200);
      const grassMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Match bg
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(0, -0.1, -worldLength / 2);
      scene.add(grass);

      // Generate World Segments
      // Moved to inside loader callback to ensure car model is ready
      // for (let i = 0; i < totalSegments; i++) {
      //   const z = 20 - (i * segmentLength);
      //   
      //   // Every 4th segment is an intersection
      //   if (i > 0 && i % 4 === 0) {
      //     createCrossRoad(z);
      //   } else {
      //     createStraightSegment(z);
      //   }
      // }

      // Helper: Create Parking Card
      const createCardTexture = (lot: ParkingLot) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const texture = new THREE.CanvasTexture(canvas);
        
        const draw = (img?: HTMLImageElement) => {
          if (!ctx) return;
          
          // Background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(0, 0, 512, 512);
          
          // Border
          ctx.strokeStyle = '#007bff';
          ctx.lineWidth = 15;
          ctx.strokeRect(0, 0, 512, 512);

          // Text
          ctx.fillStyle = '#333';
          ctx.textAlign = 'center';
          
          // Name
          ctx.font = 'bold 40px Arial';
          ctx.fillText(lot.name, 256, 60);
          
          // Price
          ctx.fillStyle = '#d32f2f';
          ctx.font = 'bold 50px Arial';
          ctx.fillText(`${lot.pricePerHour.toLocaleString()} VND/h`, 256, 130);

          // Address
          ctx.fillStyle = '#666';
          ctx.font = '30px Arial';
          const words = lot.address.split(' ');
          let line = '';
          let y = 180;
          for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 460 && n > 0) {
              ctx.fillText(line, 256, y);
              line = words[n] + ' ';
              y += 40;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 256, y);

          // Image
          if (img) {
            // Draw loaded image
            // Maintain aspect ratio or fill? Let's fill a box
            ctx.drawImage(img, 56, y + 20, 400, 200);
          } else {
            // Placeholder
            ctx.fillStyle = '#eee';
            ctx.fillRect(56, y + 20, 400, 200);
            ctx.fillStyle = '#aaa';
            ctx.font = '40px Arial';
            ctx.fillText("Loading...", 256, y + 130);
          }
          
          texture.needsUpdate = true;
        };

        // Initial draw
        draw();

        // Load Image
        if (lot.avtImage) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = lot.avtImage;
          img.onload = () => draw(img);
        }

        return texture;
      };

      // Generate Initial Environment
      // for (let i = 0; i < 20; i++) {
      //   const z = -10 - i * 20;
      //   // Houses on both sides
      //   if (Math.random() > 0.3) createHouse(-15 - Math.random() * 10, z);
      //   if (Math.random() > 0.3) createHouse(15 + Math.random() * 10, z);
        
      //   // Traffic lights occasionally
      //   if (Math.random() > 0.8) createTrafficLight(6, z);
      // }

      // Fetch Parking Lots
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/v1/parkinglots/public/all`);
        const result = await response.json();
        if (result.status === "success") {
          const lots: ParkingLot[] = result.data;
          
          // Store in ref for future creations
          lots.forEach(l => lotsRef.push(l));

          // Update existing parking lot models
          const parkingLotModels = movingObjectsRef.current.filter(obj => obj.type === 'parkingLot');

          parkingLotModels.forEach((modelObj, index) => {
             const group = modelObj.mesh;
             // Pick a lot (round robin or random)
             const lot = lots[index % lots.length];
             
             group.userData.lot = lot; // Store data for raycasting

             // Find the card mesh
             const card = group.getObjectByName("infoCard");
             if (card) {
                 const texture = createCardTexture(lot);
                 (card.material as any).map = texture;
                 (card.material as any).needsUpdate = true;
             }
          });
        }
      } catch (error) {
        console.error("Failed to fetch parking lots", error);
      }

      // Materials
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 1,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      });

      const detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.5,
      });

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0,
        transmission: 1,
      });

      // Store materials in ref for external access
      if (!isCancelled) {
        materialsRef.current = {
          body: bodyMaterial,
          details: detailsMaterial,
          glass: glassMaterial
        };
      }

      // Load car
      const shadow = new THREE.TextureLoader().load(
        "models/gltf/ferrari_ao.png"
      );

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load("models/gltf/ferrari.glb", (gltf) => {
        if (isCancelled) return;

        const car = gltf.scene.children[0];

        car.getObjectByName("body").material = bodyMaterial;
        car.getObjectByName("glass").material = glassMaterial;

        [
          "rim_fl",
          "rim_fr",
          "rim_rl",
          "rim_rr",
          "trim",
        ].forEach(
          (name) => (car.getObjectByName(name).material = detailsMaterial)
        );

        wheels.push(
          car.getObjectByName("wheel_fl"),
          car.getObjectByName("wheel_fr"),
          car.getObjectByName("wheel_rl"),
          car.getObjectByName("wheel_rr")
        );

        const shadowMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
          new THREE.MeshBasicMaterial({
            map: shadow,
            blending: THREE.MultiplyBlending,
            transparent: true,
            premultipliedAlpha: true,
          })
        );
        shadowMesh.rotation.x = -Math.PI / 2;
        car.add(shadowMesh);

        scene.add(car);

        // Save template for parked cars
        carModelTemplate = car.clone();
        // Remove shadow from template if we don't want it on parked cars (or keep it)
        // The shadow is added to 'car', so cloning 'car' clones the shadow too.
        // But the shadow uses MultiplyBlending which might look weird if stacked or on dark ground.
        // Let's keep it for realism.

        // Generate World Segments AFTER car is loaded
        for (let i = 0; i < totalSegments; i++) {
          const z = 20 - (i * segmentLength);
          
          // Every 4th segment is an intersection
          if (i > 0 && i % 4 === 0) {
            createCrossRoad(z);
          } else {
            createStraightSegment(z);
          }
        }
        
        // Mark scene as ready
        setIsSceneReady(true);
      });
      } catch (e) {
        console.error("Error initializing 3D scene:", e);
      }
    })();

    window.addEventListener("resize", onResize);

    function onResize() {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function animate() {
      controls?.update();

      // Move objects to simulate driving
      if (!isPausedRef.current) {
        // Rotate wheels
        // We increment rotation based on speed to simulate movement
        // Previous logic was time based (1 rotation per second approx)
        // Let's just increment the rotation angle
        wheels.forEach((w) => (w.rotation.x -= 0.1));

        const speed = 0.2;
        movingObjectsRef.current.forEach((item) => {
          if (item.mesh) {
            item.mesh.position.z += speed;
            
            // Reset position for infinite loop effect
            // Increased threshold to 100 so objects persist longer behind the car
            if (item.mesh.position.z > 100) {
               item.mesh.position.z -= worldLength; 
            }
          }
        });
      }

      renderer?.render(scene, camera);
      stats?.update();
    }

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      controls?.dispose();
      if (stats && stats.dom && containerRef.current) {
         containerRef.current.removeChild(stats.dom);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {isSceneReady && (
        <>
          {/* Controls (Right Center Vertical) */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-auto bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
            
            {/* Color Controls */}
            <div className="flex flex-col gap-2 border-b border-white/20 pb-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <input 
                  id="body-color" 
                  type="color" 
                  defaultValue="#ff0000" 
                  className="absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer z-10 opacity-0"
                  title="Body Color"
                  onInput={(e: any) => {
                    if (materialsRef.current.body) {
                      materialsRef.current.body.color.set(e.target.value);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-red-500 pointer-events-none" style={{ backgroundColor: materialsRef.current.body?.color?.getStyle() || '#ff0000' }}></div>
              </div>
              <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <input 
                  id="details-color" 
                  type="color" 
                  defaultValue="#ffffff" 
                  className="absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer z-10 opacity-0"
                  title="Details Color"
                  onInput={(e: any) => {
                    if (materialsRef.current.details) {
                      materialsRef.current.details.color.set(e.target.value);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-white pointer-events-none" style={{ backgroundColor: materialsRef.current.details?.color?.getStyle() || '#ffffff' }}></div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom(0.1);
                }}
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              >
                <ZoomIn className="h-4 w-4 text-gray-800" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom(-0.1);
                }}
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              >
                <ZoomOut className="h-4 w-4 text-gray-800" />
              </Button>
            </div>

            {/* Play/Pause */}
            <div className="border-t border-white/20 pt-2">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className={`h-8 w-8 rounded-full shadow-lg transition-all duration-300 ${
                  isPaused 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isPaused ? (
                  <Play className="h-4 w-4 text-white fill-current" />
                ) : (
                  <Pause className="h-4 w-4 text-white fill-current" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Parking Detail Modal */}
      {selectedLot && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 bg-gray-200">
              <img 
                src={selectedLot.avtImage || "/placeholder-parking.jpg"} 
                alt={selectedLot.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedLot(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLot.name}</h2>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{selectedLot.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                <div className="flex items-center text-blue-600">
                  <DollarSign size={20} className="mr-1" />
                  <span className="font-bold text-lg">
                    {selectedLot.pricePerHour.toLocaleString()} VND/h
                  </span>
                </div>
                {selectedLot.owner && (
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-1" />
                    <span className="text-sm">Owner: {selectedLot.owner}</span>
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                onClick={() => router.push(`/detailParking/${selectedLot._id}`)}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
