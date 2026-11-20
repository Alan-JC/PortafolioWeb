/* ============================================================
   viento.js — Túnel de viento F1 minimalista (canvas)

   Flujo potencial real alrededor de un óvalo de Rankine (fuente + sumidero
   + corriente uniforme), con el cursor como cuerpo alargado y aerodinámico.
   Campo de velocidad (U = 1), fuente en (−c, 0) y sumidero en (+c, 0):
     u = 1 + h · [ (x + c)/r₁² − (x − c)/r₂² ]
     v = h · y · [ 1/r₁² − 1/r₂² ]
   Los parámetros c y h se resuelven para que el óvalo tenga semiejes a × b.

   Cómo se ve el viento:
   · Las 14–18 líneas finas son "humo" soltado por el borde izquierdo y
     arrastrado por el flujo: se abre antes del cuerpo (punto de estancamiento),
     se acelera por los costados (Venturi) y se cierra detrás, laminar.
   · Los pulsos de luz (verde Petronas y gris claro) viajan por pistas de aire
     propias, ENTRE las líneas visibles: nunca se dibujan encima de ellas.
   ============================================================ */
const iniciarViento = () => {
  'use strict';

  /* ---------- Ajustes ---------- */
  const CFG = {
    fondo: null,               // null = canvas transparente; '#030303' = canvas opaco
    verde: '4, 191, 173',      // #04BFAD (verde Petronas)
    gris: '146, 154, 160',     // gris técnico (líneas base)
    grisClaro: '205, 212, 216',// gris técnico claro (algunos pulsos)
    intensidad: 1.6,           // visibilidad de todo: 1 = tenue, 2 = marcado
    altoPorLinea: 60,          // px de alto por línea → se limita a 14–18 líneas
    lineasMin: 14,
    lineasMax: 18,
    paso: 8,                   // px entre puntos de humo en flujo libre
    viento: 240,               // px/s del flujo libre
    cuerpo: { largo: 1.7, esbeltez: 0.4, k: 0.075, min: 44, max: 84 }, // semieje largo = R·largo; b = a·esbeltez
    pulsos: { longitud: [10, 28], hueco: [30, 110], amp: [0.55, 1], fraccionVerde: 0.75 },
    suavizado: { cursor: 7, presencia: 3 }    // 1/s
  };

  const reducirMovimiento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const U0 = reducirMovimiento ? 0 : CFG.viento;

  /* ---------- Canvas ---------- */
  const canvas =
    document.getElementById('viento') ||
    document.getElementById('fondo-lineas') ||
    (() => {
      const c = document.createElement('canvas');
      c.id = 'viento';
      document.body.prepend(c);
      return c;
    })();

  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '1',
    pointerEvents: 'none',
    display: 'block'
  });
  if (CFG.fondo) canvas.style.background = CFG.fondo;
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');

  // El canvas queda en z-index 1 (visible sobre el fondo del body);
  // el contenido de la página se sube a z-index 2 para quedar encima de las líneas.
  for (const el of document.body.children) {
    if (el === canvas || /^(SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.zIndex === 'auto' || parseInt(cs.zIndex, 10) < 2) el.style.zIndex = '2';
  }

  /* ---------- Estado ---------- */
  let W = 0, H = 0, dpr = 1;
  let n = 0;                        // líneas visibles
  let NL = 0;                       // líneas visibles + pistas de pulsos
  let CAP = 0, R = 60;
  let yl = [];                      // altura inicial de cada línea/pista
  let X = new Float32Array(0);      // humo: x de cada punto (índice 0 = el más viejo)
  let Y = new Float32Array(0);
  let S = new Float32Array(0);      // |V|/U en cada punto
  let Lz = new Float32Array(0);     // luz del pulso (+ verde, − gris claro)
  let cnt = new Int32Array(0);      // puntos vivos por línea
  let acc = 0;                      // acumulador de emisión

  // Estado de pulsos por pista
  let pQueda = new Int32Array(0), pIdx = new Int32Array(0), pLen = new Int32Array(0);
  let pGap = new Int32Array(0);
  let pAmp = new Float32Array(0), pSigno = new Float32Array(0);

  let presencia = 0, presenciaObjetivo = 0;
  let px = -9999, py = -9999;       // cursor real
  let cx = -9999, cy = -9999;       // cursor suavizado

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));

  /* ---------- Óvalo de Rankine ---------- */
  const OV = { a: 0, b: 0, c: 0, h: 0 };

  function actualizarOvalo(a) {
    if (a < 0.5) { OV.a = 0; return; }
    const b = a * CFG.cuerpo.esbeltez;
    // c: a² = c² + c·b / atan(c/b)   (bisección)
    let lo = 1e-3, hi = a;
    for (let i = 0; i < 28; i++) {
      const m = 0.5 * (lo + hi);
      const g = m * m + (m * b) / Math.atan(m / b) - a * a;
      if (g < 0) lo = m; else hi = m;
    }
    const c = 0.5 * (lo + hi);
    OV.a = a; OV.b = b; OV.c = c;
    OV.h = 0.5 * (b / Math.atan(c / b));
  }

  /* ---------- Campo de velocidad ---------- */
  let fu = 1, fv = 0;               // salida de campo()
  function campo(x, y) {
    if (OV.a <= 0) { fu = 1; fv = 0; return; }
    let dx = x - cx, dy = y - cy;
    // Dentro del cuerpo se evalúa sobre su superficie (evita singularidades)
    const rho2 = (dx / OV.a) * (dx / OV.a) + (dy / OV.b) * (dy / OV.b);
    if (rho2 < 1) {
      if (rho2 < 1e-8) { dx = OV.a; dy = 0; }
      else { const k = 1 / Math.sqrt(rho2); dx *= k; dy *= k; }
    }
    const x1 = dx + OV.c, x2 = dx - OV.c;
    let r1 = x1 * x1 + dy * dy, r2 = x2 * x2 + dy * dy;
    if (r1 < 4) r1 = 4;
    if (r2 < 4) r2 = 4;
    fu = 1 + OV.h * (x1 / r1 - x2 / r2);
    fv = OV.h * dy * (1 / r1 - 1 / r2);
  }

  // Si un punto queda dentro del cuerpo, lo empuja a su superficie
  let qx = 0, qy = 0;
  function expulsar(x, y) {
    qx = x; qy = y;
    if (OV.a <= 0) return;
    let dx = x - cx, dy = y - cy;
    const A = OV.a * 1.03, B = OV.b * 1.05;
    let rho2 = (dx / A) * (dx / A) + (dy / B) * (dy / B);
    if (rho2 < 1) {
      if (rho2 < 1e-8) { dx = -A; dy = 0; rho2 = 1; }
      const k = 1.01 / Math.sqrt(rho2);
      qx = cx + dx * k;
      qy = cy + dy * k;
    }
  }

  /* ---------- Layout ---------- */
  function reiniciarPulso(i, inicial) {
    const P = CFG.pulsos;
    pQueda[i] = 0;
    pGap[i] = inicial ? randInt(0, P.hueco[1]) : randInt(P.hueco[0], P.hueco[1]);
  }

  function ajustar() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    n = clamp(Math.round(H / CFG.altoPorLinea), CFG.lineasMin, CFG.lineasMax);
    NL = 2 * n - 1;
    const paso = H / n;
    yl = [];
    for (let i = 0; i < n; i++) yl.push(paso * (i + 0.5));                          // líneas visibles
    for (let i = 0; i < n - 1; i++) yl.push(paso * (i + 0.5 + rand(0.35, 0.65)));   // pistas de pulsos, entre líneas
    R = clamp(Math.min(W, H) * CFG.cuerpo.k, CFG.cuerpo.min, CFG.cuerpo.max);

    // Humo: se rellena de punta a punta con líneas rectas
    const cols = Math.ceil(W / CFG.paso) + 1;
    CAP = cols * 2 + 40;
    X = new Float32Array(NL * CAP);
    Y = new Float32Array(NL * CAP);
    S = new Float32Array(NL * CAP).fill(1);
    Lz = new Float32Array(NL * CAP);
    cnt = new Int32Array(NL);
    for (let i = 0; i < NL; i++) {
      const b = i * CAP;
      for (let k = 0; k <= cols; k++) {
        X[b + k] = (cols - k) * CFG.paso;
        Y[b + k] = yl[i];
      }
      cnt[i] = cols + 1;
    }

    pQueda = new Int32Array(NL); pIdx = new Int32Array(NL); pLen = new Int32Array(NL);
    pGap = new Int32Array(NL);
    pAmp = new Float32Array(NL); pSigno = new Float32Array(NL);
    for (let i = n; i < NL; i++) reiniciarPulso(i, true);
    acc = 0;
  }

  /* ---------- Cursor ---------- */
  window.addEventListener('pointermove', (e) => {
    if (presenciaObjetivo === 0 && presencia < 0.02) { cx = e.clientX; cy = e.clientY; }
    px = e.clientX;
    py = e.clientY;
    presenciaObjetivo = 1;
  }, { passive: true });

  const soltar = () => { presenciaObjetivo = 0; };
  document.documentElement.addEventListener('pointerleave', soltar);
  window.addEventListener('blur', soltar);
  window.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') soltar(); });
  window.addEventListener('pointercancel', soltar);
  window.addEventListener('resize', ajustar);

  /* ---------- Luz del siguiente punto de humo de la pista i ---------- */
  function luzNueva(i) {
    const P = CFG.pulsos;
    if (pQueda[i] > 0) {
      const u = pIdx[i] / pLen[i];
      // frente nítido y cola que se desvanece, como humo que se enciende
      const l = pSigno[i] * pAmp[i] * Math.pow(1 - u, 1.3) * Math.min(1, (pIdx[i] + 1) / 3);
      pIdx[i]++;
      pQueda[i]--;
      if (pQueda[i] === 0) pGap[i] = randInt(P.hueco[0], P.hueco[1]);
      return l;
    }
    if (--pGap[i] <= 0) {
      pLen[i] = randInt(P.longitud[0], P.longitud[1]);
      pQueda[i] = pLen[i];
      pIdx[i] = 0;
      pAmp[i] = rand(P.amp[0], P.amp[1]);
      pSigno[i] = Math.random() < P.fraccionVerde ? 1 : -1;
    }
    return 0;
  }

  /* ---------- Bucle ---------- */
  let ultimo = performance.now();
  const NIV = 4;                     // niveles de brillo de los pulsos

  function cuadro(ahora) {
    const dt = Math.min(0.033, (ahora - ultimo) / 1000);
    ultimo = ahora;

    presencia += (presenciaObjetivo - presencia) * (1 - Math.exp(-dt * CFG.suavizado.presencia));
    const kc = 1 - Math.exp(-dt * CFG.suavizado.cursor);
    cx += (px - cx) * kc;
    cy += (py - cy) * kc;

    actualizarOvalo(presencia > 0.02 ? R * CFG.cuerpo.largo * presencia : 0);
    const activo = OV.a > 0;
    const T = CFG.paso / (U0 || 1);

    /* 1) Mueve el humo con el flujo (punto medio, RK2) */
    if (U0 > 0) {
      for (let i = 0; i < NL; i++) {
        const b = i * CAP;
        for (let k = 0; k < cnt[i]; k++) {
          const j = b + k;
          const x = X[j], y = Y[j];
          campo(x, y);
          const xm = x + 0.5 * dt * U0 * fu, ym = y + 0.5 * dt * U0 * fv;
          campo(xm, ym);
          expulsar(x + dt * U0 * fu, y + dt * U0 * fv);
          X[j] = qx; Y[j] = qy;
          const s = Math.sqrt(fu * fu + fv * fv);
          S[j] = s > 2.2 ? 2.2 : s;
        }
        // Quita lo que ya salió por la derecha
        let quitar = 0;
        while (quitar < cnt[i] && X[b + quitar] > W + CFG.paso * 3) quitar++;
        if (quitar) {
          X.copyWithin(b, b + quitar, b + cnt[i]);
          Y.copyWithin(b, b + quitar, b + cnt[i]);
          S.copyWithin(b, b + quitar, b + cnt[i]);
          Lz.copyWithin(b, b + quitar, b + cnt[i]);
          cnt[i] -= quitar;
        }
      }

      /* 2) Suelta humo nuevo por el borde izquierdo */
      acc += dt;
      while (acc >= T) {
        acc -= T;
        const x = -CFG.paso + U0 * acc;
        for (let i = 0; i < NL; i++) {
          const b = i * CAP;
          if (cnt[i] >= CAP) {      // humo atorado en el estancamiento: tira el más viejo
            X.copyWithin(b, b + 1, b + cnt[i]);
            Y.copyWithin(b, b + 1, b + cnt[i]);
            S.copyWithin(b, b + 1, b + cnt[i]);
            Lz.copyWithin(b, b + 1, b + cnt[i]);
            cnt[i]--;
          }
          const j = b + cnt[i];
          X[j] = x; Y[j] = yl[i]; S[j] = 1;
          Lz[j] = i >= n ? luzNueva(i) : 0;
          cnt[i]++;
        }
      }
    }

    /* 3) Dibujo */
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    const corte = CFG.paso * 5;          // salto mayor = el humo se partió alrededor del cuerpo
    const corte2 = corte * corte;
    const tinte = [new Path2D(), new Path2D(), new Path2D()];
    const alfasTinte = [0.12, 0.22, 0.34];
    const pVerde = Array.from({ length: NIV }, () => new Path2D());
    const pClaro = Array.from({ length: NIV }, () => new Path2D());

    // Líneas visibles en gris técnico (un solo trazo)
    ctx.strokeStyle = `rgba(${CFG.gris}, ${Math.min(1, 0.2 * CFG.intensidad)})`;
    ctx.beginPath();
    for (let i = 0; i < NL; i++) {
      const visible = i < n;
      const b = i * CAP;
      const c = cnt[i];
      for (let k = 0; k < c; k++) {
        const j = b + k;
        let unido = false;
        if (k > 0) {
          const ddx = X[j] - X[j - 1], ddy = Y[j] - Y[j - 1];
          unido = ddx * ddx + ddy * ddy < corte2;
        }
        if (visible) {
          if (!unido) { ctx.moveTo(X[j], Y[j]); continue; }
          ctx.lineTo(X[j], Y[j]);
          if (activo) {
            const s = 0.5 * (S[j] + S[j - 1]);
            const nv = s > 1.38 ? 2 : s > 1.2 ? 1 : s > 1.05 ? 0 : -1;
            if (nv >= 0) {
              tinte[nv].moveTo(X[j - 1], Y[j - 1]);
              tinte[nv].lineTo(X[j], Y[j]);
            }
          }
        } else if (unido) {
          // Pista de pulsos: solo se dibuja lo que está encendido
          const luz = 0.5 * (Lz[j] + Lz[j - 1]);
          const mag = Math.abs(luz);
          if (mag > 0.04) {
            const lv = Math.min(NIV - 1, Math.floor(mag * NIV));
            const p = luz > 0 ? pVerde[lv] : pClaro[lv];
            p.moveTo(X[j - 1], Y[j - 1]);
            p.lineTo(X[j], Y[j]);
          }
        }
      }
    }
    ctx.stroke();

    // Tinte verde donde el flujo se acelera (Venturi)
    if (activo) {
      const f = Math.min(1, presencia * 1.5);
      for (let q = 0; q < 3; q++) {
        ctx.strokeStyle = `rgba(${CFG.verde}, ${Math.min(1, alfasTinte[q] * CFG.intensidad * f)})`;
        ctx.stroke(tinte[q]);
      }
    }

    // Pulsos de luz que viajan con el aire, entre las líneas
    for (let lv = 0; lv < NIV; lv++) {
      const brillo = (lv + 1) / NIV;
      ctx.strokeStyle = `rgba(${CFG.verde}, ${Math.min(1, 0.6 * brillo * CFG.intensidad)})`;
      ctx.stroke(pVerde[lv]);
      ctx.strokeStyle = `rgba(${CFG.grisClaro}, ${Math.min(1, 0.45 * brillo * CFG.intensidad)})`;
      ctx.stroke(pClaro[lv]);
    }

    requestAnimationFrame(cuadro);
  }

  ajustar();
  requestAnimationFrame(cuadro);
};

// Funciona aunque el script esté en <head> sin defer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarViento);
} else {
  iniciarViento();
}