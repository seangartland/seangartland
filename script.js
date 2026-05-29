const PROJECTS = [
  { id: 'resume',    icon: '📄', title: 'Resume',        url: 'resume.html' },
  { id: 'linkedin',  icon: '💼', title: 'LinkedIn',      url: 'https://www.linkedin.com/in/seangartland', noframe: true },
  { id: 'github',    icon: '🐙', title: 'GitHub',        url: 'https://github.com/seangartland',          noframe: true },
  { id: 'nostalgia', icon: '📺', title: 'TimeSurf.TV',   url: 'https://timesurf.tv?yearMin=1990&yearMax=1999' },
  { id: 'pigskin',   icon: '🏈', title: 'Pigskin Royale', url: 'https://pigskin-royale.vercel.app', noframe: true },
  { id: 'scoracle',  icon: '📊', title: 'Scoracle',      url: 'https://scoreacle.vercel.app' },
];

// ── WINDOW FACTORY ────────────────────────────────
function createWindow(p) {
  const win = document.createElement('div');
  win.className = 'window';
  win.id = 'win-' + p.id;

  const addrText = p.url || 'about:blank';

  const frameHtml = !p.url
    ? `<div class="frame-placeholder">
         <div class="ph-icon">${p.icon}</div>
         <div class="ph-title">${p.title}</div>
         <div class="ph-msg">Coming Soon</div>
       </div>`
    : p.noframe
    ? `<div class="frame-placeholder">
         <div class="ph-icon">${p.icon}</div>
         <div class="ph-title">${p.title}</div>
         <div class="ph-msg">This site can't be displayed in a window.</div>
         <a class="ph-open" href="${p.url}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
       </div>`
    : `<div class="frame-loading" id="loading-${p.id}">⌛ Loading...</div>
       <iframe class="project-frame" id="frame-${p.id}" data-src="${p.url}" title="${p.title}"></iframe>`;

  win.innerHTML = `
    <div class="title-bar">
      <span class="title-icon">${p.icon}</span>
      <span class="title-text">${p.title}</span>
      <div class="win-controls">
        <button class="win-btn btn-min" aria-label="Minimize">_</button>
        <button class="win-btn btn-max" aria-label="Maximize">□</button>
        <button class="win-btn btn-close" aria-label="Close">✕</button>
      </div>
    </div>
    <div class="addr-bar">
      <span class="addr-label">Address</span>
      <div class="addr-field">${addrText}</div>
    </div>
    <div class="frame-wrap">${frameHtml}</div>
    <div class="status-bar"><span class="status-cell status-msg">Ready</span></div>
  `;

  return win;
}

// ── FAVICON (canvas PNG — works on file:// + Safari) ──
(function () {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const x = c.getContext('2d');

  // Teal desktop
  x.fillStyle = '#008080'; x.fillRect(0, 0, 32, 32);

  // Window shadow
  x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(6, 7, 22, 17);

  // Window chrome
  x.fillStyle = '#c0c0c0'; x.fillRect(4, 5, 22, 17);

  // 3D border highlight
  x.fillStyle = '#ffffff';
  x.fillRect(4, 5, 22, 1); x.fillRect(4, 5, 1, 17);

  // 3D border shadow
  x.fillStyle = '#404040';
  x.fillRect(4, 21, 22, 1); x.fillRect(25, 5, 1, 17);

  // Title bar
  const grad = x.createLinearGradient(5, 0, 24, 0);
  grad.addColorStop(0, '#000080'); grad.addColorStop(1, '#1084d0');
  x.fillStyle = grad; x.fillRect(5, 6, 19, 5);

  // Close button
  x.fillStyle = '#c0c0c0'; x.fillRect(21, 7, 3, 3);
  x.strokeStyle = '#000'; x.lineWidth = 0.8;
  x.beginPath(); x.moveTo(22, 8); x.lineTo(23, 9); x.stroke();
  x.beginPath(); x.moveTo(23, 8); x.lineTo(22, 9); x.stroke();

  // Content area
  x.fillStyle = '#ffffff'; x.fillRect(5, 11, 19, 10);

  // Fake content lines
  x.fillStyle = '#c8c8c8';
  x.fillRect(7, 13, 11, 1); x.fillRect(7, 15, 15, 1); x.fillRect(7, 17, 8, 1);

  // Taskbar
  x.fillStyle = '#c0c0c0'; x.fillRect(0, 27, 32, 5);
  x.fillStyle = '#ffffff';  x.fillRect(0, 27, 32, 1);

  // Start button
  x.fillStyle = '#c0c0c0'; x.fillRect(1, 28, 7, 3);
  x.fillStyle = '#ffffff';
  x.fillRect(1, 28, 7, 1); x.fillRect(1, 28, 1, 3);
  x.fillStyle = '#404040';
  x.fillRect(7, 28, 1, 3); x.fillRect(1, 30, 7, 1);

  const link = document.querySelector("link[rel='icon']") || document.createElement('link');
  link.rel = 'icon'; link.href = c.toDataURL();
  document.head.appendChild(link);
})();

// ── MAXIMIZE / RESTORE ───────────────────────────
const maxState = {};

function toggleMaximize(id) {
  const win   = document.getElementById('win-' + id);
  const btn   = win.querySelector('.btn-max');
  const tbH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'));
  const state = maxState[id] || (maxState[id] = { maximized: false });

  if (!state.maximized) {
    state.savedLeft   = win.style.left;
    state.savedTop    = win.style.top;
    state.savedWidth  = win.style.width;
    state.savedHeight = win.style.height;
    win.style.left    = '0';
    win.style.top     = '0';
    win.style.width   = window.innerWidth + 'px';
    win.style.height  = (window.innerHeight - tbH) + 'px';
    state.maximized   = true;
    btn.textContent   = '❐';
  } else {
    win.style.left    = state.savedLeft   || '40px';
    win.style.top     = state.savedTop    || '20px';
    win.style.width   = state.savedWidth  || '';
    win.style.height  = state.savedHeight || '';
    state.maximized   = false;
    btn.textContent   = '□';
  }
  focusWindow(id);
}

// ── Z / FOCUS ─────────────────────────────────────
let winZTop  = 100;
let iconZTop = 10;

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  document.querySelectorAll('.tb-win-btn').forEach(b => b.classList.remove('active'));
  const win = document.getElementById('win-' + id);
  if (!win) return;
  win.classList.add('focused');
  win.style.zIndex = ++winZTop;
  document.querySelector(`.tb-win-btn[data-id="${id}"]`)?.classList.add('active');
}

// ── OPEN / CLOSE / MINIMIZE ───────────────────────
const openPos = {};
let cascade = 0;

function openWindow(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;
  if (win.style.display === 'flex') { focusWindow(id); return; }

  // Cascade position on first open
  if (!openPos[id]) {
    openPos[id] = { left: 40 + cascade * 26, top: 20 + cascade * 26 };
    cascade = (cascade + 1) % 8;
  }
  win.style.display = 'flex';
  const _tbH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'));
  win.style.left = Math.min(openPos[id].left, Math.max(0, window.innerWidth  - win.offsetWidth))  + 'px';
  win.style.top  = Math.min(openPos[id].top,  Math.max(0, window.innerHeight - win.offsetHeight - _tbH)) + 'px';

  addTaskbarBtn(id);
  focusWindow(id);
  lazyLoadFrame(id);
}

function closeWindow(id) {
  const win = document.getElementById('win-' + id);
  if (win) {
    // Blank the iframe so audio/video stops immediately
    const frame = win.querySelector('.project-frame');
    if (frame) frame.src = 'about:blank';
    // Reset loading UI so next open shows spinner again
    win.querySelector('.frame-loading')?.classList.remove('done');
    const status = win.querySelector('.status-msg');
    if (status) status.textContent = 'Ready';
    win.style.display = 'none';
  }
  removeTaskbarBtn(id);
}

function minimizeWindow(id) {
  const win = document.getElementById('win-' + id);
  if (win) win.style.display = 'none';
  document.querySelector(`.tb-win-btn[data-id="${id}"]`)?.classList.remove('active');
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
}

// ── LAZY IFRAME LOAD ──────────────────────────────
function lazyLoadFrame(id) {
  const frame   = document.getElementById('frame-' + id);
  const loading = document.getElementById('loading-' + id);
  const status  = document.querySelector(`#win-${id} .status-msg`);
  if (!frame || frame.src === frame.dataset.src) return;  // no iframe or already loaded

  status.textContent = 'Connecting to ' + frame.dataset.src + '...';
  frame.src = frame.dataset.src;

  frame.addEventListener('load', () => {
    loading?.classList.add('done');
    status.textContent = 'Done';
  }, { once: true });
}

// ── TASKBAR BUTTONS ───────────────────────────────
function addTaskbarBtn(id) {
  if (document.querySelector(`.tb-win-btn[data-id="${id}"]`)) return;
  const p   = PROJECTS.find(x => x.id === id);
  const btn = document.createElement('button');
  btn.className  = 'tb-win-btn';
  btn.dataset.id = id;
  btn.innerHTML  = `<span class="tb-icon">${p.icon}</span><span>${p.title}</span>`;
  btn.addEventListener('click', () => {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    if (win.style.display !== 'flex')       { win.style.display = 'flex'; focusWindow(id); }
    else if (win.classList.contains('focused')) minimizeWindow(id);
    else                                       focusWindow(id);
  });
  document.getElementById('taskbar-windows').appendChild(btn);
}

function removeTaskbarBtn(id) {
  document.querySelector(`.tb-win-btn[data-id="${id}"]`)?.remove();
}

// ── WINDOW DRAG ───────────────────────────────────
function makeDraggable(win) {
  const bar = win.querySelector('.title-bar');
  const id  = win.id.replace('win-', '');
  let dragging = false, ox = 0, oy = 0;

  bar.addEventListener('dblclick', e => {
    if (e.target.classList.contains('win-btn')) return;
    toggleMaximize(id);
  });

  bar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-btn')) return;
    if (maxState[id]?.maximized) return;     // no drag while maximized
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
    focusWindow(id);
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const tbH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'));
    const maxL = window.innerWidth  - win.offsetWidth;
    const maxT = window.innerHeight - win.offsetHeight - tbH;
    win.style.left = Math.max(0, Math.min(e.clientX - ox, maxL)) + 'px';
    win.style.top  = Math.max(0, Math.min(e.clientY - oy, maxT)) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
}

// ── ICON DRAG + DOUBLE-CLICK ──────────────────────
const dblTimers = {};

function initIcons() {
  const icons = document.querySelectorAll('.desk-icon');
  const colW = 100, rowH = 118, padX = 14, padY = 14;
  // Row 0: resume, linkedin, github
  // Row 1: nostalgia, pigskin, scoracle
  const layout = {
    resume:    [0, 0], linkedin:  [1, 0], github:    [2, 0],
    nostalgia: [0, 1], pigskin:   [1, 1], scoracle:  [2, 1],
  };

  icons.forEach((icon) => {
    const id = icon.dataset.id;
    const pos = layout[id] || [0, 0];
    icon.style.left   = (padX + pos[0] * colW) + 'px';
    icon.style.top    = (padY + pos[1] * rowH) + 'px';
    icon.style.zIndex = 1;

    icon.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      icon.style.zIndex = ++iconZTop;
      icon.focus();

      const startX = e.clientX, startY = e.clientY;
      const origL  = icon.offsetLeft, origT = icon.offsetTop;
      let didDrag  = false;

      const onMove = e => {
        const dx = e.clientX - startX, dy = e.clientY - startY;
        if (!didDrag && Math.hypot(dx, dy) < 5) return;
        didDrag = true;
        const desk = document.getElementById('desktop');
        const tbH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'));
        icon.style.left = Math.max(0, Math.min(origL + dx, desk.offsetWidth  - icon.offsetWidth))  + 'px';
        icon.style.top  = Math.max(0, Math.min(origT + dy, desk.offsetHeight - icon.offsetHeight - tbH)) + 'px';
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
        if (didDrag) return;
        if (dblTimers[id]) {
          clearTimeout(dblTimers[id]); delete dblTimers[id];
          openWindow(id);
        } else {
          dblTimers[id] = setTimeout(() => delete dblTimers[id], 300);
        }
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    });

    icon.addEventListener('keydown', e => { if (e.key === 'Enter') openWindow(id); });

    // Mobile: single tap opens window directly
    icon.addEventListener('touchend', e => {
      e.preventDefault();
      openWindow(id);
    }, { passive: false });
  });
}

// ── START MENU ────────────────────────────────────
const startMenu   = document.getElementById('start-menu');
const startBtn    = document.getElementById('start-btn');
const programsSub = document.getElementById('programs-submenu');
let subCloseTimer = null;

PROJECTS.forEach(p => {
  const item = document.createElement('div');
  item.className = 'sub-item';
  item.innerHTML = `<span class="sub-icon">${p.icon}</span><span>${p.title}</span>`;
  item.addEventListener('click', () => { openWindow(p.id); closeStartMenu(); });
  programsSub.appendChild(item);
});

function openStartMenu()  { startMenu.classList.remove('hidden'); startBtn.classList.add('active'); }
function closeStartMenu() { startMenu.classList.add('hidden'); programsSub.classList.add('hidden'); startBtn.classList.remove('active'); clearTimeout(subCloseTimer); }
function toggleStartMenu(){ startMenu.classList.contains('hidden') ? openStartMenu() : closeStartMenu(); }

startBtn.addEventListener('click', e => { e.stopPropagation(); toggleStartMenu(); });

const itemPrograms = document.getElementById('item-programs');
const openSub  = () => { clearTimeout(subCloseTimer); programsSub.classList.remove('hidden'); };
const closeSub = () => { subCloseTimer = setTimeout(() => programsSub.classList.add('hidden'), 120); };

itemPrograms.addEventListener('mouseenter', openSub);
itemPrograms.addEventListener('mouseleave', closeSub);
programsSub.addEventListener('mouseenter',  openSub);
programsSub.addEventListener('mouseleave',  closeSub);

['item-run', 'item-shutdown'].forEach(id => {
  document.getElementById(id).addEventListener('mouseenter', () => {
    clearTimeout(subCloseTimer); programsSub.classList.add('hidden');
  });
});

document.getElementById('item-run').addEventListener('click',      () => { closeStartMenu(); showRunDialog(); });
document.getElementById('item-shutdown').addEventListener('click',  () => { closeStartMenu(); doShutdown(); });
document.addEventListener('click', e => {
  if (!startMenu.contains(e.target) && !programsSub.contains(e.target) && e.target !== startBtn) closeStartMenu();
});

// ── RUN DIALOG ────────────────────────────────────
const runDialog = document.getElementById('run-dialog');
const runInput  = document.getElementById('run-input');

function showRunDialog() { runDialog.style.display = 'flex'; runDialog.style.zIndex = 99999; runInput.value = ''; runInput.focus(); }
function hideRunDialog() { runDialog.style.display = 'none'; }

function runOk() {
  const val   = runInput.value.trim().toLowerCase();
  const match = PROJECTS.find(p => p.id.includes(val) || p.title.toLowerCase().includes(val));
  if (match) { openWindow(match.id); hideRunDialog(); }
  else { runInput.style.outline = '2px solid red'; setTimeout(() => { runInput.style.outline = ''; }, 600); }
}

document.getElementById('run-ok').addEventListener('click', runOk);
document.getElementById('run-cancel').addEventListener('click', hideRunDialog);
document.getElementById('run-close').addEventListener('click', hideRunDialog);
runInput.addEventListener('keydown', e => { if (e.key === 'Enter') runOk(); });

// ── SHUTDOWN ──────────────────────────────────────
const shutdownScreen = document.getElementById('shutdown-screen');
function doShutdown() { shutdownScreen.classList.remove('hidden'); }
document.getElementById('shutdown-restart').addEventListener('click', () => location.reload());

// ── CLOCK ─────────────────────────────────────────
function updateClock() {
  const now = new Date(), h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-clock').textContent = `${(h % 12) || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

// ── INIT ──────────────────────────────────────────
const container = document.getElementById('windows-container');
PROJECTS.forEach(p => {
  const win = createWindow(p);
  container.appendChild(win);
  makeDraggable(win);
  win.addEventListener('mousedown', () => focusWindow(p.id));
  win.querySelector('.btn-close').addEventListener('click', () => closeWindow(p.id));
  win.querySelector('.btn-min').addEventListener('click',   () => minimizeWindow(p.id));
  win.querySelector('.btn-max').addEventListener('click',   () => toggleMaximize(p.id));
});

initIcons();

document.getElementById('desktop').addEventListener('mousedown', e => {
  if (e.target.id === 'desktop' || e.target.id === 'icon-grid') {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
    document.querySelectorAll('.tb-win-btn').forEach(b => b.classList.remove('active'));
  }
});

updateClock();
setInterval(updateClock, 10000);
