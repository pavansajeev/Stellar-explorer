/* ============================================================
   SOLAR SYSTEM – Custom A-Frame Components
   ============================================================ */

// ── PLANETS DATA ──────────────────────────────────────────────
const PLANETS = {
  mercury: { name: 'Mercury', gravity: 3.7,  color: '#b5b5b5', radius: 0.38, distance: 12,  speed: 4.74,  fact: 'A year on Mercury is just 88 Earth days.' },
  venus:   { name: 'Venus',   gravity: 8.87, color: '#e8cda0', radius: 0.95, distance: 20,  speed: 3.50,  fact: 'Venus spins backwards compared to most planets.' },
  earth:   { name: 'Earth',   gravity: 9.81, color: '#4b9cd3', radius: 1.00, distance: 30,  speed: 2.98,  fact: 'Earth is the only known planet with life.' },
  mars:    { name: 'Mars',    gravity: 3.72, color: '#c1440e', radius: 0.53, distance: 42,  speed: 2.41,  fact: 'Mars has the tallest volcano in the solar system.' },
  jupiter: { name: 'Jupiter', gravity: 24.8, color: '#c88b3a', radius: 3.50, distance: 65,  speed: 1.31,  fact: 'Jupiter\'s Great Red Spot is a storm older than 350 years.' },
  saturn:  { name: 'Saturn',  gravity: 10.4, color: '#e0c56e', radius: 2.90, distance: 95,  speed: 0.97,  fact: 'Saturn\'s rings are made of ice and rock.' },
  uranus:  { name: 'Uranus',  gravity: 8.69, color: '#7de8e8', radius: 2.00, distance: 125, speed: 0.68,  fact: 'Uranus rotates on its side at 98 degrees.' },
  neptune: { name: 'Neptune', gravity: 11.2, color: '#3f54ba', radius: 1.90, distance: 155, speed: 0.54,  fact: 'Neptune has the strongest winds in the solar system.' }
};

// ── ORBIT COMPONENT ───────────────────────────────────────────
AFRAME.registerComponent('orbit', {
  schema: {
    radius:  { type: 'number', default: 10 },
    speed:   { type: 'number', default: 1 },
    tilt:    { type: 'number', default: 0 }
  },
  init() {
    this.angle = Math.random() * Math.PI * 2;
  },
  tick(time, delta) {
    const { radius, speed, tilt } = this.data;
    this.angle += (speed * 0.0003 * delta * 0.016);
    const x = Math.cos(this.angle) * radius;
    const z = Math.sin(this.angle) * radius;
    const y = Math.sin(this.angle) * radius * Math.sin(tilt * Math.PI / 180);
    this.el.object3D.position.set(x, y, z);
  }
});

// ── SELF ROTATION COMPONENT ────────────────────────────────────
AFRAME.registerComponent('self-rotate', {
  schema: { speed: { type: 'number', default: 1 } },
  tick(time, delta) {
    this.el.object3D.rotation.y += this.data.speed * 0.0005 * delta;
  }
});

// ── TRAVEL-TO COMPONENT ───────────────────────────────────────
AFRAME.registerComponent('travel-to', {
  schema: {
    planet: { type: 'string', default: '' },
    radius: { type: 'number', default: 1 }
  },
  init() {
    this.el.addEventListener('click', () => {
      const planetId = this.data.planet;
      const planetData = PLANETS[planetId];
      if (!planetData) return;

      // Show HUD
      document.getElementById('hud-panel').style.display = 'flex';
      document.getElementById('hud-planet').textContent = planetData.name;
      document.getElementById('hud-gravity').textContent = `Gravity: ${planetData.gravity} m/s²`;
      document.getElementById('hud-fact').textContent = planetData.fact;

      // Travel camera to planet
      const camera = document.getElementById('rig');
      const target = this.el.object3D.getWorldPosition(new THREE.Vector3());
      const offset = this.data.radius * 3.5 + 2;
      const destX = target.x + offset;
      const destY = target.y + offset * 0.4;
      const destZ = target.z + offset;

      // Animate via a-animation trick
      gravityTarget.position.copy(target);
      gravityTarget.radius = this.data.radius;
      gravityState.active = true;
      gravityState.gravity = planetData.gravity;

      // Smooth lerp travel
      startTravel(camera, { x: destX, y: destY, z: destZ });

      // Broadcast event
      this.el.sceneEl.emit('planet-visited', { planet: planetId, data: planetData });
    });

    // Hover glow
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('scale', '1.12 1.12 1.12');
      document.getElementById('crosshair').style.opacity = '1';
      document.getElementById('travel-hint').style.display = 'block';
      document.getElementById('travel-hint').textContent = `Click to travel to ${PLANETS[this.data.planet]?.name || ''}`;
    });
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('scale', '1 1 1');
      document.getElementById('crosshair').style.opacity = '0.5';
      document.getElementById('travel-hint').style.display = 'none';
    });
  }
});

// ── SUN PULSE COMPONENT ────────────────────────────────────────
AFRAME.registerComponent('sun-pulse', {
  init() {
    this.t = 0;
    this.baseScale = 1;
    this.el.addEventListener('click', () => {
      document.getElementById('hud-panel').style.display = 'flex';
      document.getElementById('hud-planet').textContent = '☀️ The Sun';
      document.getElementById('hud-gravity').textContent = 'Gravity: 274 m/s²';
      document.getElementById('hud-fact').textContent = 'The Sun contains 99.86% of the mass in our solar system.';
      gravityState.active = false;
    });
  },
  tick(time) {
    const s = 1 + 0.025 * Math.sin(time * 0.001);
    this.el.object3D.scale.set(s, s, s);
  }
});

// ── GRAVITY STATE (shared global) ─────────────────────────────
const gravityTarget = new THREE.Vector3();
gravityTarget.radius = 1;
const gravityState = { active: false, gravity: 9.81, velocity: 0 };

// ── GRAVITY CONTROLLER ────────────────────────────────────────
AFRAME.registerComponent('gravity-controller', {
  init() {
    this.velocity = new THREE.Vector3();
    this.onGround = false;
    this.grounded = false;
    gravityState.velocity = 0;
  },
  tick(time, delta) {
    if (!gravityState.active) return;
    const dt = delta / 1000;
    const rig = this.el.object3D;
    const camWorldPos = new THREE.Vector3();
    rig.getWorldPosition(camWorldPos);

    const toCenter = gravityTarget.clone().sub(camWorldPos);
    const dist = toCenter.length();
    const surface = gravityTarget.radius + 1.7; // eye height

    if (dist < gravityTarget.radius + 30) {
      // We're in the gravity well
      const g = gravityState.gravity * 0.05; // scale down for playability
      if (dist > surface) {
        gravityState.velocity += g * dt * 20;
        if (gravityState.velocity > 15) gravityState.velocity = 15;
        const dir = toCenter.normalize();
        rig.position.addScaledVector(dir, gravityState.velocity * dt * 2);
      } else {
        // On the ground
        gravityState.velocity = 0;
        // Push to surface
        const snapDir = toCenter.normalize();
        const snapPos = gravityTarget.clone().add(snapDir.clone().negate().multiplyScalar(surface));
        rig.position.lerp(snapPos, 0.3);
      }
    }
  }
});

// ── PICKUP COMPONENT ─────────────────────────────────────────
AFRAME.registerComponent('pickup', {
  init() {
    this.held = false;
    this.velocity = new THREE.Vector3();
    this.prevPos = new THREE.Vector3();
    this.camera = null;

    this.el.addEventListener('click', () => {
      if (!this.held) {
        this.pickup();
      } else {
        this.drop();
      }
    });
  },

  pickup() {
    this.held = true;
    this.camera = document.querySelector('#cam');
    this.el.setAttribute('class', 'held');
    this.el.removeAttribute('dynamic-body');
    document.getElementById('travel-hint').textContent = 'Click again to throw!';
    document.getElementById('travel-hint').style.display = 'block';
  },

  drop() {
    this.held = false;
    this.el.classList.remove('held');
    document.getElementById('travel-hint').style.display = 'none';

    // Give throw velocity
    if (this.camera) {
      const dir = new THREE.Vector3();
      this.camera.object3D.getWorldDirection(dir);
      this.throwVel = dir.multiplyScalar(15);
      this.airborne = true;
      this.fallVel = 0;
    }
  },

  tick(time, delta) {
    const dt = delta / 1000;
    if (this.held && this.camera) {
      // Float in front of camera
      const camPos = new THREE.Vector3();
      const camDir = new THREE.Vector3();
      this.camera.object3D.getWorldPosition(camPos);
      this.camera.object3D.getWorldDirection(camDir);
      const target = camPos.clone().addScaledVector(camDir, 2.5);
      target.y -= 0.5;
      this.el.object3D.position.lerp(target, 0.3);
    } else if (this.airborne && this.throwVel) {
      // Apply gravity to thrown object
      const g = gravityState.active ? gravityState.gravity * 0.04 : 5;
      this.el.object3D.position.add(this.throwVel.clone().multiplyScalar(dt));

      if (gravityState.active) {
        // Pull toward planet center
        const pos = new THREE.Vector3();
        this.el.object3D.getWorldPosition(pos);
        const toPlanet = gravityTarget.clone().sub(pos).normalize();
        this.throwVel.addScaledVector(toPlanet, g * dt * 20);
      } else {
        this.throwVel.y -= g * dt * 20;
      }

      // Check ground
      if (gravityState.active) {
        const pos = new THREE.Vector3();
        this.el.object3D.getWorldPosition(pos);
        const dist = gravityTarget.distanceTo(pos);
        if (dist <= gravityTarget.radius + 0.4) {
          this.airborne = false;
          this.throwVel = null;
        }
      }
    }
  }
});

// ── STAR FIELD COMPONENT ─────────────────────────────────────
AFRAME.registerComponent('starfield', {
  schema: { count: { type: 'number', default: 3000 } },
  init() {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const starColors = [
      [1, 1, 1], [1, 0.9, 0.8], [0.8, 0.9, 1], [1, 1, 0.9]
    ];
    for (let i = 0; i < this.data.count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 400 + Math.random() * 200;
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const c = starColors[Math.floor(Math.random() * starColors.length)];
      colors.push(...c);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95
    });
    const stars = new THREE.Points(geo, mat);
    this.el.sceneEl.object3D.add(stars);
  }
});

// ── RING COMPONENT ────────────────────────────────────────────
AFRAME.registerComponent('planet-ring', {
  schema: {
    innerRadius: { type: 'number', default: 4 },
    outerRadius: { type: 'number', default: 7 },
    color: { type: 'string', default: '#c8a96e' }
  },
  init() {
    const geo = new THREE.RingGeometry(this.data.innerRadius, this.data.outerRadius, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: this.data.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2.5;
    this.el.object3D.add(ring);
  }
});

// ── ASTEROID BELT COMPONENT ────────────────────────────────────
AFRAME.registerComponent('asteroid-belt', {
  schema: {
    innerRadius: { type: 'number', default: 50 },
    outerRadius: { type: 'number', default: 60 },
    count: { type: 'number', default: 300 }
  },
  init() {
    const scene = this.el.sceneEl.object3D;
    const { innerRadius, outerRadius, count } = this.data;
    for (let i = 0; i < count; i++) {
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 3;
      const size = 0.1 + Math.random() * 0.5;
      const geo = new THREE.DodecahedronGeometry(size, 0);
      const mat = new THREE.MeshLambertMaterial({ color: '#888' });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
    }
  }
});

// ── SMOOTH TRAVEL HELPER ──────────────────────────────────────
function startTravel(rigEl, dest) {
  const start = {
    x: rigEl.object3D.position.x,
    y: rigEl.object3D.position.y,
    z: rigEl.object3D.position.z
  };
  const duration = 2200;
  const startTime = performance.now();

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  document.getElementById('travel-overlay').style.opacity = '1';
  document.getElementById('travel-overlay').style.display = 'flex';

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const t = easeInOut(progress);

    rigEl.object3D.position.set(
      start.x + (dest.x - start.x) * t,
      start.y + (dest.y - start.y) * t,
      start.z + (dest.z - start.z) * t
    );

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      document.getElementById('travel-overlay').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('travel-overlay').style.display = 'none';
      }, 400);
    }
  }
  requestAnimationFrame(animate);
}

// ── CLOSE HUD ───────────────────────────────────────────────--
window.closeHUD = function() {
  document.getElementById('hud-panel').style.display = 'none';
};

// ── RETURN TO OVERVIEW ────────────────────────────────────────
window.returnToOverview = function() {
  const rig = document.getElementById('rig');
  gravityState.active = false;
  gravityState.velocity = 0;
  startTravel(rig, { x: 0, y: 20, z: 60 });
  document.getElementById('hud-panel').style.display = 'none';
};
