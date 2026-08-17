/* =========================================================================
   COSMOS-2: CELESTIAL DATABASE (Solar System + Moons + Black Holes + Pulsars)
   ========================================================================= */

export const CELESTIAL_DATA = [
  // --- CENTRAL STAR ---
  {
    id: "sun",
    name: "Sun (Sol)",
    type: "star",
    tagClass: "tag-star",
    color: 0xffaa00,
    emissive: true,
    radius: 24,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.0015,
    realRadius: "696,340 km",
    gravity: "274.0 m/s²",
    temp: "5,778 K",
    desc: "Yellow main-sequence G-type star at the center of the solar system, generating solar flares and coronal magnetic fields.",
    atm: [{ name: "Hydrogen", val: 73.4 }, { name: "Helium", val: 24.9 }]
  },

  // --- PLANETS & MOONS ---
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    tagClass: "tag-planet",
    color: 0x8c8c8c,
    radius: 2.2,
    distance: 50,
    orbitSpeed: 0.035,
    rotationSpeed: 0.004,
    realRadius: "2,439 km",
    gravity: "3.70 m/s²",
    temp: "440 K",
    desc: "Smallest terrestrial planet, heavily cratered with high density iron core.",
    atm: [{ name: "Oxygen", val: 42 }, { name: "Sodium", val: 29 }]
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    tagClass: "tag-planet",
    color: 0xe3bb76,
    radius: 3.8,
    distance: 80,
    orbitSpeed: 0.018,
    rotationSpeed: -0.002,
    realRadius: "6,051 km",
    gravity: "8.87 m/s²",
    temp: "737 K",
    desc: "Runaway greenhouse world with super-dense CO2 atmosphere and sulfuric acid cloud belts.",
    atm: [{ name: "Carbon Dioxide", val: 96.5 }, { name: "Nitrogen", val: 3.5 }]
  },

  // Earth & Luna
  {
    id: "earth",
    name: "Earth (Terra)",
    type: "planet",
    tagClass: "tag-planet",
    color: 0x2277ff,
    radius: 4.2,
    distance: 120,
    orbitSpeed: 0.012,
    rotationSpeed: 0.015,
    realRadius: "6,371 km",
    gravity: "9.81 m/s²",
    temp: "288 K",
    desc: "Habitable ocean planet with protective liquid oceans, active plate tectonics, and magnetosphere.",
    atm: [{ name: "Nitrogen", val: 78 }, { name: "Oxygen", val: 21 }],
    moons: [
      { id: "moon", name: "The Moon (Luna)", radius: 1.1, distance: 9, orbitSpeed: 0.04, color: 0xcccccc, realRadius: "1,737 km", gravity: "1.62 m/s²", temp: "250 K", desc: "Tidally locked natural satellite featuring lunar maria basins and impact highlands." }
    ]
  },

  // Mars & Moons
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    tagClass: "tag-planet",
    color: 0xcc4422,
    radius: 3.2,
    distance: 165,
    orbitSpeed: 0.009,
    rotationSpeed: 0.014,
    realRadius: "3,389 km",
    gravity: "3.72 m/s²",
    temp: "210 K",
    desc: "Red planet containing iron oxide dust, ancient dry river valleys, polar ice caps, and Olympus Mons.",
    atm: [{ name: "Carbon Dioxide", val: 95 }, { name: "Nitrogen", val: 2.8 }],
    moons: [
      { id: "phobos", name: "Phobos", radius: 0.5, distance: 6, orbitSpeed: 0.07, color: 0x776655, realRadius: "11.2 km", gravity: "0.0057 m/s²", temp: "233 K", desc: "Irregularly shaped moon doomed to spiral into Mars or break into a ring." },
      { id: "deimos", name: "Deimos", radius: 0.4, distance: 9, orbitSpeed: 0.04, color: 0x887766, realRadius: "6.2 km", gravity: "0.003 m/s²", temp: "233 K", desc: "Outermost small Martian satellite covered in smooth regolith dust layer." }
    ]
  },

  // Jupiter & Galilean Moons
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    tagClass: "tag-planet",
    color: 0xd4a373,
    radius: 11.5,
    distance: 260,
    orbitSpeed: 0.005,
    rotationSpeed: 0.032,
    realRadius: "69,911 km",
    gravity: "24.79 m/s²",
    temp: "165 K",
    desc: "Gas monarch with powerful magnetic field, thermal radiation emissions, and Great Red Spot storm.",
    atm: [{ name: "Hydrogen", val: 90 }, { name: "Helium", val: 10 }],
    moons: [
      { id: "io", name: "Io", radius: 1.0, distance: 16, orbitSpeed: 0.06, color: 0xe6cb43, realRadius: "1,821 km", gravity: "1.79 m/s²", temp: "130 K", desc: "Most volcanically active body in solar system due to extreme tidal flex heating." },
      { id: "europa", name: "Europa", radius: 0.95, distance: 22, orbitSpeed: 0.045, color: 0xb5d4e8, realRadius: "1,560 km", gravity: "1.31 m/s²", temp: "102 K", desc: "Smooth ice crust covering a global subsurface liquid water ocean." },
      { id: "ganymede", name: "Ganymede", radius: 1.3, distance: 28, orbitSpeed: 0.03, color: 0x9e9185, realRadius: "2,634 km", gravity: "1.42 m/s²", temp: "110 K", desc: "Largest moon in solar system, larger than Mercury, possessing its own magnetic field." },
      { id: "callisto", name: "Callisto", radius: 1.2, distance: 35, orbitSpeed: 0.02, color: 0x6e665e, realRadius: "2,410 km", gravity: "1.23 m/s²", temp: "134 K", desc: "Ancient heavily cratered ice-rock moon with low tidal friction." }
    ]
  },

  // Saturn & Moons
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    tagClass: "tag-planet",
    color: 0xf4e2bb,
    hasRings: true,
    radius: 9.8,
    distance: 350,
    orbitSpeed: 0.003,
    rotationSpeed: 0.028,
    realRadius: "58,232 km",
    gravity: "10.44 m/s²",
    temp: "134 K",
    desc: "Ringed gas giant featuring extensive ringlets of water ice and complex satellite system.",
    atm: [{ name: "Hydrogen", val: 96 }, { name: "Helium", val: 3 }],
    moons: [
      { id: "titan", name: "Titan", radius: 1.3, distance: 20, orbitSpeed: 0.035, color: 0xe0a040, realRadius: "2,574 km", gravity: "1.35 m/s²", temp: "94 K", desc: "Only moon with dense atmosphere and liquid hydrocarbon seas (methane/ethane)." },
      { id: "enceladus", name: "Enceladus", radius: 0.6, distance: 13, orbitSpeed: 0.05, color: 0xffffff, realRadius: "252 km", gravity: "0.11 m/s²", temp: "75 K", desc: "Bright icy moon exhibiting cryovolcanic plumes spraying water vapor into space." },
      { id: "mimas", name: "Mimas", radius: 0.5, distance: 10, orbitSpeed: 0.07, color: 0xaaaaaa, realRadius: "198 km", gravity: "0.06 m/s²", temp: "64 K", desc: "Icy moon dominated by the giant Herschel impact crater." },
      { id: "iapetus", name: "Iapetus", radius: 0.7, distance: 27, orbitSpeed: 0.02, color: 0x443322, realRadius: "734 km", gravity: "0.22 m/s²", temp: "110 K", desc: "Two-toned moon with dark leading hemisphere and bright trailing hemisphere." }
    ]
  },

  // Uranus & Neptune
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    tagClass: "tag-planet",
    color: 0x72c7d9,
    radius: 7.0,
    distance: 440,
    orbitSpeed: 0.002,
    rotationSpeed: -0.02,
    realRadius: "25,362 km",
    gravity: "8.69 m/s²",
    temp: "76 K",
    desc: "Ice giant with extreme axial tilt of 97.8 degrees, orbiting Sol on its side.",
    atm: [{ name: "Hydrogen", val: 83 }, { name: "Helium", val: 15 }],
    moons: [
      { id: "titania", name: "Titania", radius: 0.8, distance: 14, orbitSpeed: 0.04, color: 0xa0a8b0, realRadius: "788 km", gravity: "0.38 m/s²", temp: "70 K", desc: "Largest Uranian moon with rift valleys and fault scarps." },
      { id: "miranda", name: "Miranda", radius: 0.5, distance: 9, orbitSpeed: 0.06, color: 0xcccccc, realRadius: "235 km", gravity: "0.08 m/s²", temp: "60 K", desc: "Extreme jumbled terrain with Verona Rupes, 20 km deep cliff face." }
    ]
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    tagClass: "tag-planet",
    color: 0x2e59d9,
    radius: 6.8,
    distance: 520,
    orbitSpeed: 0.0015,
    rotationSpeed: 0.022,
    realRadius: "24,622 km",
    gravity: "11.15 m/s²",
    temp: "72 K",
    desc: "Deep blue ice giant experiencing extreme supersonic winds up to 2,100 km/h.",
    atm: [{ name: "Hydrogen", val: 80 }, { name: "Helium", val: 19 }],
    moons: [
      { id: "triton", name: "Triton", radius: 0.9, distance: 13, orbitSpeed: -0.04, color: 0xd9e5eb, realRadius: "1,353 km", gravity: "0.78 m/s²", temp: "38 K", desc: "Retrograde orbiting moon featuring nitrogen ice geysers and melon-skin terrain." }
    ]
  },
  {
    id: "pluto",
    name: "Pluto & Charon",
    type: "planet",
    tagClass: "tag-planet",
    color: 0xc4a482,
    radius: 2.0,
    distance: 590,
    orbitSpeed: 0.001,
    rotationSpeed: 0.005,
    realRadius: "1,188 km",
    gravity: "0.62 m/s²",
    temp: "44 K",
    desc: "Dwarf planet in Kuiper Belt with heart-shaped nitrogen ice plain Tombaugh Regio.",
    atm: [{ name: "Nitrogen", val: 99 }, { name: "Methane", val: 0.5 }],
    moons: [
      { id: "charon", name: "Charon", radius: 0.8, distance: 7, orbitSpeed: 0.03, color: 0x8c7c6c, realRadius: "606 km", gravity: "0.28 m/s²", temp: "50 K", desc: "Mutually tidally locked binary companion with reddish tholin north pole." }
    ]
  },

  // --- BLACK HOLES & PULSARS & ANOMALIES ---
  {
    id: "sagittarius_a",
    name: "Sagittarius A*",
    type: "singularity",
    tagClass: "tag-singularity",
    color: 0x000000,
    isBlackHole: true,
    radius: 16.0,
    distance: 720,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.08,
    realRadius: "12.0M km (Horizon)",
    gravity: "Singularity (Infinite)",
    temp: "10^12 K (Accretion)",
    desc: "Supermassive Black Hole at the Galactic Core (4.15M solar masses) driving relativistic gravitational lensing.",
    atm: [{ name: "Plasma Infall", val: 99 }, { name: "Hawking Flux", val: 1 }]
  },
  {
    id: "cygnus_x1",
    name: "Cygnus X-1 Binary",
    type: "singularity",
    tagClass: "tag-singularity",
    color: 0x000000,
    isBinaryBlackHole: true,
    radius: 10.0,
    distance: 820,
    orbitSpeed: 0.0003,
    rotationSpeed: 0.12,
    realRadius: "30 km (Horizon)",
    gravity: "21.2 Solar Masses",
    temp: "10^7 K (X-Ray)",
    desc: "Stellar-mass black hole continuously siphoning stellar material from a companion Blue Supergiant star.",
    atm: [{ name: "Siphoned Gas", val: 95 }, { name: "X-Ray Jets", val: 5 }]
  },
  {
    id: "crab_pulsar",
    name: "Crab Nebula Pulsar",
    type: "pulsar",
    tagClass: "tag-pulsar",
    color: 0x00f3ff,
    isPulsar: true,
    radius: 8.0,
    distance: 920,
    orbitSpeed: 0.0002,
    rotationSpeed: 0.25,
    realRadius: "20 km (Neutron Star)",
    gravity: "1.4 Solar Masses",
    temp: "1,000,000 K",
    desc: "Ultra-dense spinning Neutron Star rotating 30 times per second, shooting energetic magnetic gamma-ray beams.",
    atm: [{ name: "Neutron Degeneracy", val: 99 }, { name: "Relativistic Beams", val: 1 }]
  },
  {
    id: "halleys_comet",
    name: "1P/Halley Comet",
    type: "comet",
    tagClass: "tag-comet",
    color: 0xaaddff,
    isComet: true,
    radius: 1.8,
    distance: 300,
    orbitSpeed: 0.015,
    rotationSpeed: 0.02,
    realRadius: "11 x 8 km",
    gravity: "0.001 m/s²",
    temp: "200 K",
    desc: "Periodic comet exhibiting dynamic sublimation gas and dust tails streaming away from Sol.",
    atm: [{ name: "Water Vapor", val: 80 }, { name: "CO / CO2", val: 15 }]
  }
];
