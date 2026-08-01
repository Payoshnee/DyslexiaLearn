import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";

import DoodleModel from "./DoodleModel.jsx";

export default function DoodleCanvas({ doodle, state }) {
  const camera = doodle.camera || { position: [0, 1.25, 5], fov: 35 };
  const shadowPosition = doodle.shadowPosition || [0, -1.24, 0];

  return (
    <Canvas className="doodle-canvas" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={camera.position} fov={camera.fov} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 4]} intensity={2.4} />
      <Suspense fallback={<Html center><span className="loader">Loading doodle...</span></Html>}>
        <DoodleModel doodle={doodle} state={state} />
        <ContactShadows position={shadowPosition} opacity={0.28} scale={5} blur={2} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.2} maxPolarAngle={1.8} />
    </Canvas>
  );
}
