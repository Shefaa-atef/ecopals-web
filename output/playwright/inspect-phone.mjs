import fs from 'fs'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const buffer = fs.readFileSync('src/assets/low_poly_android_phone.glb')
const loader = new GLTFLoader()
loader.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), '', (gltf) => {
  gltf.scene.updateMatrixWorld(true)
  gltf.scene.traverse((node) => {
    if (!node.isMesh) return
    const box = new THREE.Box3().setFromObject(node)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    console.log(node.name, 'material=' + node.material?.name, 'size=' + size.toArray().map(n=>n.toFixed(4)).join(','), 'center=' + center.toArray().map(n=>n.toFixed(4)).join(','))
  })
}, (error) => {
  console.error(error)
  process.exit(1)
})
