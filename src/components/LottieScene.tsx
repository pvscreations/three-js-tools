import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAspect, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { LottieMesh } from './LottieMesh';
import { LottieLoader } from 'three/examples/jsm/loaders/LottieLoader.js';

export function LottieScene() {
  const [lottieFile, setLottieFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lottieObject, setLottieObject] = useState<THREE.Object3D | null>(null);



  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/json') {
      setLottieFile(file);
    
    const loader = new LottieLoader();
    const url = URL.createObjectURL(file);

    loader.load(
      url,
      (obj) => {
        setLottieObject(obj);
        // (obj as any)?.animation?.setSpeed?.(speed); // Optional chaining in case `animation` exists
      },
      undefined,
      (err) => {
        console.error('Lottie load error:', err);
      }
    );

    return () => {
      URL.revokeObjectURL(url); // Cleanup blob
    };
  
    }
  };

  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="w-full h-screen"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas ref={canvasRef}>
        <Perf position="top-left" />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls/>
        <color attach="background" args={['#f0f0f0']} />
        {lottieObject && (
          <LottieMesh
            lottieObject={lottieObject}
       
          />
        )}
      </Canvas>
      {!lottieFile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-2xl text-gray-500">
            Drag and drop a Lottie JSON file here
          </p>
        </div>
      )}
    </div>
  );
}
