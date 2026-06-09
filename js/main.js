// ══════════════════════════════════════════════════
//  PARTICLES BACKGROUND
// ══════════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.opacity = Math.random() * 0.35 + 0.05;
      this.color = Math.random() > 0.5 ? '#e8637a' : '#c9a96e';
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.018;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 55; i++) particles.push(new P());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════
function pad(n) { return String(n).padStart(2, '0'); }

function showPhase(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  from.classList.add('fade-out');
  setTimeout(() => {
    from.classList.add('hidden');
    from.classList.remove('fade-out');
    to.classList.remove('hidden');
    to.classList.add('fade-in');
    to.addEventListener('animationend', () => to.classList.remove('fade-in'), { once: true });
  }, 800);
}

function fireConfetti(onDone) {
  const colors = ['#f9a8d4','#fda4af','#fb7185','#fde8ec','#ffffff','#e8637a'];
  confetti({ particleCount: 180, spread: 130, origin: { y: 0.4 }, colors, startVelocity: 55 });
  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60, spread: 90, origin: { x: 0 }, colors });
    confetti({ particleCount: 80, angle: 120, spread: 90, origin: { x: 1 }, colors });
  }, 300);
  const end = Date.now() + 4200;
  const rain = setInterval(() => {
    if (Date.now() > end) { clearInterval(rain); if (onDone) onDone(); return; }
    confetti({ particleCount: 8, angle: Math.random()*60+60, spread: 55, origin: { x: Math.random(), y: -0.05 }, gravity: 0.9, colors });
  }, 70);
}

// ══════════════════════════════════════════════════
//  FASE 1 — CUENTA REGRESIVA
// ══════════════════════════════════════════════════
(function(){
  // ← CAMBIA ESTA FECHA al cumpleaños real:
  const TARGET = new Date('2026-06-09T18:00:00');
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };
  const zeroMsg = document.getElementById('zero-msg');
  const countdown = document.getElementById('countdown');
  let triggered = false;
  let prev = {};

  function animateFlip(el, newVal) {
    if (el.textContent === newVal) return;
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = newVal;
      el.classList.remove('flip');
    }, 220);
  }

  function tick() {
    const now  = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      countdown.style.display = 'none';
      zeroMsg.style.display = 'block';
      if (!triggered) {
        triggered = true;
        fireConfetti(() => {
          setTimeout(() => {
            showPhase('phase1', 'phase2');
            initGallery();
          }, 1200);
        });
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    animateFlip(els.days,  pad(d));
    animateFlip(els.hours, pad(h));
    animateFlip(els.mins,  pad(m));
    animateFlip(els.secs,  pad(s));
  }

  tick();
  setInterval(tick, 1000);
})();

// ══════════════════════════════════════════════════
//  FASE 2 — GALERÍA BENTO
// ══════════════════════════════════════════════════
function initGallery() {
  const cells = [
    { type: 'quote',     size: 'tall',   icon: '✦', text: 'Desde el primer momento supe que eras tú.' },
    { type: 'photo',     size: 'normal', src: 'photos/foto1.jpg' },
    { type: 'photo',     size: 'normal', src: 'photos/foto2.jpg' },
    { type: 'quote',     size: 'wide',   icon: '♡', text: 'Cada día contigo es mi día favorito.' },
    { type: 'photo',     size: 'normal', src: 'photos/foto3.jpg' },
    { type: 'anecdote',  size: 'normal', label: 'Lo que más me gusta', text: 'Esa risa tuya, cuando algo te parece genuinamente gracioso. Me derrito.' },
    { type: 'photo',     size: 'tall',   src: 'photos/foto4.jpg' },
    { type: 'quote',     size: 'normal', icon: '🎂', text: 'Felices 20, amor.' },
    { type: 'photo',     size: 'normal', src: 'photos/foto5.jpg' },
    { type: 'anecdote',  size: 'wide',   label: 'Mi recuerdo favorito', text: 'Hay momentos que se quedan grabados para siempre. Tú eres uno de ellos.' },
    { type: 'photo',     size: 'normal', src: 'photos/foto6.jpg' },
    { type: 'quote',     size: 'normal', icon: '✿', text: 'Eres con quien quiero compartir todo.' },
  ];

  const grid = document.getElementById('bento-grid');
  grid.innerHTML = '';

  cells.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'bento-cell ' + (c.size !== 'normal' ? c.size : '');
    div.style.transitionDelay = (i * 0.06) + 's';

    if (c.type === 'photo') {
      const img = document.createElement('img');
      img.className = 'cell-photo';
      img.src = c.src;
      img.alt = '';
      img.onerror = function() {
        this.style.display = 'none';
        const ph = document.createElement('div');
        ph.className = 'cell-photo-placeholder';
        ph.textContent = '📷';
        div.appendChild(ph);
      };
      div.appendChild(img);
    } else if (c.type === 'quote') {
      div.innerHTML = `<div class="cell-quote">
        <span class="q-icon">${c.icon}</span>
        <p class="q-text">"${c.text}"</p>
      </div>`;
    } else {
      div.innerHTML = `<div class="cell-anecdote">
        <p class="anec-label">${c.label}</p>
        <p class="anec-text">${c.text}</p>
      </div>`;
    }

    grid.appendChild(div);
  });

  // Scroll reveal
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.bento-cell').forEach(el => obs.observe(el));

  // Pequeño confetti al llegar a la galería
  const galleryObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.4 }, colors: ['#e8637a','#f4a0b0','#c9a96e'] });
      galleryObs.disconnect();
    }
  }, { threshold: 0.4 });
  galleryObs.observe(document.getElementById('phase2'));
}

// Botón fase 2 → 3
document.getElementById('go-phase3').addEventListener('click', () => {
  showPhase('phase2', 'phase3');
});

// ══════════════════════════════════════════════════
//  FASE 3 — CANDADO + THREE.JS
// ══════════════════════════════════════════════════
(function(){
  const input      = document.getElementById('p3-input');
  const btn        = document.getElementById('p3-unlock-btn');
  const lockWrap   = document.getElementById('lock-wrap');
  const p3Title    = document.getElementById('p3-title');
  const p3Desc     = document.getElementById('p3-desc');
  const threeWrap  = document.getElementById('three-container');
  const sceneTitle = document.getElementById('scene-title');
  let petName = '';

  function unlock() {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    petName = name;

    // Animar candado
    lockWrap.classList.add('unlocked');
    p3Title.textContent = `¡Bienvenido a la familia, ${name}! 🎉`;
    p3Desc.style.display = 'none';
    input.style.display = 'none';
    btn.disabled = true;

    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 }, colors: ['#f9a8d4','#fda4af','#fb7185','#fff'] });

    setTimeout(() => {
      // Fade out lock, fade in 3D
      lockWrap.style.transition = 'opacity 0.7s';
      lockWrap.style.opacity = '0';
      setTimeout(() => {
        lockWrap.style.display = 'none';
        sceneTitle.innerHTML = `¡Bienvenido a la familia,<br><em>${petName}</em>! 🎉`;
        threeWrap.classList.add('visible');
        initThree();
      }, 700);
    }, 1400);
  }

  btn.addEventListener('click', unlock);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });

  // ─── THREE.JS SCENE ───
  function initThree() {
    const container = document.getElementById('three-canvas-wrap');
    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.6, 5.5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const pinkLight = new THREE.PointLight(0xf9a8d4, 2.5, 20);
    pinkLight.position.set(3, 4, 3);
    scene.add(pinkLight);
    const fillLight = new THREE.PointLight(0xfda4af, 0.6, 20);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // ─── PINGÜINO PLACEHOLDER ─────────────────────
    // Reemplaza con:
    // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    // loader.load('/model/pinguino.glb', gltf => scene.add(gltf.scene))
    const group = new THREE.Group();

    const roseMat   = new THREE.MeshStandardMaterial({ color: 0xf9a8d4, roughness: 0.6 });
    const lightMat  = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.5 });
    const darkMat   = new THREE.MeshStandardMaterial({ color: 0x1a1018 });
    const beakMat   = new THREE.MeshStandardMaterial({ color: 0xfb923c });
    const redMat    = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const blueMat   = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });

    function makeCapsuleLike(radius, length, radialSegments, material) {
      if (THREE.CapsuleGeometry) {
        return new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, radialSegments), material);
      }
      // Fallback para versiones como r128 sin CapsuleGeometry
      return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, Math.max(8, radialSegments || 12)), material);
    }

    // Cuerpo
    const body = makeCapsuleLike(0.45, 0.9, 16, roseMat);
    body.position.y = 0;
    group.add(body);

    // Cabeza
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), roseMat);
    head.position.y = 0.9;
    group.add(head);

    // Panza blanca
    const belly = makeCapsuleLike(0.28, 0.55, 12, lightMat);
    belly.position.set(0, 0.05, 0.3);
    group.add(belly);

    // Ojos
    [-0.14, 0.14].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), darkMat);
      eye.position.set(x, 1.02, 0.3);
      group.add(eye);
    });

    // Pico
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 8), beakMat);
    beak.position.set(0, 0.88, 0.38);
    beak.rotation.x = 0.3;
    group.add(beak);

    // Aletas
    [-0.55, 0.55].forEach((x, i) => {
      const wing = makeCapsuleLike(0.1, 0.45, 8, new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.6 }));
      wing.position.set(x, 0.1, 0);
      wing.rotation.z = i === 0 ? 0.5 : -0.5;
      group.add(wing);
    });

    // Pies
    [-0.2, 0.2].forEach(x => {
      const foot = makeCapsuleLike(0.1, 0.25, 8, beakMat);
      foot.position.set(x, -0.85, 0.15);
      foot.rotation.x = 0.3;
      group.add(foot);
    });

    // Boina venezolana
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.15, 24), redMat);
    hatBase.position.set(0, 1.25, 0);
    hatBase.rotation.x = 0.15;
    group.add(hatBase);

    const hatTop = new THREE.Mesh(new THREE.CircleGeometry(0.3, 24), blueMat);
    hatTop.position.set(0, 1.33, 0);
    hatTop.rotation.x = -Math.PI / 2 + 0.15;
    group.add(hatTop);

    // Intentar cargar modelo GLB (sustituye el placeholder)
    let modelRoot = group; // fallback

    function finalize() {
      // OrbitControls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = (2 * Math.PI) / 3;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.update();

      // Float animation
      let floatT = 0;
      const BASE_Y = modelRoot.position.y || 0;

      function animate() {
        requestAnimationFrame(animate);
        floatT += 0.016;
        modelRoot.position.y = BASE_Y + Math.sin(floatT * 1.2) * 0.12;
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // Resize
      window.addEventListener('resize', () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      });
    }

    // Si GLTFLoader está disponible, intenta cargar el GLB
    if (THREE && THREE.GLTFLoader) {
      try {
        const loader = new THREE.GLTFLoader();
        loader.load('model/pinguino.glb', (gltf) => {
          modelRoot = gltf.scene;
          // Ajustes base para GLB desproporcionados o descentrados
          modelRoot.scale.set(1.5, 1.5, 1.5);
          modelRoot.position.set(0, -0.5, 0);
          scene.add(modelRoot);
          finalize();
        }, undefined, (err) => {
          console.warn('GLTF load failed, using placeholder:', err);
          scene.add(modelRoot);
          finalize();
        });
      } catch (e) {
        console.warn('Error initializing GLTFLoader, using placeholder.', e);
        scene.add(modelRoot);
        finalize();
      }
    } else {
      // loader not available — use placeholder
      console.warn('THREE.GLTFLoader not found — using placeholder model.');
      scene.add(modelRoot);
      finalize();
    }
  }
})();
