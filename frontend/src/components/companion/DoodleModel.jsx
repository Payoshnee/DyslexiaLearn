import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import { animationMap, COMPANION_STATES } from "../../companion/companionStates.js";

function resolveClip(names, state) {
  const aliases = animationMap[state] || animationMap[COMPANION_STATES.IDLE];
  return (
    aliases.find((alias) => names.includes(alias)) ||
    aliases
      .map((alias) => names.find((name) => name.toLowerCase().endsWith(`|${alias.toLowerCase()}`)))
      .find(Boolean) ||
    aliases
      .map((alias) => names.find((name) => name.toLowerCase().includes(alias.toLowerCase())))
      .find(Boolean) ||
    names[0]
  );
}

export default function DoodleModel({ doodle, state }) {
  const groupRef = useRef(null);
  const activeActionRef = useRef(null);
  const { scene, animations } = useGLTF(doodle.modelPath);
  const copiedScene = useMemo(() => clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, groupRef);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const time = clock.getElapsedTime();
    const targetY = state === COMPANION_STATES.HEARING ? -0.36 : 0.16;
    const targetX = state === COMPANION_STATES.PROCESSING ? Math.sin(time * 2.6) * 0.04 : 0;
    const targetZ = state === COMPANION_STATES.LISTENING ? Math.sin(time * 3.2) * 0.025 : 0;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.08;
  });

  useEffect(() => {
    const clip = resolveClip(names, state);
    const action = actions[clip];

    if (!action) {
      return undefined;
    }

    activeActionRef.current?.fadeOut(0.2);
    action.reset().fadeIn(0.2).play();
    activeActionRef.current = action;

    return () => action.fadeOut(0.2);
  }, [actions, names, state]);

  const scale = doodle.scale || 0.42;
  const position = doodle.position || [0, -1.2, 0];

  return (
    <group ref={groupRef} position={position} rotation={[0, 0.16, 0]} scale={scale}>
      <primitive object={copiedScene} />
    </group>
  );
}
