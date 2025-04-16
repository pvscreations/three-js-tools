import { useThree } from '@react-three/fiber';
import { LottieLoader } from 'three/examples/jsm/loaders/LottieLoader';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAspect } from '@react-three/drei';
import BorderEffect from './BorderEffect';
import { useControls } from 'leva';

type LottieMeshProps = {
  file: File;
};

export function LottieMesh({ file }: LottieMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [lottieObject, setLottieObject] = useState<THREE.Object3D | null>(null);
  const { size } = useThree();
  const { scale, speed, showBorder } = useControls({
    showBorder:{value:true},
    scale: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    speed: {
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
  });
  const aspect = useAspect(size.width, size.height, 1);

  useEffect(() => {
    const loader = new LottieLoader();
    const url = URL.createObjectURL(file);

    loader.load(
      url,
      (obj) => {
        setLottieObject(obj);
        (obj as any)?.animation?.setSpeed?.(speed); // Optional chaining in case `animation` exists
      },
      undefined,
      (err) => {
        console.error('Lottie load error:', err);
      }
    );

    return () => {
      URL.revokeObjectURL(url); // Cleanup blob
    };
  }, [file]);

  useEffect(() => {
    if (lottieObject && (lottieObject as any)?.animation?.setSpeed) {
      (lottieObject as any).animation.setSpeed(speed);
    }
  }, [speed, lottieObject]);
  return (
    <>
    
      {lottieObject ?
        <BorderEffect isActive={showBorder} key={scale+speed} meshRef={meshRef} >

    <mesh ref={meshRef} scale={[scale * aspect[0], scale * aspect[1], 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent map={lottieObject} />
          </mesh >
                  </BorderEffect>

      :null}
    </>
  );
}
