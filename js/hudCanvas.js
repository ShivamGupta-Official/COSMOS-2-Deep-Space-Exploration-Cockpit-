/* =========================================================================
   COSMOS-2: SCREEN-SPACE 2D HUD CANVAS & PITCH HORIZON OVERLAY
   ========================================================================= */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class HUDCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render(ship, camera, currentTarget, celestialMeshMap, audioWaveformData) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // 1. Draw Audio Waveform Visualizer in Cockpit Header
    if (audioWaveformData && audioWaveformData.length > 0) {
      this.drawAudioWaveform(audioWaveformData, w / 2, 45);
    }

    // 2. Draw Pitch Horizon Ladder Lines
    this.drawPitchHorizonLadder(camera, w, h);

    // 3. Draw Target Lock Brackets & Off-Screen Arrows
    if (currentTarget) {
      this.drawTargetBrackets(ship, camera, currentTarget, celestialMeshMap, w, h);
    }
  }

  drawAudioWaveform(data, cx, cy) {
    const barWidth = 3;
    const gap = 2;
    const totalW = data.length * (barWidth + gap);
    let startX = cx - totalW / 2;

    this.ctx.fillStyle = "rgba(0, 243, 255, 0.6)";
    for (let i = 0; i < data.length; i++) {
      const barH = (data[i] / 255) * 22;
      this.ctx.fillRect(startX, cy - barH / 2, barWidth, Math.max(2, barH));
      startX += barWidth + gap;
    }
  }

  drawPitchHorizonLadder(camera, w, h) {
    // Calculate pitch angle from camera quaternion
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const pitchDeg = (euler.x * (180 / Math.PI)).toFixed(1);
    
    const cx = w / 2;
    const cy = h / 2 + euler.x * 300;

    this.ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
    this.ctx.lineWidth = 1.2;

    // Center Horizon Line
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 100, cy); this.ctx.lineTo(cx - 30, cy);
    this.ctx.moveTo(cx + 30, cy);  this.ctx.lineTo(cx + 100, cy);
    this.ctx.stroke();

    // Pitch Angle Text
    this.ctx.fillStyle = "rgba(0, 243, 255, 0.5)";
    this.ctx.font = "10px 'Share Tech Mono', monospace";
    this.ctx.fillText(`${pitchDeg > 0 ? '+' : ''}${pitchDeg}°`, cx + 110, cy + 4);
  }

  drawTargetBrackets(ship, camera, targetData, celestialMeshMap, w, h) {
    const targetObj = celestialMeshMap.get(targetData.id);
    if (!targetObj) return;

    const targetPos = targetObj.group.position.clone();
    const screenPos = targetPos.clone().project(camera);

    const isBehind = screenPos.z > 1;
    const x = (screenPos.x * 0.5 + 0.5) * w;
    const y = (-(screenPos.y * 0.5) + 0.5) * h;

    if (!isBehind && x >= 20 && x <= w - 20 && y >= 20 && y <= h - 20) {
      // Bracket Box Size based on distance
      const dist = ship.position.distanceTo(targetPos);
      const boxSize = Math.max(32, Math.min(180, 1800 / dist));
      const hSize = boxSize / 2;
      const len = boxSize * 0.25;

      this.ctx.strokeStyle = targetData.isBlackHole ? "#ff3344" : "#00f3ff";
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = this.ctx.strokeStyle;
      this.ctx.shadowBlur = 8;

      // Top-Left
      this.ctx.beginPath();
      this.ctx.moveTo(x - hSize, y - hSize + len);
      this.ctx.lineTo(x - hSize, y - hSize);
      this.ctx.lineTo(x - hSize + len, y - hSize);
      this.ctx.stroke();

      // Top-Right
      this.ctx.beginPath();
      this.ctx.moveTo(x + hSize - len, y - hSize);
      this.ctx.lineTo(x + hSize, y - hSize);
      this.ctx.lineTo(x + hSize, y - hSize + len);
      this.ctx.stroke();

      // Bottom-Left
      this.ctx.beginPath();
      this.ctx.moveTo(x - hSize, y + hSize - len);
      this.ctx.lineTo(x - hSize, y + hSize);
      this.ctx.lineTo(x - hSize + len, y + hSize);
      this.ctx.stroke();

      // Bottom-Right
      this.ctx.beginPath();
      this.ctx.moveTo(x + hSize - len, y + hSize);
      this.ctx.lineTo(x + hSize, y + hSize);
      this.ctx.lineTo(x + hSize, y + hSize - len);
      this.ctx.stroke();

      // Target Label
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.ctx.font = "11px 'Share Tech Mono', monospace";
      this.ctx.fillText(`${targetData.name.toUpperCase()} [${dist.toFixed(1)} AU]`, x - hSize, y - hSize - 8);
    } else {
      // Off-Screen Arrow Tracking Pointer
      const angle = Math.atan2(y - h / 2, x - w / 2);
      const edgeX = Math.max(30, Math.min(w - 30, w / 2 + Math.cos(angle) * (w / 2 - 40)));
      const edgeY = Math.max(30, Math.min(h - 30, h / 2 + Math.sin(angle) * (h / 2 - 40)));

      this.ctx.fillStyle = "#ffaa00";
      this.ctx.beginPath();
      this.ctx.arc(edgeX, edgeY, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = "#ffaa00";
      this.ctx.font = "10px 'Share Tech Mono', monospace";
      this.ctx.fillText(targetData.name.toUpperCase(), edgeX + 10, edgeY + 4);
    }
  }
}
