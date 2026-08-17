/* =========================================================================
   COSMOS-2: MAIN APPLICATION ORCHESTRATOR (Three.js ES6 Module)
   ========================================================================= */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { CELESTIAL_DATA } from './js/celestialData.js';
import { 
  createEarthTexture, 
  createJupiterTexture, 
  createSaturnRingTexture, 
  createIceMoonTexture, 
  createIoTexture, 
  createCrateredMoonTexture 
} from './js/proceduralTextures.js';
import { FlightPhysics } from './js/flightPhysics.js';
import { AudioSynth } from './js/audioSynth.js';
import { HUDCanvas } from './js/hudCanvas.js';
import { Radar3D } from './js/radar3D.js';

/* 1. SCENE & CAMERA SETUP */
const canvas = document.getElementById("webgl-canvas");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x010308, 0.00045);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);

/* Lighting */
const ambientLight = new THREE.AmbientLight(0x20354c, 1.5);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xfffaed, 4.0, 5000, 0.4);
scene.add(sunLight);

/* 2. STARFIELD BACKGROUND */
function createStarfield() {
  const geom = new THREE.BufferGeometry();
  const count = 9000;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    const r = 3000 + Math.random() * 5000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    pos[i] = r * Math.sin(phi) * Math.cos(theta);
    pos[i+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i+2] = r * Math.cos(phi);

    const type = Math.random();
    if (type > 0.85) { colors[i] = 0.3; colors[i+1] = 0.8; colors[i+2] = 1.0; }
    else if (type > 0.7) { colors[i] = 1.0; colors[i+1] = 0.7; colors[i+2] = 0.3; }
    else { colors[i] = 1.0; colors[i+1] = 1.0; colors[i+2] = 1.0; }
  }

  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.95 });
  return new THREE.Points(geom, mat);
}
scene.add(createStarfield());

/* 3. PROCEDURAL ASTEROID BELT (MARS TO JUPITER) */
const asteroidGroup = new THREE.Group();
scene.add(asteroidGroup);
const asteroidMeshes = [];

function createAsteroidBelt() {
  const asteroidGeom = new THREE.DodecahedronGeometry(1.2, 1);
  const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x665544, roughness: 0.9 });

  for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(asteroidGeom, asteroidMat);
    const dist = 195 + Math.random() * 45; // Belt between Mars (165) and Jupiter (260)
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 15;

    mesh.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
    const scale = 0.6 + Math.random() * 2.2;
    mesh.scale.set(scale, scale, scale);

    asteroidGroup.add(mesh);
    asteroidMeshes.push({ mesh, angle, dist, speed: 0.002 + Math.random() * 0.003, height });
  }
}
createAsteroidBelt();

/* 4. WARP PARTICLES */
let warpParticleGroup;
function createWarpTunnelParticles() {
  const count = 1500;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 90;
    pos[i+1] = (Math.random() - 0.5) * 90;
    pos[i+2] = -Math.random() * 450;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x00f3ff, size: 2.0, transparent: true, opacity: 0 });
  warpParticleGroup = new THREE.Points(geom, mat);
  scene.add(warpParticleGroup);
}
createWarpTunnelParticles();

/* 5. CELESTIAL & MOON BUILDER */
const celestialMeshMap = new Map();
const orbitLinesGroup = new THREE.Group();
scene.add(orbitLinesGroup);

const earthTexture = createEarthTexture();
const jupiterTexture = createJupiterTexture();
const saturnRingTexture = createSaturnRingTexture();
const iceTexture = createIceMoonTexture();
const ioTexture = createIoTexture();
const craterTexture = createCrateredMoonTexture();

CELESTIAL_DATA.forEach(data => {
  const bodyGroup = new THREE.Group();
  let mesh;

  if (data.isBlackHole || data.isBinaryBlackHole) {
    // Black Hole Event Horizon
    const geom = new THREE.SphereGeometry(data.radius, 48, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    mesh = new THREE.Mesh(geom, mat);
    bodyGroup.add(mesh);

    // Relativistic Accretion Disk
    const diskGeom = new THREE.RingGeometry(data.radius * 1.3, data.radius * 4.5, 64);
    const diskMat = new THREE.MeshBasicMaterial({ color: 0xff6600, side: THREE.DoubleSide, transparent: true, opacity: 0.88 });
    const disk = new THREE.Mesh(diskGeom, diskMat);
    disk.rotation.x = Math.PI / 2.3;
    bodyGroup.add(disk);

    // Gravitational Photon Glow
    const glowGeom = new THREE.SphereGeometry(data.radius * 1.15, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.35 });
    bodyGroup.add(new THREE.Mesh(glowGeom, glowMat));

    // Companion Blue Supergiant for Cygnus X-1
    if (data.isBinaryBlackHole) {
      const starGeom = new THREE.SphereGeometry(8.0, 32, 32);
      const starMat = new THREE.MeshBasicMaterial({ color: 0x3399ff });
      const companion = new THREE.Mesh(starGeom, starMat);
      companion.position.set(35, 0, 0);
      bodyGroup.add(companion);
    }

  } else if (data.isPulsar) {
    // Crab Pulsar Neutron Star
    const geom = new THREE.SphereGeometry(data.radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0xb042ff });
    mesh = new THREE.Mesh(geom, mat);
    bodyGroup.add(mesh);

    // Twin Gamma-Ray Radiation Beams
    const beamGeom = new THREE.CylinderGeometry(0.8, 12, 120, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.65 });
    
    const beamTop = new THREE.Mesh(beamGeom, beamMat);
    beamTop.position.y = 60;
    bodyGroup.add(beamTop);

    const beamBottom = new THREE.Mesh(beamGeom, beamMat);
    beamBottom.position.y = -60;
    beamBottom.rotation.z = Math.PI;
    bodyGroup.add(beamBottom);

  } else if (data.emissive) {
    // Sol
    const geom = new THREE.SphereGeometry(data.radius, 48, 48);
    const mat = new THREE.MeshBasicMaterial({ color: data.color });
    mesh = new THREE.Mesh(geom, mat);
    bodyGroup.add(mesh);

    const coronaGeom = new THREE.SphereGeometry(data.radius * 1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.28 });
    bodyGroup.add(new THREE.Mesh(coronaGeom, coronaMat));

  } else {
    // Planet Body
    const geom = new THREE.SphereGeometry(data.radius, 32, 32);
    let mat;
    if (data.id === "earth") mat = new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.6 });
    else if (data.id === "jupiter") mat = new THREE.MeshStandardMaterial({ map: jupiterTexture, roughness: 0.7 });
    else mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7, metalness: 0.1 });

    mesh = new THREE.Mesh(geom, mat);
    bodyGroup.add(mesh);

    if (data.hasRings) {
      const ringGeom = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.5, 48);
      const ringMat = new THREE.MeshStandardMaterial({ map: saturnRingTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      const rings = new THREE.Mesh(ringGeom, ringMat);
      rings.rotation.x = Math.PI / 2.2;
      bodyGroup.add(rings);
    }
  }

  bodyGroup.position.x = data.distance;
  scene.add(bodyGroup);

  // Build Nested Moons if present
  const moonsMap = new Map();
  if (data.moons && data.moons.length > 0) {
    data.moons.forEach(m => {
      const moonPivot = new THREE.Group();
      bodyGroup.add(moonPivot);

      const mGeom = new THREE.SphereGeometry(m.radius, 24, 24);
      let mMat;
      if (m.id === "io") mMat = new THREE.MeshStandardMaterial({ map: ioTexture, roughness: 0.8 });
      else if (m.id === "europa" || m.id === "enceladus") mMat = new THREE.MeshStandardMaterial({ map: iceTexture, roughness: 0.5 });
      else mMat = new THREE.MeshStandardMaterial({ map: craterTexture, roughness: 0.9 });

      const mMesh = new THREE.Mesh(mGeom, mMat);
      mMesh.position.x = m.distance;
      moonPivot.add(mMesh);

      moonsMap.set(m.id, moonPivot);
    });
  }

  celestialMeshMap.set(data.id, {
    group: bodyGroup,
    mesh: mesh,
    angle: Math.random() * Math.PI * 2,
    data: data,
    moonsMap: moonsMap
  });

  // Orbit Trajectory Ring
  if (data.distance > 0) {
    const orbitCurve = new THREE.EllipseCurve(0, 0, data.distance, data.distance, 0, 2 * Math.PI, false, 0);
    const points = orbitCurve.getPoints(140);
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.18 });
    const orbitLine = new THREE.Line(orbitGeom, orbitMat);
    orbitLinesGroup.add(orbitLine);
  }
});

/* 6. INSTANTIATE MODULES */
const flightPhysics = new FlightPhysics();
const audioSynth = new AudioSynth();
const hudCanvas = new HUDCanvas("hud-canvas");
const radar3D = new Radar3D("radar-canvas");

/* 7. CONTROLS & EVENT HANDLING */
const input = { pitch: 0, yaw: 0, roll: 0, thrust: 0, boost: false, spacebrake: false };
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  audioSynth.init();

  if (e.code === "KeyV") {
    flightPhysics.cameraMode = flightPhysics.cameraMode === "1st" ? "3rd" : "1st";
    document.getElementById("btn-view-mode").innerText = `Cam: ${flightPhysics.cameraMode === "1st" ? '1st Person' : '3rd Person'}`;
  }
  if (e.code === "KeyT") lockTargetInCrosshair();
});
window.addEventListener("keyup", (e) => { keys[e.code] = false; });

let joyPitch = 0, joyYaw = 0, joyThrottle = 0, joyRoll = 0;

function setupJoystick(zoneId, stickId, onMove) {
  const zone = document.getElementById(zoneId);
  const stick = document.getElementById(stickId);
  let active = false;
  let startX = 0, startY = 0;
  const maxRadius = 42;

  const handleStart = (clientX, clientY) => {
    active = true;
    const rect = zone.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
    handleMove(clientX, clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (!active) return;
    let dx = clientX - startX;
    let dy = clientY - startY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;
    onMove(dx / maxRadius, dy / maxRadius);
  };

  const handleEnd = () => {
    active = false;
    stick.style.transform = `translate(0px, 0px)`;
    onMove(0, 0);
  };

  zone.addEventListener("pointerdown", (e) => handleStart(e.clientX, e.clientY));
  window.addEventListener("pointermove", (e) => { if(active) handleMove(e.clientX, e.clientY); });
  window.addEventListener("pointerup", handleEnd);
  window.addEventListener("pointercancel", handleEnd);
}

setupJoystick("joy-left", "stick-left", (x, y) => { joyYaw = -x * 0.035; joyPitch = -y * 0.035; });
setupJoystick("joy-right", "stick-right", (x, y) => { joyRoll = -x * 0.035; joyThrottle = -y; });

/* 8. STELLAR DATABASE UI & TARGET SELECTION */
const entityListEl = document.getElementById("entity-list");
const searchInput = document.getElementById("search-entities");
let currentTarget = CELESTIAL_DATA[0];

function populateEntityList(filter = "") {
  entityListEl.innerHTML = "";
  const filterLower = filter.toLowerCase();

  CELESTIAL_DATA.forEach(data => {
    if (data.name.toLowerCase().includes(filterLower)) {
      createEntityItem(data);
    }
    // Search moons
    if (data.moons) {
      data.moons.forEach(m => {
        if (m.name.toLowerCase().includes(filterLower)) {
          createEntityItem({ ...m, type: "moon", tagClass: "tag-moon" }, data.name);
        }
      });
    }
  });
}

function createEntityItem(data, parentName = "") {
  const div = document.createElement("div");
  div.className = `entity-item ${data.id === currentTarget.id ? 'active' : ''}`;
  div.innerHTML = `
    <span class="entity-name">${parentName ? `${parentName} → ` : ''}${data.name}</span>
    <span class="tag-badge ${data.tagClass}">${data.type}</span>
  `;
  div.onclick = () => {
    audioSynth.init();
    audioSynth.playBeep(880, 0.08);
    selectTarget(data);
  };
  entityListEl.appendChild(div);
}

function selectTarget(data) {
  currentTarget = data;
  populateEntityList(searchInput.value);

  document.getElementById("target-name").innerText = data.name;
  const tagBadge = document.getElementById("target-class");
  tagBadge.innerText = data.type.toUpperCase();
  tagBadge.className = `tag-badge ${data.tagClass}`;

  document.getElementById("tel-radius").innerText = data.realRadius;
  document.getElementById("tel-gravity").innerText = data.gravity;
  document.getElementById("tel-temp").innerText = data.temp;
  document.getElementById("target-desc").innerText = data.desc;

  if (data.atm && data.atm.length >= 2) {
    document.getElementById("atm-label-1").children[0].innerText = data.atm[0].name;
    document.getElementById("atm-val-1").innerText = `${data.atm[0].val}%`;
    document.getElementById("atm-bar-1").style.width = `${data.atm[0].val}%`;

    document.getElementById("atm-label-2").children[0].innerText = data.atm[1].name;
    document.getElementById("atm-val-2").innerText = `${data.atm[1].val}%`;
    document.getElementById("atm-bar-2").style.width = `${data.atm[1].val}%`;
  }
}

searchInput.addEventListener("input", (e) => populateEntityList(e.target.value));

function lockTargetInCrosshair() {
  let closestData = null;
  let minAngle = Infinity;
  const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

  CELESTIAL_DATA.forEach(data => {
    const meshObj = celestialMeshMap.get(data.id);
    if (!meshObj) return;

    const toTarget = meshObj.group.position.clone().sub(flightPhysics.position).normalize();
    const angle = forwardDir.angleTo(toTarget);
    if (angle < minAngle && angle < 0.35) {
      minAngle = angle;
      closestData = data;
    }
  });

  if (closestData) {
    selectTarget(closestData);
    audioSynth.playBeep(1200, 0.15);
  }
}

/* Power Sliders Event Handlers */
["engines", "shields", "sensors", "warp"].forEach(sys => {
  const slider = document.getElementById(`slider-${sys}`);
  slider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    flightPhysics.setPowerAllocation(sys, val);
    document.getElementById(`val-${sys}`).innerText = `${val}%`;
  });
});

/* Warp & Vector Alignment Buttons */
let isWarping = false;
document.getElementById("btn-warp").onclick = () => {
  audioSynth.init();
  audioSynth.playWarpSound();

  const targetObj = celestialMeshMap.get(currentTarget.id);
  if (targetObj && !isWarping) {
    isWarping = true;
    warpParticleGroup.material.opacity = 0.9;

    const targetPos = targetObj.group.position;
    const offset = new THREE.Vector3(0, targetObj.data.radius * 0.8, targetObj.data.radius * 3.6);
    const destination = targetPos.clone().add(offset);

    let warpProgress = 0;
    const warpInterval = setInterval(() => {
      warpProgress += 0.04;
      flightPhysics.position.lerp(destination, 0.12);
      camera.position.copy(flightPhysics.position);
      camera.lookAt(targetPos);

      if (warpProgress >= 1.0) {
        clearInterval(warpInterval);
        flightPhysics.position.copy(destination);
        flightPhysics.velocity.set(0, 0, 0);
        warpParticleGroup.material.opacity = 0;
        isWarping = false;
      }
    }, 30);
  }
};

document.getElementById("btn-align").onclick = () => {
  audioSynth.init();
  audioSynth.playBeep(900, 0.1);
  const targetObj = celestialMeshMap.get(currentTarget.id);
  if (targetObj) {
    const targetPos = targetObj.group.position;
    const lookMat = new THREE.Matrix4().lookAt(flightPhysics.position, targetPos, new THREE.Vector3(0, 1, 0));
    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMat);
    camera.quaternion.slerp(targetQuat, 0.85);
  }
};

/* Dashboard Toggle Buttons */
let showOrbits = true;
document.getElementById("btn-orbit-lines").onclick = function() {
  showOrbits = !showOrbits;
  orbitLinesGroup.visible = showOrbits;
  this.innerText = `Orbits: ${showOrbits ? 'ON' : 'OFF'}`;
  this.classList.toggle("active", showOrbits);
  document.getElementById("dot-orbits").classList.toggle("active", showOrbits);
};

document.getElementById("btn-sound").onclick = function() {
  audioSynth.init();
  audioSynth.enabled = !audioSynth.enabled;
  this.innerText = `Audio: ${audioSynth.enabled ? 'ON' : 'OFF'}`;
  this.classList.toggle("active", audioSynth.enabled);
  document.getElementById("dot-audio").classList.toggle("active", audioSynth.enabled);
};

document.getElementById("btn-dampeners").onclick = function() {
  flightPhysics.dampening = !flightPhysics.dampening;
  this.innerText = flightPhysics.dampening ? 'Inertia Lock' : 'Drift Mode';
  this.classList.toggle("active", flightPhysics.dampening);
  document.getElementById("dot-dampener").classList.toggle("active", flightPhysics.dampening);
};

document.getElementById("btn-view-mode").onclick = () => {
  flightPhysics.cameraMode = flightPhysics.cameraMode === "1st" ? "3rd" : "1st";
  document.getElementById("btn-view-mode").innerText = `Cam: ${flightPhysics.cameraMode === "1st" ? '1st Person' : '3rd Person'}`;
};

populateEntityList();
selectTarget(CELESTIAL_DATA[0]);

/* 9. MAIN ANIMATION & PHYSICS LOOP */
const clock = new THREE.Clock();
const hudVelocity = document.getElementById("hud-velocity");
const hudThrustPct = document.getElementById("hud-thrust-pct");
const thrustBarFill = document.getElementById("thrust-bar-fill");
const telDistance = document.getElementById("tel-distance");

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  // 1. Orbit Planets & Rotate Celestial Objects
  celestialMeshMap.forEach(item => {
    if (item.data.distance > 0) {
      item.angle += item.data.orbitSpeed * delta * 0.4;
      item.group.position.x = Math.cos(item.angle) * item.data.distance;
      item.group.position.z = Math.sin(item.angle) * item.data.distance;
    }
    if (item.mesh) {
      item.mesh.rotation.y += item.data.rotationSpeed;
    }

    // Rotate Moons around Parent Planets
    if (item.moonsMap && item.data.moons) {
      item.data.moons.forEach(m => {
        const pivot = item.moonsMap.get(m.id);
        if (pivot) {
          pivot.rotation.y += m.orbitSpeed * delta * 2.0;
        }
      });
    }
  });

  // 2. Rotate Asteroid Belt
  asteroidMeshes.forEach(ast => {
    ast.angle += ast.speed * delta;
    ast.mesh.position.x = Math.cos(ast.angle) * ast.dist;
    ast.mesh.position.z = Math.sin(ast.angle) * ast.dist;
    ast.mesh.rotation.x += 0.01;
    ast.mesh.rotation.y += 0.01;
  });

  // 3. Process Input Vector
  input.pitch = joyPitch; input.yaw = joyYaw; input.roll = joyRoll; input.thrust = joyThrottle;
  if (keys["KeyW"]) input.thrust += 1.0;
  if (keys["KeyS"]) input.thrust -= 0.6;
  if (keys["ArrowUp"]) input.pitch += 0.035;
  if (keys["ArrowDown"]) input.pitch -= 0.035;
  if (keys["KeyA"] || keys["ArrowLeft"]) input.yaw += 0.035;
  if (keys["KeyD"] || keys["ArrowRight"]) input.yaw -= 0.035;
  if (keys["KeyQ"]) input.roll += 0.035;
  if (keys["KeyE"]) input.roll -= 0.035;
  input.boost = keys["ShiftLeft"] || keys["ShiftRight"];
  input.spacebrake = keys["Space"];

  // Update Flight Physics
  flightPhysics.update(delta, input, camera);
  flightPhysics.rechargeShields(delta);

  // Update UI Status Indicators
  document.getElementById("stat-shields-val").innerText = `${Math.round(flightPhysics.shieldCondition)}%`;
  document.getElementById("bar-shields").style.width = `${flightPhysics.shieldCondition}%`;
  document.getElementById("stat-hull-val").innerText = `${Math.round(flightPhysics.hullCondition)}%`;
  document.getElementById("bar-hull").style.width = `${flightPhysics.hullCondition}%`;

  const currentSpeed = flightPhysics.velocity.length();
  hudVelocity.innerText = `${(currentSpeed * 10).toFixed(2)} AU/s`;
  const thrustPct = Math.min(100, Math.round((currentSpeed / 8.0) * 100));
  hudThrustPct.innerText = `${thrustPct}%`;
  thrustBarFill.style.width = `${thrustPct}%`;

  audioSynth.updateEngine(currentSpeed / 20.0);

  const targetObj = celestialMeshMap.get(currentTarget.id);
  if (targetObj) {
    const dist = flightPhysics.position.distanceTo(targetObj.group.position);
    telDistance.innerText = `${dist.toFixed(1)} AU`;
  }

  // 4. Render 3D Scene + 2D Overlays
  renderer.render(scene, camera);
  hudCanvas.render(flightPhysics, camera, currentTarget, celestialMeshMap, audioSynth.getWaveformData());
  radar3D.render(flightPhysics, camera, celestialMeshMap, currentTarget, CELESTIAL_DATA);
}

// Start Main Loop
animate();
