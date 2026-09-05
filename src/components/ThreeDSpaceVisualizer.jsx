import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"
import { Compass, Sparkles, Box, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import nodLogoImg from "../assets/nod_logo.jpg"

// Luxury Architectural Palette matching NOD
const PALETTE = {
  bg: 0x12100e,           // Warm Dark Obsidian
  floor: 0x221b16,        // Warm Dark Walnut/Teak hardwood
  wall: 0x2c2520,         // Warm Architectural Espresso / Charcoal Plaster
  wallTrim: 0x1a1512,     // Baseboards & structural trim
  walnut: 0x6e4627,       // Deep Rich Walnut wood
  fabric: 0x38302a,       // Warm Charcoal Upholstery
  cushionCream: 0xf5efe6, // Pure Cream Linen
  cushionGold: 0xd4af37,  // NOD Signature Lustrous Gold
  charcoal: 0x1c1714,     // Cast Iron / Charcoal
  parchment: 0xf7f3ea,    // Warm Architectural Parchment
  gold: 0xd4af37,         // Brushed Brass / Gold
  green: 0x2e633d,        // Lush Architectural Greenery
  glow: 0xffdf99,         // Warm 2700K Architectural Glow
}

function createMesh(w, h, d, color, x, y, z, options = {}) {
  const geometry = new THREE.BoxGeometry(w, h, d)
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.6,
    metalness: options.metalness ?? 0.15,
    ...(options.material || {}),
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  if (options.rotY) mesh.rotation.y = options.rotY
  if (options.rotX) mesh.rotation.x = options.rotX
  mesh.castShadow = options.castShadow ?? true
  mesh.receiveShadow = options.receiveShadow ?? true
  return mesh
}

export default function ThreeDSpaceVisualizer() {
  const containerRef = useRef(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "grab"
    container.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(PALETTE.bg)
    scene.fog = new THREE.Fog(PALETTE.bg, 18, 38)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    )

    const roomGroup = new THREE.Group()
    scene.add(roomGroup)

    // 1. FLOOR
    const floorGeo = new THREE.PlaneGeometry(40, 40)
    const floorMat = new THREE.MeshStandardMaterial({
      color: PALETTE.floor,
      roughness: 0.55,
      metalness: 0.25,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    roomGroup.add(floor)

    // 2. GRAND ARCHITECTURAL WALLS
    roomGroup.add(createMesh(24, 7.5, 0.3, PALETTE.wall, 0, 3.5, -5.2, { castShadow: false, roughness: 0.85 }))
    roomGroup.add(createMesh(0.3, 7.5, 22, PALETTE.wall, -6.5, 3.5, 2.0, { castShadow: false, roughness: 0.85 }))
    roomGroup.add(createMesh(24, 0.18, 0.08, PALETTE.wallTrim, 0, 0.09, -5.05, { castShadow: false }))
    roomGroup.add(createMesh(0.08, 0.18, 22, PALETTE.wallTrim, -6.35, 0.09, 2.0, { castShadow: false }))

    // Architectural Gold Moulding
    roomGroup.add(createMesh(24, 0.06, 0.06, PALETTE.gold, 0, 5.8, -5.04, {
      metalness: 0.8,
      roughness: 0.2,
      castShadow: false,
    }))

    // 3. VERTICAL WALNUT ACOUSTIC SLATS
    for (let i = 0; i < 14; i++) {
      roomGroup.add(
        createMesh(0.16, 4.8, 0.1, PALETTE.walnut, -5.5 + i * 0.32, 2.4, -5.02, {
          castShadow: false,
          roughness: 0.65,
          metalness: 0.1,
        })
      )
      if (i % 2 === 0) {
        roomGroup.add(
          createMesh(0.02, 4.8, 0.06, PALETTE.gold, -5.5 + i * 0.32 + 0.16, 2.4, -5.01, {
            metalness: 0.9,
            roughness: 0.2,
            castShadow: false,
          })
        )
      }
    }

    // 3.5. 100% CRYSTAL CLEAR, VIBRANT NOD EMBLEM (No blur, no shadow distortion, neat size)
    const logoGroup = new THREE.Group()
    logoGroup.position.set(-0.5, 3.55, -4.96)

    // Circular Plaque Shadow Base
    const plaqueBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.05, 64),
      new THREE.MeshStandardMaterial({
        color: 0x181411,
        roughness: 0.4,
        metalness: 0.4,
      })
    )
    plaqueBack.rotation.x = Math.PI / 2
    logoGroup.add(plaqueBack)

    // Brushed Gold Outer Torus Bezel Ring
    const goldBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.035, 24, 64),
      new THREE.MeshStandardMaterial({
        color: PALETTE.gold,
        metalness: 0.95,
        roughness: 0.15,
      })
    )
    logoGroup.add(goldBezel)

    // Pure 100% Unshaded High-Quality Crystal-Clear Logo Disk
    const logoGeo = new THREE.CircleGeometry(0.75, 64)
    const logoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false, // Ensures 100% original full-bright colors (cyan, navy, white)
    })
    const logoMesh = new THREE.Mesh(logoGeo, logoMat)
    logoMesh.position.z = 0.032
    logoGroup.add(logoMesh)

    // Load High-Res Logo Texture with Maximum Crispness
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(nodLogoImg, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      if (renderer.capabilities.getMaxAnisotropy) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      }
      logoMesh.material.map = texture
      logoMesh.material.needsUpdate = true
    })

    // Glowing warm halo around the gold bezel
    const logoHalo = new THREE.PointLight(0xffdf99, 4.0, 3.5, 2)
    logoHalo.position.set(0, 0, 0.2)
    logoGroup.add(logoHalo)

    // "NOD PROJECTS" Sign Plaque
    const signPlinth = createMesh(1.5, 0.22, 0.04, 0x181411, 0, -0.98, 0.02, {
      roughness: 0.4,
      metalness: 0.4,
    })
    logoGroup.add(signPlinth)

    const signGoldTrim = createMesh(1.54, 0.025, 0.05, PALETTE.gold, 0, -0.87, 0.03, {
      metalness: 0.95,
      roughness: 0.15,
    })
    logoGroup.add(signGoldTrim)

    const signGoldBottomTrim = createMesh(1.54, 0.025, 0.05, PALETTE.gold, 0, -1.09, 0.03, {
      metalness: 0.95,
      roughness: 0.15,
    })
    logoGroup.add(signGoldBottomTrim)

    roomGroup.add(logoGroup)

    // 4. ARCHITECTURAL ILLUMINATED WINDOW
    const windowFrameColor = 0x221c17
    roomGroup.add(createMesh(4.2, 0.18, 0.18, windowFrameColor, 2.6, 4.8, -5.02, { castShadow: false }))
    roomGroup.add(createMesh(4.2, 0.18, 0.18, windowFrameColor, 2.6, 1.2, -5.02, { castShadow: false }))
    roomGroup.add(createMesh(0.18, 3.8, 0.18, windowFrameColor, 0.5, 3.0, -5.02, { castShadow: false }))
    roomGroup.add(createMesh(0.18, 3.8, 0.18, windowFrameColor, 4.7, 3.0, -5.02, { castShadow: false }))
    roomGroup.add(createMesh(0.1, 3.6, 0.1, windowFrameColor, 2.6, 3.0, -5.02, { castShadow: false }))

    // Luminous Window Pane
    const glowPane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 3.4),
      new THREE.MeshStandardMaterial({
        color: PALETTE.glow,
        emissive: PALETTE.glow,
        emissiveIntensity: 1.6,
      })
    )
    glowPane.position.set(2.6, 3.0, -5.1)
    roomGroup.add(glowPane)

    // 5. WOVEN DESIGNER RUG
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(2.7, 54),
      new THREE.MeshStandardMaterial({
        color: 0x2a231d,
        roughness: 0.95,
      })
    )
    rug.rotation.x = -Math.PI / 2
    rug.position.set(-0.2, 0.015, -1.8)
    rug.receiveShadow = true
    roomGroup.add(rug)

    // Inner Cream Inlay
    const rugInner = new THREE.Mesh(
      new THREE.CircleGeometry(2.0, 48),
      new THREE.MeshStandardMaterial({
        color: 0x362e27,
        roughness: 0.9,
      })
    )
    rugInner.rotation.x = -Math.PI / 2
    rugInner.position.set(-0.2, 0.018, -1.8)
    rugInner.receiveShadow = true
    roomGroup.add(rugInner)

    // Gold Outer Rim
    const rugRing = new THREE.Mesh(
      new THREE.RingGeometry(2.68, 2.74, 54),
      new THREE.MeshStandardMaterial({
        color: PALETTE.gold,
        roughness: 0.25,
        metalness: 0.85,
      })
    )
    rugRing.rotation.x = -Math.PI / 2
    rugRing.position.set(-0.2, 0.02, -1.8)
    roomGroup.add(rugRing)

    // 6. HARMONIOUS LUXURY MODULAR SOFA
    const sofaX = -0.5
    const sofaZ = -2.8
    roomGroup.add(createMesh(3.5, 0.2, 1.25, PALETTE.walnut, sofaX, 0.1, sofaZ, { roughness: 0.5 }))
    roomGroup.add(createMesh(3.3, 0.42, 1.15, PALETTE.fabric, sofaX, 0.4, sofaZ, { roughness: 0.7 }))
    roomGroup.add(createMesh(3.3, 0.9, 0.32, PALETTE.fabric, sofaX, 0.95, sofaZ - 0.42, { roughness: 0.7 }))
    roomGroup.add(createMesh(0.3, 0.65, 1.15, PALETTE.fabric, sofaX - 1.7, 0.72, sofaZ, { roughness: 0.7 }))
    roomGroup.add(createMesh(0.3, 0.65, 1.15, PALETTE.fabric, sofaX + 1.7, 0.72, sofaZ, { roughness: 0.7 }))
    
    // Cushions
    roomGroup.add(createMesh(1.0, 0.18, 0.9, PALETTE.cushionCream, sofaX - 1.05, 0.68, sofaZ + 0.06, { roughness: 0.8 }))
    roomGroup.add(createMesh(1.0, 0.18, 0.9, PALETTE.cushionCream, sofaX, 0.68, sofaZ + 0.06, { roughness: 0.8 }))
    roomGroup.add(createMesh(1.0, 0.18, 0.9, PALETTE.cushionCream, sofaX + 1.05, 0.68, sofaZ + 0.06, { roughness: 0.8 }))

    // Pillows
    roomGroup.add(createMesh(0.45, 0.45, 0.16, PALETTE.cushionGold, sofaX - 1.15, 1.05, sofaZ - 0.24, {
      roughness: 0.4,
      metalness: 0.35,
      rotY: 0.22,
    }))
    roomGroup.add(createMesh(0.42, 0.42, 0.15, PALETTE.charcoal, sofaX - 0.6, 1.03, sofaZ - 0.24, {
      roughness: 0.6,
      rotY: -0.15,
    }))
    roomGroup.add(createMesh(0.45, 0.45, 0.16, PALETTE.cushionGold, sofaX + 1.15, 1.05, sofaZ - 0.24, {
      roughness: 0.4,
      metalness: 0.35,
      rotY: -0.22,
    }))

    // 7. COFFEE TABLE
    const tableX = 0.75
    const tableZ = -1.3
    roomGroup.add(createMesh(1.8, 0.1, 0.9, PALETTE.walnut, tableX, 0.45, tableZ, { roughness: 0.3, metalness: 0.2 }))
    roomGroup.add(createMesh(1.84, 0.03, 0.94, PALETTE.gold, tableX, 0.49, tableZ, { metalness: 0.85, roughness: 0.2 }))
    for (const [lx, lz] of [
      [-0.78, -0.35],
      [0.78, -0.35],
      [-0.78, 0.35],
      [0.78, 0.35],
    ]) {
      roomGroup.add(createMesh(0.065, 0.42, 0.065, PALETTE.gold, tableX + lx, 0.21, tableZ + lz, {
        metalness: 0.9,
        roughness: 0.2,
      }))
    }

    roomGroup.add(createMesh(0.38, 0.045, 0.28, PALETTE.parchment, tableX - 0.38, 0.53, tableZ + 0.04, {
      roughness: 0.6,
      rotY: 0.18,
    }))
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.12, 0.3, 24),
      new THREE.MeshStandardMaterial({ color: PALETTE.gold, roughness: 0.25, metalness: 0.85 })
    )
    vase.position.set(tableX + 0.45, 0.66, tableZ - 0.04)
    vase.castShadow = true
    roomGroup.add(vase)

    // 8. PENDANT LAMPS
    for (const px of [0.5, 1.25]) {
      roomGroup.add(createMesh(0.02, 1.5, 0.02, PALETTE.gold, px, 4.3, tableZ, {
        metalness: 0.9,
        roughness: 0.2,
        castShadow: false,
      }))
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0xfffae6,
          emissive: PALETTE.glow,
          emissiveIntensity: 1.8,
        })
      )
      globe.position.set(px, 3.4, tableZ)
      roomGroup.add(globe)
    }

    const pendantLight = new THREE.PointLight(0xffdf99, 15, 10, 2)
    pendantLight.position.set(0.88, 3.2, tableZ)
    roomGroup.add(pendantLight)

    // 9. WALNUT CREDENZA
    roomGroup.add(createMesh(2.2, 0.62, 0.55, PALETTE.walnut, -4.5, 0.38, -1.8, { roughness: 0.45 }))
    for (let h = 0; h < 3; h++) {
      roomGroup.add(createMesh(0.03, 0.14, 0.03, PALETTE.gold, -4.5, 0.4, -2.3 + h * 0.5, {
        metalness: 0.9,
        roughness: 0.2,
      }))
    }
    roomGroup.add(createMesh(0.32, 0.32, 0.32, PALETTE.cushionCream, -4.9, 0.85, -1.8, { roughness: 0.8 }))
    roomGroup.add(createMesh(0.24, 0.24, 0.24, PALETTE.gold, -4.5, 0.81, -1.8, { roughness: 0.25, metalness: 0.85 }))

    // Framed Art on side wall
    roomGroup.add(createMesh(1.0, 1.3, 0.06, 0x181412, -4.3, 2.9, -5.02, { castShadow: false }))
    roomGroup.add(createMesh(0.9, 1.15, 0.07, 0x3d332a, -4.3, 2.9, -5.01, { castShadow: false }))
    roomGroup.add(createMesh(0.55, 0.75, 0.075, PALETTE.gold, -4.3, 2.9, -5.0, {
      castShadow: false,
      metalness: 0.7,
      roughness: 0.3,
    }))

    // 10. PLANTER
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.2, 0.54, 24),
      new THREE.MeshStandardMaterial({ color: 0x221b16, roughness: 0.8, metalness: 0.1 })
    )
    pot.position.set(-4.4, 0.27, -3.8)
    pot.castShadow = true
    roomGroup.add(pot)

    for (const [ox, oy, oz, r] of [
      [0, 0.8, 0, 0.36],
      [0.18, 1.05, 0.1, 0.26],
      [-0.16, 0.98, -0.12, 0.22],
      [0.08, 1.22, -0.06, 0.18],
    ]) {
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshStandardMaterial({ color: PALETTE.green, roughness: 0.85 })
      )
      foliage.position.set(-4.4 + ox, oy, -3.8 + oz)
      foliage.castShadow = true
      roomGroup.add(foliage)
    }

    // 11. FLOOR LAMP
    roomGroup.add(createMesh(0.4, 0.05, 0.4, PALETTE.charcoal, 3.2, 0.03, -3.8))
    roomGroup.add(createMesh(0.035, 2.4, 0.035, PALETTE.gold, 3.2, 1.2, -3.8, { metalness: 0.9, roughness: 0.2 }))
    const lampGlobe = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfffae6, emissive: PALETTE.glow, emissiveIntensity: 1.5 })
    )
    lampGlobe.position.set(3.2, 2.45, -3.8)
    roomGroup.add(lampGlobe)

    const floorLampLight = new THREE.PointLight(0xffdf99, 10, 7, 2)
    floorLampLight.position.set(3.2, 2.4, -3.7)
    roomGroup.add(floorLampLight)

    // 12. LIGHTING
    const hemiLight = new THREE.HemisphereLight(0xfff5e6, 0x241c16, 1.3)
    scene.add(hemiLight)

    const sunLight = new THREE.DirectionalLight(0xffecd1, 2.1)
    sunLight.position.set(2.8, 5.8, -2.5)
    sunLight.target.position.set(-0.5, 0, -2.8)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.set(2048, 2048)
    sunLight.shadow.camera.left = -9
    sunLight.shadow.camera.right = 9
    sunLight.shadow.camera.top = 8
    sunLight.shadow.camera.bottom = -4
    sunLight.shadow.bias = -0.0004
    scene.add(sunLight, sunLight.target)

    // 13. CAMERA ORBIT
    const radius = 7.2
    const camHeight = 2.3
    const lookTarget = new THREE.Vector3(0, 1.25, -2.1)

    const minAngle = 0.45
    const maxAngle = 1.35
    let currentAngle = 0.92
    let targetAngle = 0.92
    let isDragging = false
    let lastMouseX = 0
    let idleTimer = 10

    const onPointerDown = (e) => {
      isDragging = true
      setIsInteracting(true)
      lastMouseX = e.clientX
      idleTimer = 0
      renderer.domElement.style.cursor = "grabbing"
    }

    const onPointerMove = (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - lastMouseX) * 0.0035
        targetAngle = Math.min(maxAngle, Math.max(minAngle, targetAngle + deltaX))
        lastMouseX = e.clientX
        idleTimer = 0
      }
    }

    const onPointerUp = () => {
      isDragging = false
      setIsInteracting(false)
      renderer.domElement.style.cursor = "grab"
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05)

      if (!isDragging) {
        idleTimer += delta
      }

      if (!isDragging && idleTimer > 2.0) {
        targetAngle += 0.045 * delta
        if (targetAngle > maxAngle) targetAngle = minAngle
      }

      targetAngle = Math.min(maxAngle, Math.max(minAngle, targetAngle))
      currentAngle += (targetAngle - currentAngle) * 0.08

      camera.position.set(
        Math.sin(currentAngle) * radius,
        camHeight,
        Math.cos(currentAngle) * radius
      )
      camera.lookAt(lookTarget)

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })

      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <section className="relative min-h-[92vh] lg:min-h-[98vh] w-full flex flex-col justify-between overflow-hidden bg-[#12100e] border-t border-b border-[#2B2623]/70">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 z-0 touch-none" aria-label="Interactive 3D Architectural Scene" />

      {/* Subtle Bottom Vignette Only (Top is completely clear so Logo is 100% visible) */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none bg-gradient-to-t from-[#12100e]/90 to-transparent" />

      {/* Top Center Big Hero Typography Overlay */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 pt-10 md:pt-14 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181411]/85 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md mb-4"
        >
          <Compass className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
          <span className="text-[#D4AF37] text-xs font-mono tracking-[0.2em] uppercase">
            Interactive 3D Spatial Experience
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-[#FFFFFF] tracking-tight leading-tight mb-3 drop-shadow-2xl"
        >
          STEP INSIDE <br />
          <span className="text-[#D4AF37] italic font-serif">THE VISION</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-sm sm:text-base text-[#F7F3EA]/90 max-w-xl mx-auto leading-relaxed font-sans drop-shadow-lg mb-4"
        >
          A multidisciplinary studio bridging interior aesthetics with structural integrity — explore this spatial concept in real-time 3D, then let our verified experts build yours.
        </motion.p>
      </div>

      {/* Bottom Floating Controls & Action Buttons */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pb-8 md:pb-12 text-center pointer-events-none w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
        >
          <button
            onClick={() => navigate("/designs")}
            className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C89B24] text-[#12100e] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-2xl shadow-[#D4AF37]/30 flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            <span>Explore 3D Designs</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate("/Signup")}
            className="px-8 py-3.5 bg-[#1e1915]/90 hover:bg-[#2c241e] text-[#FFFFFF] border border-[#D4AF37]/50 font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.03] cursor-pointer flex items-center gap-2 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Post Your Project Brief</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
