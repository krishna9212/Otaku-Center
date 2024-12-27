import React, { memo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const RotatingMesh = ({ isInteracting }) => {
  const meshRef = useRef(null); // Reference for the object

  // Automatically rotate the object when the user is not interacting
  useFrame(() => {
    if (!isInteracting && meshRef.current) {
      // Increase the increment for faster rotation
      meshRef.current.rotation.x += 0.003; // Increased value for faster rotation
      meshRef.current.rotation.y += 0.005; // Increased value for faster rotation
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.7, 0.7, 0.7]} rotation={[1, 1, 1]} castShadow>
      <torusKnotGeometry args={[2, 0.5, 100, 16]} />
      <meshStandardMaterial
        color="#FCDE70"
        metalness={0.2}
        roughness={0.7}
      />{" "}
      {/* New color */}
    </mesh>
  );
};

const AboutUs = () => {
  const [isInteracting, setIsInteracting] = useState(false); // Flag to detect user interaction

  // Event handler for user interaction
  const handleInteraction = () => {
    setIsInteracting(true);
  };

  // Event handler when user stops interacting
  const handleInteractionEnd = () => {
    setIsInteracting(false);
  };

  return (
    <div
      id="about"
      className="min-h-screen md:pb-5 pb-10 flex items-center justify-center bg-gradient-to-r bg-[#fcec83] text-black "
    >
      <div className="max-w-7xl w-full  grid md:grid-cols-2 gap-10">
        {/* Left Section - 3D Object */}
        <div className="flex h-[350px] md:h-[450px] w-full   items-center justify-center">
          <Canvas>
            {/* Lighting for better visuals */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <spotLight position={[-5, 10, 5]} angle={0.15} intensity={1.2} />

            {/* Rotating Mesh with automatic and user-controlled rotation */}
            <RotatingMesh isInteracting={isInteracting} />

            {/* OrbitControls for user interaction with slower rotation */}
            <OrbitControls
              enableZoom={false} // Disable zoom to stop object scaling
              enableRotate={true} // Allow user to rotate the object
              rotateSpeed={0.3} // Slow down the rotation speed
              onPointerDown={handleInteraction} // User starts interacting
              onPointerUp={handleInteractionEnd} // User stops interacting
              onPointerOut={handleInteractionEnd} // User stops interacting when the mouse leaves the object
            />
          </Canvas>
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-col justify-center space-y-6 ">
          <h1 className="text-4xl text-center whitespace-nowrap md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">Otaku Center</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed px-5">
            Otaku Center is India's premier destination for anime and pop
            culture enthusiasts. We bring your favorite characters to life with
            a curated selection of premium action figures and collectibles. From
            classic anime to the latest hits, we have something for every otaku
            out there.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed px-5">
            Based in India, we pride ourselves on delivering authentic products
            and a seamless shopping experience. Whether you're a dedicated
            collector or just starting your journey, Otaku Center is here to
            help you build your dream collection.
          </p>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold  py-3 md:py-3 md:px-6 rounded-lg shadow-lg transform md:hover:scale-x-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            aria-label="Explore our collection button"
          >
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to optimize rendering performance
export default memo(AboutUs);
