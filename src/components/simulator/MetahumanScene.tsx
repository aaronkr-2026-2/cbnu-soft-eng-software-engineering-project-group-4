import { Bounds, Environment, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh, Object3D } from 'three'

type MouthCue = { start: number; end: number; value: string }
type CueSheet = { mouthCues: MouthCue[] }
type AvatarProps = { speaking: boolean; audio: HTMLAudioElement | null }

const cueVisemes: Record<string, Array<[string, number]>> = {
  A: [],
  B: [['PP', 0.28]],
  C: [['E', 0.38], ['jawOpen', 0.08]],
  D: [['aa', 0.46], ['jawOpen', 0.16]],
  E: [['oh', 0.38], ['mouthFunnel', 0.1], ['jawOpen', 0.1]],
  F: [['FF', 0.34], ['jawOpen', 0.03]],
  G: [['ou', 0.4], ['mouthPucker', 0.1], ['jawOpen', 0.06]],
  H: [['TH', 0.3], ['jawOpen', 0.07]],
  X: [],
}

function Avatar({ speaking, audio }: AvatarProps) {
  const group = useRef<Group>(null)
  const { scene } = useGLTF('/assets/models/metahuman.glb')
  const [mouthCues, setMouthCues] = useState<MouthCue[]>([])
  useEffect(() => {
    fetch('/assets/audio/sample-speech-cues.json')
      .then((response) => response.json())
      .then((data: CueSheet) => setMouthCues(data.mouthCues))
      .catch(() => setMouthCues([]))
  }, [])
  const rig = useMemo(() => {
    const findBone = (name: string) => scene.getObjectByName(name) as Object3D | undefined
    let faceMesh: Mesh | undefined
    scene.traverse((object) => {
      if ('morphTargetDictionary' in object && object.morphTargetDictionary) faceMesh = object as Mesh
    })
    return {
      faceMesh,
      head: findBone('head'),
      neck: findBone('neck'),
      leftEye: findBone('eyeLeft'),
      rightEye: findBone('eyeRight'),
    }
  }, [scene])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (group.current && !rig.head) {
      group.current.rotation.y = Math.sin(time * 0.45) * 0.08
    }
    if (rig.head) rig.head.rotation.y = speaking ? Math.sin(time * 1.4) * 0.045 : 0
    if (rig.neck) rig.neck.rotation.x = speaking ? Math.sin(time * 2.2) * 0.015 : 0
    const eyeMovement = speaking ? Math.sin(time * 1.8) * 0.035 : 0
    if (rig.leftEye) rig.leftEye.rotation.y = eyeMovement
    if (rig.rightEye) rig.rightEye.rotation.y = eyeMovement

    const dictionary = rig.faceMesh?.morphTargetDictionary
    const influences = rig.faceMesh?.morphTargetInfluences
    if (!dictionary || !influences) return

    const targets = new Array(influences.length).fill(0)
    const setTarget = (name: string, value: number) => {
      const index = dictionary[name]
      if (index !== undefined) targets[index] = value
    }
    const currentCue = speaking && audio
      ? mouthCues.find((cue) => audio.currentTime >= cue.start && audio.currentTime < cue.end)
      : undefined
    if (currentCue) {
      cueVisemes[currentCue.value]?.forEach(([name, weight]) => setTarget(name, weight))
    }
    const blink = Math.sin(time * 0.7) > 0.985 ? 0.85 : 0
    setTarget('eyeBlinkLeft', blink)
    setTarget('eyeBlinkRight', blink)
    influences.forEach((influence, index) => { influences[index] = influence + (targets[index] - influence) * 0.14 })
  })

  return <primitive ref={group} object={scene} />
}

export function MetahumanScene({ speaking, audio }: AvatarProps) {
  return (
    <Canvas dpr={[1, 2]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[0.6, 1.8, 1.2]} intensity={2.2} />
      <directionalLight position={[-0.8, 1.2, -0.6]} intensity={0.6} />
      <Bounds fit clip observe margin={1.18}>
        <Avatar speaking={speaking} audio={audio} />
      </Bounds>
      <Environment preset="city" />
    </Canvas>
  )
}

useGLTF.preload('/assets/models/metahuman.glb')
