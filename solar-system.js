/* ============================================================
   SOLAR SYSTEM: Full Rewrite with Proper Surface Landing
   State machine: SPACE → FLYING → DESCENDING → SURFACE → LAUNCHING
   ============================================================ */

// ══════════════════════════════════════════════════════════════
//  GAME STATE MACHINE
// ══════════════════════════════════════════════════════════════
const GS = { SPACE: 'space', FLYING: 'flying', DESCENDING: 'descending', SURFACE: 'surface', LAUNCHING: 'launching' };
let gameState = GS.SPACE;

// Current planet context
let currentPlanet = null;   // planet data object
let planetCenter = new THREE.Vector3();
let planetRadius = 1;

// Physics (all measured along surface normal = "up" direction)
let jumpVel = 0;           // velocity away from surface (+ = up)
let descentVel = 0;        // velocity toward surface during descent

// ══════════════════════════════════════════════════════════════
//  PLANET DATA
// ══════════════════════════════════════════════════════════════
const PLANETS = {
    mercury: {
        name: 'Mercury', gravity: 3.7, color: '#b5b5b5', radius: 0.38, distance: 12, speed: 4.74,
        fact: 'Temperatures swing 600°C between day and night — the most extreme range of any planet.',
        temperature: '-180°C to 430°C', dayLength: '59 Earth days', moons: 0, distanceSun: '0.39 AU',
        atmosphere: 'Trace sodium', atmosphereComp: [{ label: 'Na', pct: 29 }, { label: 'O₂', pct: 22 }, { label: 'H₂', pct: 22 }, { label: 'He', pct: 27 }],
        skyColor: '#0d0805', fogColor: '#120a06', fogDensity: 0.005,
        surfaceType: 'barren', danger: '☢️ Extreme temp swings & radiation',
        particleColor: '#888888', particleCount: 0,
        // Gameplay feel: low gravity = very floaty jump
        jumpStrength: 5.0, walkSpeed: 3.5
    },
    venus: {
        name: 'Venus', gravity: 8.87, color: '#e8cda0', radius: 0.95, distance: 20, speed: 3.50,
        fact: 'Venus spins backwards and its day is longer than its year.',
        temperature: '462°C (constant)', dayLength: '243 Earth days', moons: 0, distanceSun: '0.72 AU',
        atmosphere: 'CO₂ + H₂SO₄', atmosphereComp: [{ label: 'CO₂', pct: 96 }, { label: 'N₂', pct: 3.5 }, { label: 'SO₂', pct: 0.5 }],
        skyColor: '#cc5500', fogColor: '#aa4400', fogDensity: 0.07,
        surfaceType: 'volcanic', danger: '🌋 Crushing pressure & acid rain',
        particleColor: '#ff8800', particleCount: 70,
        jumpStrength: 4.0, walkSpeed: 3.0
    },
    earth: {
        name: 'Earth', gravity: 9.81, color: '#4b9cd3', radius: 1.0, distance: 30, speed: 2.98,
        fact: 'Earth is the only planet known to host liquid water on its surface.',
        temperature: '-88°C to 58°C', dayLength: '24 hours', moons: 1, distanceSun: '1.0 AU',
        atmosphere: 'N₂/O₂ breathable', atmosphereComp: [{ label: 'N₂', pct: 78 }, { label: 'O₂', pct: 21 }, { label: 'Ar', pct: 1 }],
        skyColor: '#1a6fb5', fogColor: '#3a8fcc', fogDensity: 0.018,
        surfaceType: 'lush', danger: '🌍 Home sweet home — enjoy the walk!',
        particleColor: '#aaccff', particleCount: 25,
        jumpStrength: 4.0, walkSpeed: 4.0
    },
    mars: {
        name: 'Mars', gravity: 3.72, color: '#c1440e', radius: 0.53, distance: 42, speed: 2.41,
        fact: 'Olympus Mons is the tallest volcano in the solar system — 3× the height of Everest.',
        temperature: '-125°C to 20°C', dayLength: '24h 37m', moons: 2, distanceSun: '1.52 AU',
        atmosphere: 'Thin CO₂', atmosphereComp: [{ label: 'CO₂', pct: 95 }, { label: 'N₂', pct: 3 }, { label: 'Ar', pct: 2 }],
        skyColor: '#c0500a', fogColor: '#9a3e08', fogDensity: 0.035,
        surfaceType: 'dusty', danger: '🌪 Dust storms & thin toxic air',
        particleColor: '#cc6633', particleCount: 110,
        jumpStrength: 5.0, walkSpeed: 3.5
    },
    jupiter: {
        name: 'Jupiter', gravity: 24.8, color: '#c88b3a', radius: 3.5, distance: 65, speed: 1.31,
        fact: 'Jupiter\'s Great Red Spot is a storm that has raged for at least 350 years.',
        temperature: '-108°C (cloud)', dayLength: '9h 56m', moons: 95, distanceSun: '5.2 AU',
        atmosphere: 'H₂/He gas giant', atmosphereComp: [{ label: 'H₂', pct: 90 }, { label: 'He', pct: 10 }],
        skyColor: '#4a3010', fogColor: '#6a4818', fogDensity: 0.09,
        surfaceType: 'gaseous', danger: '⚡ Lightning storms & 600 km/h winds',
        particleColor: '#d4a060', particleCount: 180,
        jumpStrength: 2.0, walkSpeed: 2.5   // heavy gravity — very hard to jump
    },
    saturn: {
        name: 'Saturn', gravity: 10.4, color: '#e0c56e', radius: 2.9, distance: 95, speed: 0.97,
        fact: 'Saturn is less dense than water — it would float in a giant ocean.',
        temperature: '-178°C (cloud)', dayLength: '10h 42m', moons: 146, distanceSun: '9.58 AU',
        atmosphere: 'H₂/He + ammonia', atmosphereComp: [{ label: 'H₂', pct: 96 }, { label: 'He', pct: 3 }, { label: 'CH₄', pct: 1 }],
        skyColor: '#3d3010', fogColor: '#5a4818', fogDensity: 0.065,
        surfaceType: 'gaseous', danger: '🪐 Rings overhead — ice & rock shards',
        particleColor: '#e0c56e', particleCount: 130,
        jumpStrength: 3.5, walkSpeed: 3.0
    },
    uranus: {
        name: 'Uranus', gravity: 8.69, color: '#7de8e8', radius: 2.0, distance: 125, speed: 0.68,
        fact: 'Uranus rolls around the sun on its side — its axial tilt is 97.8°.',
        temperature: '-224°C (min)', dayLength: '17h 14m', moons: 27, distanceSun: '19.2 AU',
        atmosphere: 'H₂/He/methane', atmosphereComp: [{ label: 'H₂', pct: 83 }, { label: 'He', pct: 15 }, { label: 'CH₄', pct: 2 }],
        skyColor: '#082828', fogColor: '#0a3535', fogDensity: 0.05,
        surfaceType: 'icy', danger: '❄ Coldest atmosphere — -224°C',
        particleColor: '#aaffff', particleCount: 90,
        jumpStrength: 4.0, walkSpeed: 3.0
    },
    neptune: {
        name: 'Neptune', gravity: 11.2, color: '#3f54ba', radius: 1.9, distance: 155, speed: 0.54,
        fact: 'Neptune has the fastest winds in the solar system — over 2,100 km/h.',
        temperature: '-214°C', dayLength: '16h 6m', moons: 16, distanceSun: '30.1 AU',
        atmosphere: 'H₂/He/methane', atmosphereComp: [{ label: 'H₂', pct: 80 }, { label: 'He', pct: 19 }, { label: 'CH₄', pct: 1 }],
        skyColor: '#04102e', fogColor: '#081840', fogDensity: 0.058,
        surfaceType: 'icy', danger: '🌀 Strongest winds in solar system',
        particleColor: '#6688ff', particleCount: 130,
        jumpStrength: 3.5, walkSpeed: 3.0
    }
};

// ══════════════════════════════════════════════════════════════
//  ORBIT / VISUAL COMPONENTS (unchanged)
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('orbit', {
    schema: { radius: { type: 'number', default: 10 }, speed: { type: 'number', default: 1 }, tilt: { type: 'number', default: 0 } },
    init() { this.angle = Math.random() * Math.PI * 2; },
    tick(t, dt) {
        this.angle += this.data.speed * 0.0003 * dt * 0.016;
        const r = this.data.radius, tilt = this.data.tilt * Math.PI / 180;
        this.el.object3D.position.set(
            Math.cos(this.angle) * r, Math.sin(this.angle) * r * Math.sin(tilt), Math.sin(this.angle) * r);
    }
});
AFRAME.registerComponent('self-rotate', {
    schema: { speed: { type: 'number', default: 1 } },
    tick(t, dt) { this.el.object3D.rotation.y += this.data.speed * 0.0005 * dt; }
});
AFRAME.registerComponent('planet-ring', {
    schema: { innerRadius: { type: 'number', default: 4 }, outerRadius: { type: 'number', default: 7 }, color: { type: 'string', default: '#c8a96e' } },
    init() {
        const m = new THREE.Mesh(
            new THREE.RingGeometry(this.data.innerRadius, this.data.outerRadius, 64),
            new THREE.MeshBasicMaterial({ color: this.data.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
        m.rotation.x = Math.PI / 2.5;
        this.el.object3D.add(m);
    }
});
AFRAME.registerComponent('starfield', {
    schema: { count: { type: 'number', default: 3000 } },
    init() {
        const pos = [], col = [], hues = [[1, 1, 1], [1, .9, .8], [.8, .9, 1], [1, 1, .9]];
        for (let i = 0; i < this.data.count; i++) {
            const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 400 + Math.random() * 200;
            pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
            const c = hues[Math.floor(Math.random() * hues.length)]; col.push(...c);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        this.el.sceneEl.object3D.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: .55, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: .9 })));
    }
});
AFRAME.registerComponent('asteroid-belt', {
    schema: { innerRadius: { type: 'number', default: 50 }, outerRadius: { type: 'number', default: 60 }, count: { type: 'number', default: 300 } },
    init() {
        const sc = this.el.sceneEl.object3D, { innerRadius: ir, outerRadius: or, count } = this.data;
        for (let i = 0; i < count; i++) {
            const r = ir + Math.random() * (or - ir), a = Math.random() * Math.PI * 2, s = .1 + Math.random() * .5;
            const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), new THREE.MeshLambertMaterial({ color: '#888' }));
            m.position.set(Math.cos(a) * r, (Math.random() - .5) * 3, Math.sin(a) * r);
            m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sc.add(m);
        }
    }
});

// ══════════════════════════════════════════════════════════════
//  SURFACE PARTICLES
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('surface-particles', {
    schema: { count: { type: 'number', default: 60 }, color: { type: 'string', default: '#fff' }, planetRadius: { type: 'number', default: 1 }, speed: { type: 'number', default: 1 } },
    init() {
        const pos = [], vel = [], r = this.data.planetRadius * 1.1;
        for (let i = 0; i < this.data.count; i++) {
            const th = Math.random() * Math.PI * 2, ph = (Math.random() - .5) * Math.PI;
            pos.push(r * Math.cos(ph) * Math.cos(th), r * Math.cos(ph) * Math.sin(th), r * Math.sin(ph));
            const spd = 0.02 * this.data.speed;
            vel.push((Math.random() - .5) * spd, (Math.random() - .5) * spd, (Math.random() - .5) * spd);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        this._vel = vel; this._pos = geo.attributes.position; this._r = r;
        const mat = new THREE.PointsMaterial({ color: this.data.color, size: .06, transparent: true, opacity: .65, sizeAttenuation: true });
        this._pts = new THREE.Points(geo, mat);
        this.el.object3D.add(this._pts);
    },
    tick() {
        if (gameState !== GS.SURFACE) return;
        for (let i = 0; i < this._pos.count; i++) {
            const i3 = i * 3;
            this._pos.array[i3] += this._vel[i3]; this._pos.array[i3 + 1] += this._vel[i3 + 1]; this._pos.array[i3 + 2] += this._vel[i3 + 2];
            const len = Math.sqrt(this._pos.array[i3] ** 2 + this._pos.array[i3 + 1] ** 2 + this._pos.array[i3 + 2] ** 2);
            const sc = this._r / len;
            this._pos.array[i3] *= sc; this._pos.array[i3 + 1] *= sc; this._pos.array[i3 + 2] *= sc;
        }
        this._pos.needsUpdate = true;
    },
    remove() { this.el.object3D.remove(this._pts); }
});
let surfaceParticleEl = null;
function spawnParticles(p, center, r) {
    if (surfaceParticleEl) { surfaceParticleEl.remove(); surfaceParticleEl = null; }
    if (!p.particleCount) return;
    surfaceParticleEl = document.createElement('a-entity');
    surfaceParticleEl.setAttribute('position', `${center.x} ${center.y} ${center.z}`);
    surfaceParticleEl.setAttribute('surface-particles',
        `count:${p.particleCount}; color:${p.particleColor}; planetRadius:${r}; speed:${p.windSpeed || 1}`);
    document.querySelector('a-scene').appendChild(surfaceParticleEl);
}

// ══════════════════════════════════════════════════════════════
//  SUN PULSE
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('sun-pulse', {
    init() {
        this.el.addEventListener('click', () => {
            if (gameState !== GS.SPACE) return;
            showPanel('☀️ The Sun', '274 m/s²', 'The Sun contains 99.86% of all mass in the solar system.');
        });
    },
    tick(t) { const s = 1 + .025 * Math.sin(t * .001); this.el.object3D.scale.set(s, s, s); }
});

// ══════════════════════════════════════════════════════════════
//  TRAVEL-TO COMPONENT → clicks trigger landing on a planet
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('travel-to', {
    schema: { planet: { type: 'string', default: '' }, radius: { type: 'number', default: 1 } },
    init() {
        this.el.addEventListener('click', () => {
            if (gameState !== GS.SPACE) return;
            const pd = PLANETS[this.data.planet]; if (!pd) return;
            const target = this.el.object3D.getWorldPosition(new THREE.Vector3());
            _startFlight(this.data.planet, pd, target, this.data.radius);
        });
        this.el.addEventListener('mouseenter', () => {
            if (gameState !== GS.SPACE) return;
            const n = PLANETS[this.data.planet]?.name || '';
            this.el.setAttribute('scale', '1.12 1.12 1.12');
            setHint(`Click to travel to ${n}`);
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('scale', '1 1 1'); hideHint();
        });
    }
});

// ══════════════════════════════════════════════════════════════
//  VR CONTROLLER — thumbstick and buttons
// ══════════════════════════════════════════════════════════════
window.vrLeftStick = { x: 0, y: 0 };
window.vrRightStick = { x: 0, y: 0 };

AFRAME.registerComponent('vr-controller', {
    schema: { hand: { type: 'string', default: '' } },
    init() {
        this.el.addEventListener('thumbstickmoved', e => {
            if (this.data.hand === 'left') {
                window.vrLeftStick.x = e.detail.x;
                window.vrLeftStick.y = e.detail.y;
            } else {
                window.vrRightStick.x = e.detail.x;
                window.vrRightStick.y = e.detail.y;
            }
        });

        const jump = () => {
            if (gameState === GS.SURFACE) {
                const jStr = currentPlanet ? currentPlanet.jumpStrength : 4;
                jumpVel = Math.max(jumpVel, jStr);
            }
        };
        this.el.addEventListener('abuttondown', jump);
        this.el.addEventListener('xbuttondown', jump);

        const launch = () => {
            if (gameState === GS.SURFACE || gameState === GS.DESCENDING) {
                window.launchToSpace();
            } else if (gameState === GS.SPACE) {
                window.returnToOverview();
            }
        };
        this.el.addEventListener('bbuttondown', launch);
        this.el.addEventListener('ybuttondown', launch);
    }
});

// ══════════════════════════════════════════════════════════════
//  PLANET CONTROLLER — one component handles all phases
//  Replaces: gravity-controller + surface-walker (two old components)
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('planet-controller', {
    init() {
        this.keys = {};
        this._kd = e => { this.keys[e.code] = true; this._onKey(e.code, true); };
        this._ku = e => { this.keys[e.code] = false; };
        window.addEventListener('keydown', this._kd);
        window.addEventListener('keyup', this._ku);
        this.cam = null;
    },
    remove() {
        window.removeEventListener('keydown', this._kd);
        window.removeEventListener('keyup', this._ku);
    },
    _onKey(code, down) {
        if (!down) return;
        if (code === 'Space' && gameState === GS.SURFACE) {
            // Jump! strength inversely scaled with gravity
            const jStr = currentPlanet ? currentPlanet.jumpStrength : 4;
            jumpVel = jStr;
        }
    },
    tick(t, dt) {
        if (!this.cam) this.cam = document.getElementById('cam');
        const rig = this.el.object3D;

        // ── DESCENDING PHASE ───────────────────────────────────────
        if (gameState === GS.DESCENDING) {
            const playerPos = new THREE.Vector3();
            rig.getWorldPosition(playerPos);
            const toCenter = planetCenter.clone().sub(playerPos);
            const dist = toCenter.length();
            const eyeHeight = 1.7;
            const surfaceDist = planetRadius + eyeHeight;

            if (dist > surfaceDist + 0.08) {
                // Accelerate toward surface
                descentVel = Math.min(descentVel + 20 * (dt / 1000), 18);
                rig.position.addScaledVector(toCenter.normalize(), descentVel * (dt / 1000));
            } else {
                // Touchdown!
                descentVel = 0;
                _touchdown();
            }
            return;
        }

        // ── SURFACE PHASE ──────────────────────────────────────────
        if (gameState === GS.SURFACE) {
            const playerPos = new THREE.Vector3();
            rig.getWorldPosition(playerPos);

            // Surface normal = "up" from planet surface
            const normal = playerPos.clone().sub(planetCenter).normalize();

            // Apply jump / gravity physics along normal
            const g = (currentPlanet ? currentPlanet.gravity : 9.81) * 0.04;
            jumpVel -= g * dt; // gravity pulls down (reduces jump velocity)

            // Clamp falling speed
            if (jumpVel < -12) jumpVel = -12;

            if (jumpVel !== 0) {
                rig.position.addScaledVector(normal, jumpVel * (dt / 1000) * 20);
            }

            // Re-read position after physics
            rig.getWorldPosition(playerPos);
            const eyeHeight = 1.7;
            const dist = playerPos.distanceTo(planetCenter);
            const surfaceDist = planetRadius + eyeHeight;

            // Ground clamping
            if (dist <= surfaceDist) {
                jumpVel = Math.max(jumpVel, 0);
                const groundPos = planetCenter.clone().add(
                    playerPos.clone().sub(planetCenter).normalize().multiplyScalar(surfaceDist));
                rig.position.copy(groundPos);
            }

            // ── WASD SURFACE WALKING ──────────────────────────────────
            const speed = (currentPlanet ? currentPlanet.walkSpeed : 3.5) * (dt / 1000);
            const camDir = new THREE.Vector3();
            this.cam.object3D.getWorldDirection(camDir);
            // Project forward onto tangent plane
            const forward = camDir.clone().sub(normal.clone().multiplyScalar(camDir.dot(normal))).normalize();
            const right = new THREE.Vector3().crossVectors(forward, normal).normalize();

            let mx = 0, mz = 0;
            if (this.keys['KeyW'] || this.keys['ArrowUp']) mz -= 1;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) mz += 1;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx -= 1;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) mx += 1;

            if (window.vrLeftStick) {
                if (Math.abs(window.vrLeftStick.x) > 0.1) mx += window.vrLeftStick.x;
                if (Math.abs(window.vrLeftStick.y) > 0.1) mz += window.vrLeftStick.y;
            }

            if (mx !== 0 || mz !== 0) {
                // Normalize magnitude so diagonals/thumbsticks aren't artificially faster
                const len = Math.sqrt(mx * mx + mz * mz);
                if (len > 1) { mx /= len; mz /= len; }

                rig.position.add(forward.clone().multiplyScalar(-mz * speed)
                    .add(right.clone().multiplyScalar(mx * speed)));
                // Re-lock height after lateral move
                rig.getWorldPosition(playerPos);
                const d2 = playerPos.distanceTo(planetCenter);
                if (Math.abs(d2 - surfaceDist) > 0.05) {
                    const snap = planetCenter.clone().add(playerPos.clone().sub(planetCenter).normalize().multiplyScalar(surfaceDist));
                    rig.position.copy(snap);
                }
            }

            // ── UPDATE GRAVITY INDICATOR ──────────────────────────────
            _updateGravityMeter();
        }
    }
});

// ══════════════════════════════════════════════════════════════
//  PICKUP COMPONENT
// ══════════════════════════════════════════════════════════════
AFRAME.registerComponent('pickup', {
    init() {
        this.held = false; this.airborne = false; this.throwVel = null;
        this.el.addEventListener('click', () => { this.held ? this.drop() : this.pickup(); });
        this.el.addEventListener('mouseenter', () => { if (gameState === GS.SURFACE) setHint('Click to pick up'); });
        this.el.addEventListener('mouseleave', () => { if (!this.held) hideHint(); });
    },
    pickup() {
        this.held = true; this.airborne = false; this.throwVel = null;
        this.cam = document.getElementById('cam');
        setHint('Click again to throw!');
    },
    drop() {
        this.held = false; hideHint();
        const dir = new THREE.Vector3();
        this.cam.object3D.getWorldDirection(dir);
        this.throwVel = dir.multiplyScalar(10 + (currentPlanet?.gravity ? (9.81 / currentPlanet.gravity) * 4 : 4));
        this.airborne = true;
    },
    tick(t, dt) {
        const sec = dt / 1000;
        if (this.held && this.cam) {
            const cp = new THREE.Vector3(), cd = new THREE.Vector3();
            this.cam.object3D.getWorldPosition(cp);
            this.cam.object3D.getWorldDirection(cd);
            this.el.object3D.position.lerp(cp.clone().addScaledVector(cd, 2.2).sub(new THREE.Vector3(0, .4, 0)), .25);
        } else if (this.airborne && this.throwVel) {
            this.el.object3D.position.add(this.throwVel.clone().multiplyScalar(sec));
            if (gameState === GS.SURFACE && currentPlanet) {
                const pos = new THREE.Vector3();
                this.el.object3D.getWorldPosition(pos);
                const g = currentPlanet.gravity * 0.04;
                this.throwVel.addScaledVector(pos.clone().sub(planetCenter).normalize().negate(), g * sec * 20);
                if (pos.distanceTo(planetCenter) <= planetRadius + .3) { this.airborne = false; this.throwVel = null; }
            }
        }
    }
});

// ══════════════════════════════════════════════════════════════
//  LANDING BEACON
// ══════════════════════════════════════════════════════════════
let beaconEl = null;
function spawnBeacon(pc, pr, color) {
    if (beaconEl) { if (beaconEl.parentNode) beaconEl.parentNode.removeChild(beaconEl); beaconEl = null; }
    const scene = document.querySelector('a-scene');
    const rig = document.getElementById('rig');
    const playerPos = new THREE.Vector3();
    rig.object3D.getWorldPosition(playerPos);
    const dir = playerPos.clone().sub(pc).normalize();
    const pos = pc.clone().add(dir.clone().multiplyScalar(pr + .02));

    beaconEl = document.createElement('a-entity');
    beaconEl.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);

    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    beaconEl.setAttribute('rotation', `${THREE.MathUtils.radToDeg(euler.x)} ${THREE.MathUtils.radToDeg(euler.y)} ${THREE.MathUtils.radToDeg(euler.z)}`);

    beaconEl.innerHTML = `
    <a-cylinder height=".4" radius=".012" color="#fff" position="0 .2 0"></a-cylinder>
    <a-box width=".16" height=".09" depth=".01" color="${color}" position=".08 .42 0" material="emissive:${color};emissiveIntensity:.5"></a-box>
    <a-torus radius=".22" radius-tubular=".012" segments-radial="32" color="${color}" position="0 .02 0" material="emissive:${color};emissiveIntensity:.6;opacity:.7;transparent:true"></a-torus>`;
    scene.appendChild(beaconEl);
}

// ══════════════════════════════════════════════════════════════
//  ATMOSPHERE ENGINE
// ══════════════════════════════════════════════════════════════
function setAtmosphere(fogColor, fogDensity) {
    document.getElementById('scene').setAttribute('fog', `type:exponential;color:${fogColor};density:${fogDensity}`);
}
function resetAtmosphere() { setAtmosphere('#000010', .0012); }

// ══════════════════════════════════════════════════════════════
//  FLIGHT + LANDING SEQUENCE
// ══════════════════════════════════════════════════════════════
function _startFlight(id, pd, target, radius) {
    gameState = GS.FLYING;
    currentPlanet = pd; planetCenter.copy(target); planetRadius = radius;
    jumpVel = 0; descentVel = 0;

    // Disable free flight movement
    const rig = document.getElementById('rig');
    try { rig.removeAttribute('movement-controls'); } catch (e) { }

    // Show warp overlay
    _showOverlay('travel-overlay');

    // Fly to just above the planet
    const orbitDist = radius * 4 + 3;
    const camPos = new THREE.Vector3();
    rig.object3D.getWorldPosition(camPos);
    const dirToPlayer = camPos.clone().sub(target).normalize();
    const orbitPos = target.clone().add(dirToPlayer.clone().multiplyScalar(orbitDist));

    smoothTravel(rig, orbitPos, 2200, 'easeInOut', () => {
        _hideOverlay('travel-overlay');
        // Now begin descent
        gameState = GS.DESCENDING;
        setAtmosphere(pd.fogColor, pd.fogDensity);
        showLandingApproach(pd.name);
    });
}

function _touchdown() {
    gameState = GS.SURFACE;
    const pd = currentPlanet;
    if (!pd) return;

    // Flash effect
    const f = document.getElementById('landing-flash'); if (f) { f.style.opacity = '.9'; setTimeout(() => f.style.opacity = '0', 600); }

    // Spawn beacon + particles
    spawnBeacon(planetCenter, planetRadius, pd.color);
    spawnParticles(pd, planetCenter, planetRadius);

    // Surface HUD
    showSurfaceHUD(pd);
    hideLandingApproach();

    // Update controls legend
    document.getElementById('controls-legend').style.display = 'none';
    document.getElementById('surface-controls-legend').style.display = 'block';
}

// ══════════════════════════════════════════════════════════════
//  LAUNCH BACK TO SPACE
// ══════════════════════════════════════════════════════════════
window.launchToSpace = function () {
    if (gameState !== GS.SURFACE) return;
    gameState = GS.LAUNCHING;
    hideSurfaceHUD();
    _showOverlay('launch-overlay');

    const rig = document.getElementById('rig');
    const playerPos = new THREE.Vector3();
    rig.object3D.getWorldPosition(playerPos);
    const launchDir = playerPos.clone().sub(planetCenter).normalize();
    const launchDest = planetCenter.clone().add(launchDir.clone().multiplyScalar(planetRadius + 55));

    smoothTravel(rig, launchDest, 2800, 'easeIn', () => {
        _hideOverlay('launch-overlay');
        gameState = GS.SPACE;
        currentPlanet = null;
        jumpVel = 0; descentVel = 0;

        // Re-enable free flight
        rig.setAttribute('movement-controls', 'fly:true;speed:0.15;constrainToNavMesh:false');
        resetAtmosphere();
        if (surfaceParticleEl) { surfaceParticleEl.remove(); surfaceParticleEl = null; }
        if (beaconEl && beaconEl.parentNode) { beaconEl.parentNode.removeChild(beaconEl); beaconEl = null; }

        document.getElementById('controls-legend').style.display = 'block';
        document.getElementById('surface-controls-legend').style.display = 'none';
        setHint('Back in space — click a planet to explore!');
        setTimeout(hideHint, 3000);
    });
};

window.returnToOverview = function () {
    if (gameState === GS.SURFACE || gameState === GS.DESCENDING) { window.launchToSpace(); return; }
    if (gameState !== GS.SPACE) return;
    const rig = document.getElementById('rig');
    smoothTravel(rig, { x: 0, y: 20, z: 60 }, 2000, 'easeInOut');
    document.getElementById('hud-panel').style.display = 'none';
};
window.closeHUD = function () { document.getElementById('hud-panel').style.display = 'none'; };

// ══════════════════════════════════════════════════════════════
//  SMOOTH TRAVEL HELPER
// ══════════════════════════════════════════════════════════════
function smoothTravel(rigEl, dest, dur, easingName, onDone) {
    const s = { x: rigEl.object3D.position.x, y: rigEl.object3D.position.y, z: rigEl.object3D.position.z };
    const d = { x: dest.x || 0, y: dest.y || 0, z: dest.z || 0 };
    const t0 = performance.now();
    const ease = { easeInOut: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t, easeIn: t => t * t * t }[easingName] || (t => t);
    function frame(now) {
        const t = Math.min((now - t0) / dur, 1), e = ease(t);
        rigEl.object3D.position.set(s.x + (d.x - s.x) * e, s.y + (d.y - s.y) * e, s.z + (d.z - s.z) * e);
        if (t < 1) requestAnimationFrame(frame); else if (onDone) onDone();
    }
    requestAnimationFrame(frame);
}

// ══════════════════════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════════════════════
function setHint(t) { const h = document.getElementById('travel-hint'); h.textContent = t; h.style.display = 'block'; }
function hideHint() { document.getElementById('travel-hint').style.display = 'none'; }
function _showOverlay(id) { const o = document.getElementById(id); if (o) { o.style.display = 'flex'; o.style.opacity = '1'; } }
function _hideOverlay(id) { const o = document.getElementById(id); if (o) { o.style.opacity = '0'; setTimeout(() => o.style.display = 'none', 400); } }

function showLandingApproach(name) {
    const el = document.getElementById('landing-approach');
    if (el) { el.style.display = 'flex'; document.getElementById('la-name').textContent = name.toUpperCase(); }
}
function hideLandingApproach() { const el = document.getElementById('landing-approach'); if (el) el.style.display = 'none'; }

function showPanel(planet, grav, fact) {
    document.getElementById('hud-panel').style.display = 'flex';
    document.getElementById('hud-planet').textContent = planet;
    document.getElementById('hud-gravity').textContent = 'Gravity: ' + grav;
    document.getElementById('hud-fact').textContent = fact;
}

// ── SURFACE HUD ───────────────────────────────────────────────
function showSurfaceHUD(pd) {
    const panel = document.getElementById('surface-panel');
    if (!panel) return;

    document.getElementById('sp-name').textContent = pd.name;
    document.getElementById('sp-gravity').textContent = `${pd.gravity} m/s²`;
    document.getElementById('sp-temp').textContent = pd.temperature;
    document.getElementById('sp-day').textContent = pd.dayLength;
    document.getElementById('sp-moons').textContent = pd.moons;
    document.getElementById('sp-dist').textContent = pd.distanceSun;
    document.getElementById('sp-atm').textContent = pd.atmosphere;
    document.getElementById('sp-danger').textContent = pd.danger;
    document.getElementById('sp-fact').textContent = pd.fact;

    // Atmosphere bars
    const barsEl = document.getElementById('sp-atm-bars');
    barsEl.innerHTML = (pd.atmosphereComp || []).map(c => `
    <div class="atm-bar-row">
      <span class="atm-label">${c.label}</span>
      <div class="atm-bar-track"><div class="atm-bar-fill" style="width:${c.pct}%"></div></div>
      <span class="atm-pct">${c.pct}%</span>
    </div>`).join('');

    // Surface type badge
    const icons = { barren: '🪨', volcanic: '🌋', lush: '🌿', dusty: '🏜️', gaseous: '☁️', icy: '❄️' };
    const badge = document.getElementById('sp-surface-type');
    if (badge) badge.textContent = `${icons[pd.surfaceType] || '🪐'} ${pd.surfaceType.toUpperCase()} SURFACE`;

    // Gravity feel hint
    const tip = document.getElementById('sp-gravity-tip');
    if (tip) {
        if (pd.gravity < 4) tip.textContent = '⬆ Very low gravity — jumps will send you flying!';
        else if (pd.gravity > 20) tip.textContent = '⬇ Crushing gravity — jumping is nearly impossible.';
        else if (pd.gravity < 6) tip.textContent = '☝ Low gravity — jumps carry you far and slow.';
        else tip.textContent = '🚶 Press SPACE to jump and feel the gravity!';
    }

    // Accent colour
    panel.style.setProperty('--accent', pd.color);
    panel.style.display = 'flex';
}
function hideSurfaceHUD() { const p = document.getElementById('surface-panel'); if (p) p.style.display = 'none'; }

// ── GRAVITY METER (live, updates while on surface) ────────────
function _updateGravityMeter() {
    // Show height above ground (fun metric to experience)
    const rig = document.getElementById('rig');
    if (!rig) return;
    const pos = new THREE.Vector3();
    rig.object3D.getWorldPosition(pos);
    const height = Math.max(0, pos.distanceTo(planetCenter) - planetRadius - 1.7);
    const meter = document.getElementById('sp-height');
    if (meter) meter.textContent = `${height.toFixed(1)} m above surface`;
}
