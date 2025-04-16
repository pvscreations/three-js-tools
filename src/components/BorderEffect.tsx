import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box3, Color, FrontSide, Group, Side, Vector3 } from "three";
import { RoundedPlaneGeometry } from "./roundedGeometry";

type BorderEffectProps = {
  isActive?: boolean;
  color?: string | Color;
  width?: number;
  children?: React.ReactNode;
  side?: Side;
    borderRadius?: number;
    meshRef: React.RefObject<THREE.Mesh>
};

const BorderEffect: React.FC<BorderEffectProps> = ({
  isActive = true,
  color = "black",
  width = 0.1,
  children,
  side = FrontSide,
    borderRadius = 0.27,
    meshRef
}) => {
  const groupRef = useRef<Group>(null);
  const [size, setSize] = useState<[number, number]>([1, 1]);

  // Calculate the bounding box size
  useLayoutEffect(() => {
    if (groupRef.current) {
      const box = new Box3().setFromObject(groupRef.current);
      const sizeVector = new Vector3();
      box.getSize(sizeVector);
      setSize([sizeVector.x, sizeVector.y]);
    }
  },  [meshRef?.current?.scale.x, meshRef?.current?.scale.y,children]);

  // Memoize the rounded border geometry
  const roundedGeometry = useMemo(() => {
    return new RoundedPlaneGeometry(
      size[0] + 2 * width, // Border width added to both sides
      size[1] + 2 * width, // Border width added to both sides
      borderRadius,
    );
  }, [size, width, borderRadius]);
    
useEffect(() => {
  return () => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
        if ((child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else {
            material.dispose();
          }
        }
        // Optional: dispose of textures if used
        if ((child as THREE.Mesh).material?.map) {
          (child as THREE.Mesh).material.map.dispose();
        }
      });
    }
  };
}, []);

  return (
    <group ref={groupRef}>
      {/* Border Effect */}
      {isActive && (
        <mesh geometry={roundedGeometry}>
          <meshBasicMaterial side={side} color={color} />
        </mesh>
      )}

      {/* Children inside the border */}
      {children}
    </group>
  );
};

export default BorderEffect;
