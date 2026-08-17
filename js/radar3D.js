/* =========================================================================
   COSMOS-2: 3D HOLOGRAPHIC TACTICAL RADAR & SENSOR SYSTEM
   ========================================================================= */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class Radar3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
  }

  render(shipPhysics, camera, celestialMeshMap, currentTarget, celestialData) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.clearRect(0, 0, w, h);

    const sensorRange = shipPhysics.getSensorRadarRange();
    const scale = (w / 2 - 10) / sensorRange;

    // 1. Draw Radar Range Rings
    this.ctx.strokeStyle = "rgba(0, 243, 255, 0.2)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath(); this.ctx.arc(cx, cy, (w / 2 - 10) * 0.33, 0, Math.PI * 2); this.ctx.stroke();
    this.ctx.beginPath(); this.ctx.arc(cx, cy, (w / 2 - 10) * 0.66, 0, Math.PI * 2); this.ctx.stroke();
    this.ctx.beginPath(); this.ctx.arc(cx, cy, (w / 2 - 10), 0, Math.PI * 2); this.ctx.stroke();

    // 2. Center Ship Triangle Marker
    this.ctx.fillStyle = "#00f3ff";
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - 6);
    this.ctx.lineTo(cx - 4, cy + 4);
    this.ctx.lineTo(cx + 4, cy + 4);
    this.ctx.closePath();
    this.ctx.fill();

    // 3. Plot Celestial Bodies & Nested Moons on Radar Grid
    celestialData.forEach(data => {
      const obj = celestialMeshMap.get(data.id);
      if (!obj) return;

      const relPos = obj.group.position.clone().sub(shipPhysics.position);
      relPos.applyQuaternion(camera.quaternion.clone().invert());

      const rx = cx + relPos.x * scale;
      const ry = cy + relPos.z * scale;

      if (rx >= 4 && rx <= w - 4 && ry >= 4 && ry <= h - 4) {
        const isTarget = data.id === currentTarget.id;
        
        if (data.isBlackHole) {
          this.ctx.fillStyle = "#ff3344";
        } else if (data.isPulsar) {
          this.ctx.fillStyle = "#b042ff";
        } else if (data.emissive) {
          this.ctx.fillStyle = "#ffaa00";
        } else if (isTarget) {
          this.ctx.fillStyle = "#00ff66";
        } else {
          this.ctx.fillStyle = "#00f3ff";
        }

        this.ctx.beginPath();
        this.ctx.arc(rx, ry, isTarget ? 4.5 : 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        if (isTarget) {
          this.ctx.strokeStyle = "#00ff66";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      // Plot Moons if present
      if (obj.moonsMap) {
        obj.moonsMap.forEach((moonGroup, moonId) => {
          const worldPos = new THREE.Vector3();
          moonGroup.getWorldPosition(worldPos);

          const moonRel = worldPos.sub(shipPhysics.position);
          moonRel.applyQuaternion(camera.quaternion.clone().invert());

          const mx = cx + moonRel.x * scale;
          const my = cy + moonRel.z * scale;

          if (mx >= 4 && mx <= w - 4 && my >= 4 && my <= h - 4) {
            this.ctx.fillStyle = moonId === currentTarget.id ? "#00ff66" : "#77aacc";
            this.ctx.beginPath();
            this.ctx.arc(mx, my, moonId === currentTarget.id ? 3.5 : 1.5, 0, Math.PI * 2);
            this.ctx.fill();
          }
        });
      }
    });
  }
}
