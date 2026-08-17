/* =========================================================================
   COSMOS-2: 6-DOF FLIGHT PHYSICS & SHIP POWER DISTRIBUTION ENGINE
   ========================================================================= */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class FlightPhysics {
  constructor() {
    this.position = new THREE.Vector3(0, 18, 160);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.quaternion = new THREE.Quaternion();
    
    // Base Parameters
    this.baseMaxSpeed = 160.0;
    this.dampening = true;
    this.cameraMode = "1st"; // "1st" or "3rd"
    this.shieldCondition = 100;
    this.hullCondition = 100;

    // Power Distribution Systems (%)
    this.power = {
      engines: 35,
      shields: 25,
      sensors: 25,
      warp: 15
    };
  }

  setPowerAllocation(system, val) {
    this.power[system] = Math.max(0, Math.min(100, val));
  }

  getEffectiveMaxSpeed() {
    // Engine power scales top speed (0.5x to 2.2x)
    const engineMult = 0.5 + (this.power.engines / 100) * 1.7;
    return this.baseMaxSpeed * engineMult;
  }

  getSensorRadarRange() {
    // Sensor power scales radar detection radius (50 AU to 350 AU)
    return 50 + (this.power.sensors / 100) * 300;
  }

  update(delta, input, camera) {
    const forwardVector = new THREE.Vector3(0, 0, -1);
    
    // 1. Process Rotational Input (Pitch, Yaw, Roll)
    const rotEuler = new THREE.Euler(input.pitch, input.yaw, input.roll, 'YXZ');
    const rotQuat = new THREE.Quaternion().setFromEuler(rotEuler);
    camera.quaternion.multiply(rotQuat);

    // 2. Thrust & Boost Calculation
    const enginePowerMult = 0.6 + (this.power.engines / 100) * 1.4;
    const boostMult = input.boost ? 2.8 : 1.0;
    const moveDir = forwardVector.clone().applyQuaternion(camera.quaternion);

    if (Math.abs(input.thrust) > 0.04) {
      this.velocity.addScaledVector(moveDir, input.thrust * boostMult * enginePowerMult * delta * 15.0);
    }

    // 3. Inertial Dampening & Spacebrake
    if (input.spacebrake) {
      this.velocity.multiplyScalar(0.88);
    } else if (this.dampening && Math.abs(input.thrust) <= 0.04) {
      this.velocity.multiplyScalar(0.97);
    }

    // Clamp speed based on engine power allocation
    const maxSpeed = this.getEffectiveMaxSpeed();
    this.velocity.clampLength(0, maxSpeed);

    // Update Position
    this.position.add(this.velocity);

    // Camera Placement
    if (this.cameraMode === "1st") {
      camera.position.copy(this.position);
    } else {
      const chaseOffset = new THREE.Vector3(0, 9, 32).applyQuaternion(camera.quaternion);
      camera.position.copy(this.position).add(chaseOffset);
    }
  }

  damageShields(amount) {
    const shieldAbsorb = (this.power.shields / 100) * 0.7; // Shields absorb up to 70% damage
    const directDamage = amount * (1.0 - shieldAbsorb);
    
    this.shieldCondition = Math.max(0, this.shieldCondition - amount);
    if (this.shieldCondition <= 0) {
      this.hullCondition = Math.max(0, this.hullCondition - directDamage * 2.0);
    }
  }

  rechargeShields(delta) {
    if (this.shieldCondition < 100 && this.power.shields > 0) {
      const rechargeRate = (this.power.shields / 100) * 5.0 * delta;
      this.shieldCondition = Math.min(100, this.shieldCondition + rechargeRate);
    }
  }
}
