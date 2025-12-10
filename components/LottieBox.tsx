"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LottieBoxProps {
  cityId?: string;
}

export default function LottieBox({ cityId }: LottieBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${apiUrl}/api/v1/parkinglots/public/all`);
        if (response.data.status === "success") {
            setParkingLots(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching parking lots for 3D cube:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParkingLots();
  }, []);

  useEffect(() => {
    if (loading) return;

    let renderer: any, scene: any, camera: any, controls: any, mesh: any;
    let animationId: number;
    let resizeObserver: ResizeObserver;
    let raycaster: any;
    let mouse: any;

    // Filter parking lots based on cityId
    let filteredLots: any[] = [];
    if (cityId && cityId !== "nearby") {
        const cityKeywords: {[key: string]: string} = {
            "hcm": "Hồ Chí Minh",
            "hn": "Hà Nội",
            "dn": "Đà Nẵng",
            "bh": "Biên Hòa",
            "nt": "Nha Trang",
            "hue": "Huế",
            "ct": "Cần Thơ",
            "vt": "Vũng Tàu",
            "hp": "Hải Phòng"
        };
        const keyword = cityKeywords[cityId];
        if (keyword) {
            filteredLots = parkingLots.filter(p => 
                p.address && p.address.toLowerCase().includes(keyword.toLowerCase())
            );
        } else {
            // If cityId is provided but not in our map, show empty to indicate no data found for this specific filter
            filteredLots = [];
        }
    } else {
      // Default or random if no city selected
      filteredLots = parkingLots.slice(0, 5);
    }

    // Map API data to display format
    const displayParkingLots = filteredLots.map(p => ({
        id: p._id,
        name: p.name,
        address: p.address || "Chưa cập nhật địa chỉ",
        price: p.pricePerHour ? `${p.pricePerHour.toLocaleString()}đ/h` : "Liên hệ",
        img: p.avtImage || "/bg.jpg", // Fallback image
    }));

    // Fill up to 5 slots if not enough
    const facesContent = [...displayParkingLots];
    
    // If no parking lots found for city
    const noParking = facesContent.length === 0;

    const init = async () => {
      if (!containerRef.current) return;

      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js");
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10);
      camera.position.z = 2.2;

      scene = new THREE.Scene();
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Helper to create texture for parking lot
      const createParkingTexture = (parking: any, index: number) => {
        return new Promise<any>((resolve) => {
          if (!parking && !noParking) {
             // Empty face texture (white)
             const canvas = document.createElement("canvas");
             canvas.width = 512;
             canvas.height = 512;
             const ctx = canvas.getContext("2d");
             if(ctx) {
                 ctx.fillStyle = "#ffffff";
                 ctx.fillRect(0,0,512,512);
             }
             const texture = new THREE.CanvasTexture(canvas);
             texture.colorSpace = THREE.SRGBColorSpace;
             resolve(texture);
             return;
          }

          if (noParking) {
             // "No Parking" texture
             const canvas = document.createElement("canvas");
             canvas.width = 512;
             canvas.height = 512;
             const ctx = canvas.getContext("2d");
             if(ctx) {
                 ctx.fillStyle = "#f3f4f6";
                 ctx.fillRect(0,0,512,512);
                 ctx.fillStyle = "#9ca3af";
                 ctx.font = "bold 40px Arial";
                 ctx.textAlign = "center";
                 ctx.fillText("Không có bãi đỗ", 256, 256);
                 ctx.font = "30px Arial";
                 ctx.fillText("tại khu vực này", 256, 300);
             }
             const texture = new THREE.CanvasTexture(canvas);
             texture.colorSpace = THREE.SRGBColorSpace;
             resolve(texture);
             return;
          }

          const imageLoader = new THREE.ImageLoader();
          // Use a proxy or ensure CORS is handled if images are external
          // For now assuming images are accessible
          imageLoader.setCrossOrigin('anonymous'); 
          imageLoader.load(
            parking.img,
            (image) => {
              const canvas = document.createElement("canvas");
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                // 1. Background (Black fallback)
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, 512, 512);

                // 2. Image (Cover mode - Full face)
                const aspect = image.width / image.height;
                let drawWidth = 512;
                let drawHeight = 512;
                let offsetX = 0;
                let offsetY = 0;

                // Calculate cover dimensions
                if (aspect > 1) { // Landscape image
                    drawHeight = 512;
                    drawWidth = 512 * aspect;
                    offsetX = (512 - drawWidth) / 2; // Center horizontally
                } else { // Portrait image
                    drawWidth = 512;
                    drawHeight = 512 / aspect;
                    offsetY = (512 - drawHeight) / 2; // Center vertically
                }
                ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
                
                // 3. Gradient overlay (Dark fade from bottom up)
                // Starts transparent at y=150, becomes fully dark at bottom
                const gradient = ctx.createLinearGradient(0, 150, 0, 512);
                gradient.addColorStop(0, "rgba(0,0,0,0)");
                gradient.addColorStop(0.5, "rgba(0,0,0,0.7)");
                gradient.addColorStop(1, "rgba(0,0,0,0.95)");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 150, 512, 362);

                // 4. Text Info
                ctx.textAlign = "center";
                
                // Name
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 38px Arial";
                ctx.shadowColor = "rgba(0,0,0,0.8)";
                ctx.shadowBlur = 4;
                ctx.fillText(parking.name, 256, 300);
                ctx.shadowBlur = 0; // Reset shadow

                // Address
                ctx.fillStyle = "#e5e7eb"; // gray-200
                ctx.font = "24px Arial";
                let address = parking.address;
                if (address.length > 40) address = address.substring(0, 37) + "...";
                ctx.fillText(address, 256, 340);

                // Price
                ctx.fillStyle = "#fbbf24"; // amber-400
                ctx.font = "bold 32px Arial";
                ctx.fillText(parking.price, 256, 390);

                // 5. Button (Shadcn style - White background, black text)
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                // x, y, w, h, radii
                ctx.roundRect(156, 430, 200, 50, 6); // 6px radius for modern look
                ctx.fill();

                ctx.fillStyle = "#09090b"; // zinc-950
                ctx.font = "bold 22px Arial";
                ctx.fillText("CHI TIẾT", 256, 463);
                
                // Subtle Border
                ctx.strokeStyle = "rgba(255,255,255,0.2)";
                ctx.lineWidth = 2;
                ctx.strokeRect(0, 0, 512, 512);
              }
              const texture = new THREE.CanvasTexture(canvas);
              texture.colorSpace = THREE.SRGBColorSpace;
              resolve(texture);
            },
            undefined,
            () => {
              // Error loading image fallback
              const canvas = document.createElement("canvas");
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext("2d");
              if(ctx) {
                  ctx.fillStyle = "#18181b"; // zinc-900
                  ctx.fillRect(0,0,512,512);
                  ctx.fillStyle = "#fff";
                  ctx.font = "bold 30px Arial";
                  ctx.textAlign = "center";
                  ctx.fillText(parking.name, 256, 256);
              }
              const texture = new THREE.CanvasTexture(canvas);
              texture.colorSpace = THREE.SRGBColorSpace;
              resolve(texture);
            }
          );
        });
      };

      // Helper for Logo Texture
      const createLogoTexture = () => {
        return new Promise<any>((resolve) => {
          const imageLoader = new THREE.ImageLoader();
          imageLoader.load("/logo.png", (image) => {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const gradient = ctx.createLinearGradient(0, 0, 0, 512);
              gradient.addColorStop(0, "#e0f7fa");
              gradient.addColorStop(1, "#ffffff");
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 512, 512);
              
              // Center logo
              const scale = Math.min(400 / image.width, 400 / image.height);
              const w = image.width * scale;
              const h = image.height * scale;
              ctx.drawImage(image, (512 - w) / 2, (512 - h) / 2, w, h);

              // Border
              ctx.strokeStyle = "#e5e7eb";
              ctx.lineWidth = 20;
              ctx.strokeRect(0, 0, 512, 512);
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            resolve(texture);
          });
        });
      };

      // Load all textures
      // Faces: Right, Left, Top, Bottom, Front, Back
      // We use Top (index 2) for Logo.
      // Others for parking lots.
      
      const parkingIndices = [0, 1, 3, 4, 5];
      const texturePromises = new Array(6).fill(null).map((_, i) => {
          if (i === 2) return createLogoTexture();
          const pIndex = parkingIndices.indexOf(i);
          // Cycle through parking lots if we have more than 5, or just repeat/empty
          const parking = facesContent[pIndex % facesContent.length];
          return createParkingTexture(parking, i);
      });

      const textures = await Promise.all(texturePromises);

      const materials = textures.map(
        (tex) =>
          new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.2,
            metalness: 0.1,
          })
      );

      // Use RoundedBoxGeometry for solid rounded corners (no holes)
      const geometry = new RoundedBoxGeometry(1.2, 1.2, 1.2, 4, 0.1);
      mesh = new THREE.Mesh(geometry, materials);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);
      }

      const environment = new RoomEnvironment();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(environment).texture;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.enableZoom = false;
      controls.enablePan = false;

      // Click Handler
      const onCanvasClick = (event: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mesh);

        if (intersects.length > 0) {
          const intersection = intersects[0];
          const faceIndex = intersection.face?.materialIndex;
          const uv = intersection.uv;

          if (faceIndex !== 2 && uv && !noParking) { // Not logo and has parking
             const pIndex = parkingIndices.indexOf(faceIndex || 0);
             const parking = facesContent[pIndex % facesContent.length];

             if (parking) {
                // Check button area
                const canvasX = uv.x * 512;
                const canvasY = (1 - uv.y) * 512;

                if (canvasX >= 156 && canvasX <= 356 && canvasY >= 430 && canvasY <= 480) {
                    router.push(`/detailParking/${parking.id}`);
                }
             }
          }
        }
      };

      renderer.domElement.addEventListener("pointerdown", onCanvasClick);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (controls) controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize handling
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      });
      resizeObserver.observe(containerRef.current);
    };

    init();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) {
        renderer.domElement.removeEventListener("pointerdown", () => {});
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [router, cityId, parkingLots, loading]); // Re-run when cityId or data changes

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-pointer"
      title="Click để xem chi tiết"
    ></div>
  );
}
