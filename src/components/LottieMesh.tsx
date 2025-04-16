import { useThree } from '@react-three/fiber';
import { LottieLoader } from 'three/examples/jsm/loaders/LottieLoader';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAspect } from '@react-three/drei';
import BorderEffect from './BorderEffect';
import { useControls } from 'leva';

type LottieMeshProps = {
  lottieObject: any;
};

export function LottieMesh({ lottieObject }: LottieMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
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
  console.log(lottieObject,lottieObject,"check nage")
  const aspect = useAspect(lottieObject.image.width, lottieObject.image.height,1);


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
      <planeGeometry args={[aspect[0],aspect[1]]} />
      <meshBasicMaterial transparent map={lottieObject} />
          </mesh >
                  </BorderEffect>

      :null}
    </>
  );
}
