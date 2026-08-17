/* =========================================================================
   COSMOS-2: PROCEDURAL TEXTURE & SHADER GENERATOR
   ========================================================================= */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Oceans
  ctx.fillStyle = "#10386e";
  ctx.fillRect(0, 0, 1024, 512);

  // Continents
  ctx.fillStyle = "#2d7d32";
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 40 + Math.random() * 130;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Deserts
  ctx.fillStyle = "#bcaaa4";
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 1024;
    const y = 180 + Math.random() * 150;
    const r = 30 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 40);
  ctx.fillRect(0, 472, 1024, 40);

  return new THREE.CanvasTexture(canvas);
}

export function createJupiterTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const colors = ["#d4a373", "#faedcd", "#e9edc9", "#ccd5ae", "#bb9457", "#432818", "#99582a"];
  for (let y = 0; y < 512; y += 6) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, y, 1024, 6);
  }

  // Great Red Spot
  ctx.fillStyle = "#a83232";
  ctx.beginPath();
  ctx.ellipse(680, 310, 75, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export function createSaturnRingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 64;
  const ctx = canvas.getContext("2d");

  for (let x = 0; x < 512; x++) {
    const alpha = Math.sin(x * 0.12) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(225, 205, 160, ${alpha * 0.85})`;
    ctx.fillRect(x, 0, 1, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export function createIceMoonTexture(baseColor = "#b5d4e8", lineColors = "#7a9cb5") {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 256);

  // Line cracks
  ctx.strokeStyle = lineColors;
  ctx.lineWidth = 2;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 256;
    ctx.moveTo(x, y);
    for (let j = 0; j < 5; j++) {
      x += (Math.random() - 0.5) * 60;
      y += (Math.random() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

export function createIoTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#e6cb43";
  ctx.fillRect(0, 0, 512, 256);

  // Volcanic caldera spots
  ctx.fillStyle = "#222222";
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 3 + Math.random() * 12;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Red ring around caldera
    ctx.strokeStyle = "#cc3300";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

export function createCrateredMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#888888";
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#555555";
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 4 + Math.random() * 20;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#aaaaaa";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}
