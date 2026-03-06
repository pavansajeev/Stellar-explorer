/* ============================================================
   SOLAR SYSTEM – All Custom A-Frame Components
   ============================================================ */

// ══════════════════════════════════════════════════════════════
// PLANET DATA  (expanded with surface details)
// ══════════════════════════════════════════════════════════════
const PLANETS = {
    mercury: {
        name: 'Mercury', gravity: 3.7, color: '#b5b5b5', radius: 0.38, distance: 12, speed: 4.74,
        fact: 'A year on Mercury is just 88 Earth days.',
        temperature: '-180°C to 430°C', dayLength: '59 Earth days',
        atmosphere: 'Trace sodium', atmosphereComp: [{ label: 'Na', pct: 29 }, { label: 'O₂', pct: 22 }, { label: 'H₂', pct: 22 }, { label: 'He', pct: 27 }],
        moons: 0, distanceSun: '0.39 AU',
        skyColor: '#0d0805', fogColor: '#0d0805', fogDensity: 0.003,
        surfaceType: 'barren', windSpeed: 0, danger: '☢️ Extreme temperature swings',
        particleColor: '#888888', particleCount: 0
    },
    venus: {
        name: 'Venus', gravity: 8.87, color: '#e8cda0', radius: 0.95, distance: 20, speed: 3.50,
        fact: 'Venus spins backwards — the sun rises in the west.',
        temperature: '462°C (surface)', dayLength: '243 Earth days',
        atmosphere: 'CO₂ + H₂SO₄ clouds', atmosphereComp: [{ label: 'CO₂', pct: 96 }, { label: 'N₂', pct: 3.5 }, { label: 'SO₂', pct: 0.5 }],
        moons: 0, distanceSun: '0.72 AU',
        skyColor: '#ff7700', fogColor: '#cc5500', fogDensity: 0.06,
        surfaceType: 'volcanic', windSpeed: 3, danger: '🌋 Crushing pressure & acid rain',
        particleColor: '#ff8800', particleCount: 80
    },
    earth: {
        name: 'Earth', gravity: 9.81, color: '#4b9cd3', radius: 1.0, distance: 30, speed: 2.98,
        fact: 'The only known planet with liquid water on its surface.',
        temperature: '-88°C to 58°C', dayLength: '24 hours',
        atmosphere: 'N₂/O₂ breathable', atmosphereComp: [{ label: 'N₂', pct: 78 }, { label: 'O₂', pct: 21 }, { label: 'Ar', pct: 1 }],
        moons: 1, distanceSun: '1.0 AU',
        skyColor: '#1a6fb5', fogColor: '#3a8fcc', fogDensity: 0.018,
        surfaceType: 'lush', windSpeed: 1, danger: '🌍 Home sweet home',
        particleColor: '#aaccff', particleCount: 30
    },
    mars: {
        name: 'Mars', gravity: 3.72, color: '#c1440e', radius: 0.53, distance: 42, speed: 2.41,
        fact: 'Olympus Mons on Mars is 3× the height of Everest.',
        temperature: '-125°C to 20°C', dayLength: '24h 37m',
        atmosphere: 'Thin CO₂', atmosphereComp: [{ label: 'CO₂', pct: 95 }, { label: 'N₂', pct: 3 }, { label: 'Ar', pct: 2 }],
        moons: 2, distanceSun: '1.52 AU',
        skyColor: '#c0500a', fogColor: '#a04010', fogDensity: 0.035,
        surfaceType: 'dusty', windSpeed: 2, danger: '🌪 Dust storms can last months',
        particleColor: '#cc6633', particleCount: 120
    },
    jupiter: {
        name: 'Jupiter', gravity: 24.8, color: '#c88b3a', radius: 3.5, distance: 65, speed: 1.31,
        fact: 'You cannot stand on Jupiter — it has no solid surface.',
        temperature: '-108°C (cloud tops)', dayLength: '9h 56m',
        atmosphere: 'H₂/He gas giant', atmosphereComp: [{ label: 'H₂', pct: 90 }, { label: 'He', pct: 10 }],
        moons: 95, distanceSun: '5.2 AU',
        skyColor: '#5c3e15', fogColor: '#7a5520', fogDensity: 0.08,
        surfaceType: 'gaseous', windSpeed: 5, danger: '⚡ Lightning & 600 km/h winds',
        particleColor: '#d4a060', particleCount: 200
    },
    saturn: {
        name: 'Saturn', gravity: 10.4, color: '#e0c56e', radius: 2.9, distance: 95, speed: 0.97,
        fact: 'Saturn is less dense than water — it would float.',
        temperature: '-178°C (cloud tops)', dayLength: '10h 42m',
        atmosphere: 'H₂/He + ammonia', atmosphereComp: [{ label: 'H₂', pct: 96 }, { label: 'He', pct: 3 }, { label: 'CH₄', pct: 1 }],
        moons: 146, distanceSun: '9.58 AU',
        skyColor: '#3d3010', fogColor: '#5a4820', fogDensity: 0.06,
        surfaceType: 'gaseous', windSpeed: 4, danger: '🪐 Rings: ice & rock shards',
        particleColor: '#e0c56e', particleCount: 150
    },
    uranus: {
        name: 'Uranus', gravity: 8.69, color: '#7de8e8', radius: 2.0, distance: 125, speed: 0.68,
        fact: 'Uranus rotates at 98°— it rolls around the sun on its side.',
        temperature: '-224°C (min)', dayLength: '17h 14m',
        atmosphere: 'H₂/He/methane', atmosphereComp: [{ label: 'H₂', pct: 83 }, { label: 'He', pct: 15 }, { label: 'CH₄', pct: 2 }],
        moons: 27, distanceSun: '19.2 AU',
        skyColor: '#0a3030', fogColor: '#0f4040', fogDensity: 0.05,
        surfaceType: 'icy', windSpeed: 4, danger: '❄ -224°C — coldest planet',
        particleColor: '#aaffff', particleCount: 100
    },
    neptune: {
        name: 'Neptune', gravity: 11.2, color: '#3f54ba', radius: 1.9, distance: 155, speed: 0.54,
        fact: 'Neptune has the fastest winds in the solar system — 2,100 km/h.',
        temperature: '-214°C', dayLength: '16h 6m',
        atmosphere: 'H₂/He/methane', atmosphereComp: [{ label: 'H₂', pct: 80 }, { label: 'He', pct: 19 }, { label: 'CH₄', pct: 1 }],
        moons: 16, distanceSun: '30.1 AU',
        skyColor: '#05133a', fogColor: '#0a2060', fogDensity: 0.055,
        surfaceType: 'icy', windSpeed: 5, danger: '🌀 Strongest winds in solar system',
        particleColor: '#6688ff', particleCount: 140
    }
};

// ══════════════════════════════════════════════════════════════
// SHARED SURFACE STATE
// ══════════════════════════════════════════════════════════════
const surfaceState = {
    onSurface: false,
    planetId: null,
    planetData: null
};

const gravityTarget = new THREE.Vector3();
gravityTarget.radius = 1;
const gravityState = { active: false, gravity: 9.81, velocity: 0 };

// ══════════════════════════════════════════════════════════════
// ORBIT COMPONENT
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('orbit', {
    schema: {
        radius: { type: 'number', default: 10 },
        speed: { type: 'number', default: 1 },
        tilt: { type: 'number', default: 0 }
    },
    init() { this.angle = Math.random() * Math.PI * 2; },
    tick(time, delta) {
        const { radius, speed, tilt } = this.data;
        this.angle += speed * 0.0003 * delta * 0.016;
        const x = Math.cos(this.angle) * radius;
        const z = Math.sin(this.angle) * radius;
        const y = Math.sin(this.angle) * radius * Math.sin(tilt * Math.PI / 180);
        this.el.object3D.position.set(x, y, z);
    }
});

// ══════════════════════════════════════════════════════════════
// SELF ROTATION
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('self-rotate', {
    schema: { speed: { type: 'number', default: 1 } },
    tick(time, delta) {
        this.el.object3D.rotation.y += this.data.speed * 0.0005 * delta;
    }
});

// ══════════════════════════════════════════════════════════════
// SUN PULSE
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('sun-pulse', {
    init() {
        this.el.addEventListener('click', () => {
            if (surfaceState.onSurface) return;
            showSunInfo();
        });
    },
    tick(time) {
        const s = 1 + 0.025 * Math.sin(time * 0.001);
        this.el.object3D.scale.set(s, s, s);
    }
});

// ══════════════════════════════════════════════════════════════
// TRAVEL-TO COMPONENT
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('travel-to', {
    schema: {
        planet: { type: 'string', default: '' },
        radius: { type: 'number', default: 1 }
    },
    init() {
        this.el.addEventListener('click', () => {
            if (surfaceState.onSurface) return; // no mid-surface travel
            const planetId = this.data.planet;
            const pData = PLANETS[planetId];
            if (!pData) return;

            // Mark as travelling
            const target = this.el.object3D.getWorldPosition(new THREE.Vector3());
            gravityTarget.copy(target);
            gravityTarget.radius = this.data.radius;
            gravityState.active = true;
            gravityState.gravity = pData.gravity;
            gravityState.velocity = 0;

            const rig = document.getElementById('rig');
            const offset = this.data.radius * 3.5 + 2;
            const dest = {
                x: target.x + offset,
                y: target.y + offset * 0.4,
                z: target.z + offset
            };

            showTravelOverlay();
            startTravel(rig, dest, () => {
                // After arriving, begin landing sequence
                beginLanding(planetId, pData, target, this.data.radius);
            });
        });

        this.el.addEventListener('mouseenter', () => {
            if (surfaceState.onSurface) return;
            const name = PLANETS[this.data.planet]?.name || '';
            this.el.setAttribute('scale', '1.12 1.12 1.12');
            document.getElementById('crosshair').style.opacity = '1';
            setHint(`Click to travel to ${name}`);
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('scale', '1 1 1');
            document.getElementById('crosshair').style.opacity = '0.5';
            hideHint();
        });
    }
});

// ══════════════════════════════════════════════════════════════
// GRAVITY CONTROLLER
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('gravity-controller', {
    init() {
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
        const surface = gravityTarget.radius + 1.7;

        if (dist < gravityTarget.radius + 40) {
            if (dist > surface + 0.15) {
                gravityState.velocity += gravityState.gravity * 0.05 * dt * 20;
                if (gravityState.velocity > 14) gravityState.velocity = 14;
                rig.position.addScaledVector(toCenter.normalize(), gravityState.velocity * dt * 2);
            } else {
                gravityState.velocity = 0;
                const snapDir = toCenter.normalize();
                const snapPos = gravityTarget.clone().add(snapDir.clone().negate().multiplyScalar(surface));
                rig.position.lerp(snapPos, 0.35);
                if (!surfaceState.onSurface) {
                    _triggerTouchdown();
                }
            }
        }
    }
});

// ══════════════════════════════════════════════════════════════
// SURFACE WALKER — tangential WASD movement on the planet curve
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('surface-walker', {
    init() {
        this.keys = {};
        this._onKeyDown = e => { this.keys[e.code] = true; };
        this._onKeyUp = e => { this.keys[e.code] = false; };
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        this.cam = document.getElementById('cam');
    },
    remove() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    },
    tick(time, delta) {
        if (!surfaceState.onSurface || !gravityState.active) return;
        const dt = delta / 1000;
        const speed = 3.5;
        const rig = this.el.object3D;

        // Surface normal = direction from planet centre to player
        const playerPos = new THREE.Vector3();
        rig.getWorldPosition(playerPos);
        const normal = playerPos.clone().sub(gravityTarget).normalize();

        // Camera forward in world space
        const camDir = new THREE.Vector3();
        this.cam.object3D.getWorldDirection(camDir);

        // Project camDir onto the tangent plane
        const forward = camDir.clone().sub(normal.clone().multiplyScalar(camDir.dot(normal))).normalize();
        const right = new THREE.Vector3().crossVectors(forward, normal).normalize();

        let dx = 0, dz = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) dz = -1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) dz = 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx = -1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) dx = 1;

        if (dx !== 0 || dz !== 0) {
            const move = forward.clone().multiplyScalar(-dz * speed * dt)
                .add(right.clone().multiplyScalar(dx * speed * dt));
            rig.position.add(move);
            // Re-lock to surface after moving
            const playerPosNew = new THREE.Vector3();
            rig.getWorldPosition(playerPosNew);
            const toCenter = gravityTarget.clone().sub(playerPosNew);
            const dist = toCenter.length();
            const surface = gravityTarget.radius + 1.7;
            if (Math.abs(dist - surface) > 0.05) {
                const correction = toCenter.normalize().negate().multiplyScalar(surface).add(gravityTarget);
                rig.position.lerp(correction, 0.5);
            }
        }
    }
});

// ══════════════════════════════════════════════════════════════
// SURFACE PARTICLES (wind / dust / snow / rain)
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('surface-particles', {
    schema: {
        count: { type: 'number', default: 60 },
        color: { type: 'string', default: '#ffffff' },
        radius: { type: 'number', default: 4 },
        speed: { type: 'number', default: 1 }
    },
    init() {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const r = this.data.radius;
        for (let i = 0; i < this.data.count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;
            positions.push(
                r * Math.cos(phi) * Math.cos(theta),
                r * Math.cos(phi) * Math.sin(theta),
                r * Math.sin(phi)
            );
            velocities.push(
                (Math.random() - 0.5) * 0.04 * this.data.speed,
                (Math.random() - 0.5) * 0.04 * this.data.speed,
                (Math.random() - 0.5) * 0.04 * this.data.speed
            );
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this._velocities = velocities;
        this._positions = geo.attributes.position;
        const mat = new THREE.PointsMaterial({
            color: this.data.color, size: 0.05, transparent: true, opacity: 0.7, sizeAttenuation: true
        });
        this._points = new THREE.Points(geo, mat);
        this.el.object3D.add(this._points);
    },
    tick() {
        if (!surfaceState.onSurface) return;
        const pos = this._positions;
        const vel = this._velocities;
        const r = this.data.radius;
        for (let i = 0; i < pos.count; i++) {
            const i3 = i * 3;
            pos.array[i3] += vel[i3];
            pos.array[i3 + 1] += vel[i3 + 1];
            pos.array[i3 + 2] += vel[i3 + 2];
            // Wrap to sphere
            const len = Math.sqrt(pos.array[i3] ** 2 + pos.array[i3 + 1] ** 2 + pos.array[i3 + 2] ** 2);
            const scale = r / len;
            pos.array[i3] *= scale;
            pos.array[i3 + 1] *= scale;
            pos.array[i3 + 2] *= scale;
        }
        pos.needsUpdate = true;
    },
    remove() {
        this.el.object3D.remove(this._points);
    }
});

// ══════════════════════════════════════════════════════════════
// PLANET RING
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('planet-ring', {
    schema: {
        innerRadius: { type: 'number', default: 4 },
        outerRadius: { type: 'number', default: 7 },
        color: { type: 'string', default: '#c8a96e' }
    },
    init() {
        const geo = new THREE.RingGeometry(this.data.innerRadius, this.data.outerRadius, 64);
        const mat = new THREE.MeshBasicMaterial({
            color: this.data.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.PI / 2.5;
        this.el.object3D.add(ring);
    }
});

// ══════════════════════════════════════════════════════════════
// STARFIELD
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('starfield', {
    schema: { count: { type: 'number', default: 3000 } },
    init() {
        const geo = new THREE.BufferGeometry();
        const positions = [], colors = [];
        const starHues = [[1, 1, 1], [1, 0.9, 0.8], [0.8, 0.9, 1], [1, 1, 0.9]];
        for (let i = 0; i < this.data.count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 400 + Math.random() * 200;
            positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            const c = starHues[Math.floor(Math.random() * starHues.length)];
            colors.push(...c);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9 });
        this.el.sceneEl.object3D.add(new THREE.Points(geo, mat));
    }
});

// ══════════════════════════════════════════════════════════════
// ASTEROID BELT
// ══════════════════════════════════════════════════════════════
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
            const size = 0.1 + Math.random() * 0.5;
            const geo = new THREE.DodecahedronGeometry(size, 0);
            const mat = new THREE.MeshLambertMaterial({ color: '#888' });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 3, Math.sin(angle) * r);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(mesh);
        }
    }
});

// ══════════════════════════════════════════════════════════════
// PICKUP COMPONENT
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('pickup', {
    init() {
        this.held = false;
        this.airborne = false;
        this.throwVel = null;
        this.camera = null;
        this.el.addEventListener('click', () => {
            if (!this.held) {
                this.pickup();
            } else {
                this.drop();
            }
        });
        this.el.addEventListener('mouseenter', () => {
            if (!surfaceState.onSurface) return;
            setHint('Click to pick up');
        });
        this.el.addEventListener('mouseleave', () => hideHint());
    },
    pickup() {
        this.held = true;
        this.airborne = false;
        this.throwVel = null;
        this.camera = document.querySelector('#cam');
        setHint('Click again to throw!');
    },
    drop() {
        this.held = false;
        hideHint();
        if (this.camera) {
            const dir = new THREE.Vector3();
            this.camera.object3D.getWorldDirection(dir);
            this.throwVel = dir.multiplyScalar(12);
            this.airborne = true;
        }
    },
    tick(time, delta) {
        const dt = delta / 1000;
        if (this.held && this.camera) {
            const camPos = new THREE.Vector3();
            const camDir = new THREE.Vector3();
            this.camera.object3D.getWorldPosition(camPos);
            this.camera.object3D.getWorldDirection(camDir);
            const target = camPos.clone().addScaledVector(camDir, 2.2);
            target.y -= 0.4;
            this.el.object3D.position.lerp(target, 0.25);
        } else if (this.airborne && this.throwVel) {
            this.el.object3D.position.add(this.throwVel.clone().multiplyScalar(dt));
            if (gravityState.active) {
                const pos = new THREE.Vector3();
                this.el.object3D.getWorldPosition(pos);
                const toPlanet = gravityTarget.clone().sub(pos).normalize();
                this.throwVel.addScaledVector(toPlanet, gravityState.gravity * 0.04 * dt * 20);
                const dist = gravityTarget.distanceTo(pos);
                if (dist <= gravityTarget.radius + 0.45) {
                    this.airborne = false; this.throwVel = null;
                }
            }
        }
    }
});

// ══════════════════════════════════════════════════════════════
// SURFACE LANDMARK — landing beacon, spawned on touch-down
// ══════════════════════════════════════════════════════════════
let landingBeacon = null;
function spawnLandingBeacon(planetCenter, planetRadius, color) {
    if (landingBeacon) {
        landingBeacon.parentNode.removeChild(landingBeacon);
        landingBeacon = null;
    }
    const scene = document.querySelector('a-scene');
    const beacon = document.createElement('a-entity');

    // Position beacon at player's touchdown point on planet surface
    const playerPos = new THREE.Vector3();
    document.getElementById('rig').object3D.getWorldPosition(playerPos);
    const dir = playerPos.clone().sub(planetCenter).normalize();
    const beaconPos = planetCenter.clone().add(dir.clone().multiplyScalar(planetRadius + 0.05));

    beacon.setAttribute('position', `${beaconPos.x} ${beaconPos.y} ${beaconPos.z}`);

    // Pole
    const pole = document.createElement('a-cylinder');
    pole.setAttribute('height', '0.4');
    pole.setAttribute('radius', '0.015');
    pole.setAttribute('color', '#ffffff');
    pole.setAttribute('position', '0 0.2 0');
    beacon.appendChild(pole);

    // Flag
    const flag = document.createElement('a-box');
    flag.setAttribute('width', '0.18'); flag.setAttribute('height', '0.1'); flag.setAttribute('depth', '0.01');
    flag.setAttribute('color', color || '#ffcc00');
    flag.setAttribute('position', '0.09 0.42 0');
    beacon.appendChild(flag);

    // Glow ring on ground
    const ring = document.createElement('a-torus');
    ring.setAttribute('radius', '0.25');
    ring.setAttribute('radius-tubular', '0.015');
    ring.setAttribute('segments-radial', '32');
    ring.setAttribute('color', color || '#ffcc00');
    ring.setAttribute('material', `opacity: 0.6; transparent: true; emissive: ${color || '#ffcc00'}; emissiveIntensity: 0.8`);
    ring.setAttribute('position', '0 0.02 0');
    beacon.appendChild(ring);

    // Orient beacon along the surface normal
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    beacon.setAttribute('rotation', `${THREE.MathUtils.radToDeg(euler.x)} ${THREE.MathUtils.radToDeg(euler.y)} ${THREE.MathUtils.radToDeg(euler.z)}`);

    scene.appendChild(beacon);
    landingBeacon = beacon;
}

// ══════════════════════════════════════════════════════════════
// ATMOSPHERE ENGINE — changes fog + fog color on landing/launch
// ══════════════════════════════════════════════════════════════
const spaceAtmosphere = { fogColor: '#000010', fogDensity: 0.0012 };

function setAtmosphere(data) {
    const scene = document.getElementById('scene');
    scene.setAttribute('fog', `type: exponential; color: ${data.fogColor}; density: ${data.fogDensity}`);
    document.body.style.backgroundColor = data.fogColor;
}

function restoreSpaceAtmosphere() {
    setAtmosphere(spaceAtmosphere);
    document.body.style.backgroundColor = '';
}

// ══════════════════════════════════════════════════════════════
// SURFACE PARTICLES — container entity
// ══════════════════════════════════════════════════════════════
let surfaceParticleEl = null;
function spawnSurfaceParticles(pData, planetPos, planetRadius) {
    removeSurfaceParticles();
    if (pData.particleCount === 0) return;
    const scene = document.querySelector('a-scene');
    surfaceParticleEl = document.createElement('a-entity');
    surfaceParticleEl.setAttribute('position', `${planetPos.x} ${planetPos.y} ${planetPos.z}`);
    surfaceParticleEl.setAttribute('surface-particles',
        `count: ${pData.particleCount}; color: ${pData.particleColor}; radius: ${planetRadius * 1.12}; speed: ${pData.windSpeed}`);
    scene.appendChild(surfaceParticleEl);
}
function removeSurfaceParticles() {
    if (surfaceParticleEl) { surfaceParticleEl.parentNode.removeChild(surfaceParticleEl); surfaceParticleEl = null; }
}

// ══════════════════════════════════════════════════════════════
// LANDING SEQUENCE
// ══════════════════════════════════════════════════════════════
function beginLanding(planetId, pData, planetCenter, planetRadius) {
    // Change atmosphere
    setAtmosphere(pData);

    // Spawn particles around the planet
    spawnSurfaceParticles(pData, planetCenter, planetRadius);

    // Show surface HUD after a moment
    setTimeout(() => {
        showSurfaceHUD(planetId, pData);
        spawnLandingBeacon(planetCenter, planetRadius, pData.color);
    }, 800);
}

function _triggerTouchdown() {
    // Called once by gravity-controller when player first hits the surface
    if (!surfaceState.onSurface && surfaceState.planetId) {
        surfaceState.onSurface = true;
        // Enable surface walker, disable movement-controls
        const rig = document.getElementById('rig');
        rig.setAttribute('surface-walker', '');
        try { rig.removeAttribute('movement-controls'); } catch (e) { }
        showLandingFlash();
    }
}

// ══════════════════════════════════════════════════════════════
// LAUNCH BACK TO SPACE
// ══════════════════════════════════════════════════════════════
window.launchToSpace = function () {
    const rig = document.getElementById('rig');
    const planetCenter = gravityTarget.clone();

    // Animate: shoot up from the surface
    const playerPos = new THREE.Vector3();
    rig.object3D.getWorldPosition(playerPos);
    const launchDir = playerPos.clone().sub(planetCenter).normalize();
    const launchDest = planetCenter.clone().add(launchDir.clone().multiplyScalar(gravityTarget.radius + 50));

    showLaunchOverlay();

    const duration = 2800;
    const startTime = performance.now();
    const start = { x: rig.object3D.position.x, y: rig.object3D.position.y, z: rig.object3D.position.z };
    const end = {
        x: launchDest.x + (Math.random() - 0.5) * 5,
        y: launchDest.y + (Math.random() - 0.5) * 5,
        z: launchDest.z + (Math.random() - 0.5) * 5
    };

    function easeIn(t) { return t * t * t; }

    function launchTick(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const e = easeIn(t);
        rig.object3D.position.set(
            start.x + (end.x - start.x) * e,
            start.y + (end.y - start.y) * e,
            start.z + (end.z - start.z) * e
        );
        if (t < 1) {
            requestAnimationFrame(launchTick);
        } else {
            // Done launching — restore space
            gravityState.active = false;
            gravityState.velocity = 0;
            surfaceState.onSurface = false;
            surfaceState.planetId = null;

            rig.removeAttribute('surface-walker');
            rig.setAttribute('movement-controls', 'fly: true; speed: 0.15; constrainToNavMesh: false');

            restoreSpaceAtmosphere();
            removeSurfaceParticles();
            if (landingBeacon) { landingBeacon.parentNode.removeChild(landingBeacon); landingBeacon = null; }

            hideSurfaceHUD();
            hideLaunchOverlay();
            setHint('Welcome back to space!');
            setTimeout(hideHint, 2500);
        }
    }
    requestAnimationFrame(launchTick);
};

// ══════════════════════════════════════════════════════════════
// RETURN TO OVERVIEW (from space before landing)
// ══════════════════════════════════════════════════════════════
window.returnToOverview = function () {
    if (surfaceState.onSurface) {
        window.launchToSpace();
        return;
    }
    const rig = document.getElementById('rig');
    gravityState.active = false;
    gravityState.velocity = 0;
    startTravel(rig, { x: 0, y: 20, z: 60 });
    hideSurfaceHUD();
    document.getElementById('hud-panel').style.display = 'none';
};

// ══════════════════════════════════════════════════════════════
// SMOOTH TRAVEL HELPER
// ══════════════════════════════════════════════════════════════
function startTravel(rigEl, dest, onDone) {
    const start = {
        x: rigEl.object3D.position.x,
        y: rigEl.object3D.position.y,
        z: rigEl.object3D.position.z
    };
    const duration = 2200;
    const startTime = performance.now();
    function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function animate(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const e = easeInOut(t);
        rigEl.object3D.position.set(
            start.x + (dest.x - start.x) * e,
            start.y + (dest.y - start.y) * e,
            start.z + (dest.z - start.z) * e
        );
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            hideTravelOverlay();
            if (onDone) onDone();
        }
    }
    requestAnimationFrame(animate);
}

// ══════════════════════════════════════════════════════════════
// HUD / UI HELPERS
// ══════════════════════════════════════════════════════════════
function setHint(txt) { const h = document.getElementById('travel-hint'); h.textContent = txt; h.style.display = 'block'; }
function hideHint() { document.getElementById('travel-hint').style.display = 'none'; }

function showTravelOverlay() {
    const o = document.getElementById('travel-overlay');
    o.style.display = 'flex'; o.style.opacity = '1';
}
function hideTravelOverlay() {
    const o = document.getElementById('travel-overlay');
    o.style.opacity = '0';
    setTimeout(() => { o.style.display = 'none'; }, 400);
}
function showLaunchOverlay() {
    const o = document.getElementById('launch-overlay');
    if (o) { o.style.display = 'flex'; o.style.opacity = '1'; }
}
function hideLaunchOverlay() {
    const o = document.getElementById('launch-overlay');
    if (o) { o.style.opacity = '0'; setTimeout(() => { o.style.display = 'none'; }, 400); }
}

function showLandingFlash() {
    const f = document.getElementById('landing-flash');
    if (!f) return;
    f.style.opacity = '1';
    setTimeout(() => { f.style.opacity = '0'; }, 800);
}

function showSunInfo() {
    document.getElementById('hud-panel').style.display = 'flex';
    document.getElementById('hud-planet').textContent = '☀️ The Sun';
    document.getElementById('hud-gravity').textContent = 'Gravity: 274 m/s²';
    document.getElementById('hud-fact').textContent = 'The Sun contains 99.86% of all mass in the solar system.';
}
window.closeHUD = function () { document.getElementById('hud-panel').style.display = 'none'; };

// ── SURFACE HUD ──────────────────────────────────────────────
function showSurfaceHUD(planetId, pData) {
    surfaceState.onSurface = true;
    surfaceState.planetId = planetId;
    surfaceState.planetData = pData;

    const panel = document.getElementById('surface-panel');
    if (!panel) return;

    document.getElementById('sp-name').textContent = pData.name;
    document.getElementById('sp-gravity').textContent = `${pData.gravity} m/s²`;
    document.getElementById('sp-temp').textContent = pData.temperature;
    document.getElementById('sp-day').textContent = pData.dayLength;
    document.getElementById('sp-moons').textContent = pData.moons;
    document.getElementById('sp-dist').textContent = pData.distanceSun;
    document.getElementById('sp-atm').textContent = pData.atmosphere;
    document.getElementById('sp-danger').textContent = pData.danger;
    document.getElementById('sp-fact').textContent = pData.fact;

    // Atmosphere composition bars
    const barsEl = document.getElementById('sp-atm-bars');
    barsEl.innerHTML = '';
    (pData.atmosphereComp || []).forEach(c => {
        barsEl.innerHTML += `
      <div class="atm-bar-row">
        <span class="atm-label">${c.label}</span>
        <div class="atm-bar-track"><div class="atm-bar-fill" style="width:${c.pct}%;"></div></div>
        <span class="atm-pct">${c.pct}%</span>
      </div>`;
    });

    // Planet colour accent
    panel.style.setProperty('--accent', pData.color);

    panel.style.display = 'flex';
    panel.style.animation = 'slideIn 0.5s ease';

    // Planet surface type badge
    const badge = document.getElementById('sp-surface-type');
    if (badge) {
        const icons = { barren: '🪨', volcanic: '🌋', lush: '🌿', dusty: '🏜️', gaseous: '☁️', icy: '❄️' };
        badge.textContent = `${icons[pData.surfaceType] || '🪐'} ${pData.surfaceType.toUpperCase()} SURFACE`;
    }

    // Low-gravity tip
    const gravityTip = document.getElementById('sp-gravity-tip');
    if (gravityTip) {
        if (pData.gravity < 4) {
            gravityTip.textContent = '⬆ Low gravity! Objects float further when thrown.';
        } else if (pData.gravity > 15) {
            gravityTip.textContent = '⬇ Extreme gravity! Stay close to the surface.';
        } else {
            gravityTip.textContent = '🚶 Explore the surface freely.';
        }
    }

    // Show surface compass
    startCompassUpdate();
}

function hideSurfaceHUD() {
    const panel = document.getElementById('surface-panel');
    if (panel) panel.style.display = 'none';
    stopCompassUpdate();
}

// ── COMPASS (shows direction to sun from surface) ─────────────
let _compassInterval = null;
function startCompassUpdate() {
    const compass = document.getElementById('sp-compass-arrow');
    if (!compass) return;
    _compassInterval = setInterval(() => {
        const rig = document.getElementById('rig');
        if (!rig) return;
        const pos = new THREE.Vector3();
        rig.object3D.getWorldPosition(pos);
        const toSun = new THREE.Vector3().sub(pos).normalize(); // sun at 0,0,0
        const camDir = new THREE.Vector3();
        document.getElementById('cam').object3D.getWorldDirection(camDir);
        const angle = Math.atan2(toSun.x - camDir.x, toSun.z - camDir.z) * 180 / Math.PI;
        compass.style.transform = `rotate(${angle.toFixed(0)}deg)`;
    }, 200);
}
function stopCompassUpdate() {
    if (_compassInterval) { clearInterval(_compassInterval); _compassInterval = null; }
}
