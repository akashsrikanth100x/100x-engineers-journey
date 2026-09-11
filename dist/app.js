(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const { HOUSES, TRACKS } = CohortContent;
  const { META, STAGES, atPosition } = ExplorationContent;
  const { PATHS, HOUSE_Y, clamp, metrics, commonX, pathX, station, isBranch, transport, Journey } = JourneyEngine;
  const game = new Journey(10), player = $('#player'), room = $('#room'), map = $('#map'), world = $('#world'), cursor = $('.cursor-ring');
  const sound = new VillageAudio.Soundscape({ onChange: ({ enabled, supported, pending, message }) => {
    document.querySelectorAll('[data-sound-toggle]').forEach(button => { button.textContent = supported ? (enabled ? 'Jazz on' : 'Jazz off') : 'No audio'; button.setAttribute('aria-pressed', String(enabled)); button.setAttribute('aria-label', enabled ? 'Mute hut jazz' : 'Enable hut jazz'); button.title = enabled ? 'Mute jazz inside the huts' : 'Play jazz inside the huts'; button.disabled = pending || !supported; });
    if (message) $('#announcer').textContent = message;
  } });
  document.querySelectorAll('[data-sound-toggle]').forEach(button => button.addEventListener('click', () => sound.toggle()));
  sound.notify();
  document.addEventListener('visibilitychange', () => sound.setHidden(document.hidden));
  window.addEventListener('pagehide', () => sound.setHidden(true));
  window.addEventListener('pageshow', () => sound.setHidden(document.hidden));
  window.addEventListener('cohort-guide-visibility', e => sound.setScene({ overlay: !!e.detail }));
  const asset = key => window.PREVIEW_ASSETS?.[key] || key;
  let m, houseNodes = [], mapNodes = [], nearest = -1, walkingTimer, resizeTimer, savedScroll = 0, returnFocus = null, mapScroll = 0, lastLevel = 0, scrollFrame = false, toastTimer, renderedGear = -1;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const announce = text => { $('#announcer').textContent = text; };
  function sizeRoomChrome() {
    if (!room.open) return;
    room.style.setProperty('--room-header-height', $('.room-top').getBoundingClientRect().height + 'px');
    room.style.setProperty('--room-timeline-height', $('.room-timeline').getBoundingClientRect().height + 'px');
  }
  const roomChromeObserver = new ResizeObserver(sizeRoomChrome);
  roomChromeObserver.observe($('.room-top')); roomChromeObserver.observe($('.room-timeline'));
  function setMotion(value) { reduced = value; document.documentElement.classList.toggle('reduced-motion', value); $('#motion-toggle').setAttribute('aria-pressed', String(value)); $('#motion-toggle').setAttribute('aria-label', value ? 'Enable decorative motion' : 'Pause decorative motion'); $('#motion-toggle').textContent = value ? '▷' : 'Ⅱ'; }
  setMotion(reduced); $('#motion-toggle').addEventListener('click', () => setMotion(!reduced)); matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => setMotion(e.matches));
  HOUSES.forEach((h, i) => {
    const routes = isBranch(i) ? PATHS : [null];
    routes.forEach(route => {
      const b = el('button', `house${isBranch(i) ? ' branch-house' : ''}${i === 3 ? ' grand-house' : ''}`); b.id = `house-${i}${route ? '-' + route : ''}`; b.dataset.index = i; b.dataset.kind = h.kind; if (route) b.dataset.route = route;
      b.setAttribute('aria-label', `Enter House ${i + 1}: ${h.name}${route ? ', ' + TRACKS[route].label : ''}`);
      const img = el('img'); img.src = asset(`assets/${META[i].asset}.webp`); img.alt = ''; img.width = i === 3 ? 597 : 438; img.height = i === 3 ? 473 : 522;
      const sign = el('span', 'house-sign'); sign.append(el('span', 'house-stage', isBranch(i) ? TRACKS[route].short : h.stage.split(' / ')[1]), el('strong', '', h.name), el('span', 'enter-label', i === 3 ? 'CHOOSE A PATH ↗' : 'ENTER ↗'));
      b.append(img, el('span', 'house-number', String(i + 1).padStart(2, '0')), sign); b.addEventListener('click', () => enterHouse(i, b, route)); $('#houses').append(b); houseNodes.push({ node: b, index: i, route });
    });
    const b = el('button', 'map-stop'), title = el('span'); title.append(el('strong', '', h.name), el('small', '', h.stage.split(' / ')[1])); b.append(el('span', 'map-num', String(i + 1).padStart(2, '0')), title, el('span', 'map-symbol', '↗')); b.addEventListener('click', () => { closeMap(false); if (i > 3 && !game.path) enterHouse(3, $('#map-toggle')); else goToHouse(i); }); $('#map-list').append(b); mapNodes.push(b);
  });
  function svgPath(d, cls) { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); p.setAttribute('class', cls); return p; }
  function curve(from, to, route) { let d = ''; for (let y = from; y < to; y += 25) d += `${d ? ' L' : 'M'}${pathX(y, m, route).toFixed(1)} ${y}`; return d + ` L${pathX(to, m, route).toFixed(1)} ${to}`; }
  function road(group, d) { group.replaceChildren(svgPath(d, 'road-edge'), svgPath(d, 'road-surface'), svgPath(d, 'road-trail')); }
  function layout() {
    document.documentElement.style.setProperty('--hud-height', $('.hud').getBoundingClientRect().height + 'px'); document.documentElement.style.setProperty('--timeline-height', $('.programme-timeline').getBoundingClientRect().height + 'px');
    const progress = game.progress; m = metrics(document.documentElement.clientWidth, innerHeight); world.style.height = m.worldHeight + 'px'; $('#road').setAttribute('viewBox', `0 0 ${m.width} ${m.worldHeight}`);
    road($('#shared-road'), curve(-150, m.fork, null) + ' ' + curve(m.boatEnd, m.worldHeight + 150, null));
    PATHS.forEach(path => road($('#' + path + '-road'), curve(m.fork, m.boatStart, path)));
    $('#house-paths').replaceChildren();
    houseNodes.forEach(({ node, index, route }) => {
      const p = station(index, m, route); node.style.left = p.x + 'px'; node.style.top = p.y + 'px';
      if (index !== 3) { const bx = pathX(p.y, m, route); const branch = svgPath(`M${bx} ${p.y} Q${(bx + p.x) / 2} ${p.y + 30} ${p.x} ${p.y - 12}`, 'house-connector'); if (route) branch.dataset.route = route; $('#house-paths').append(branch); }
    });
    $('#river').style.top = m.riverTop + 'px'; $('#river').style.height = m.riverHeight + 'px'; $('#river-sign').style.top = (m.riverTop - 205) + 'px'; $('#branch-signs').style.top = (m.forkOpen - 40) + 'px';
    $('#docks').replaceChildren();
    [...PATHS.map(path => ({ x: pathX(m.boatStart, m, path), y: m.boatStart - 5, route: path })), { x: m.width / 2, y: m.boatEnd + 35 }].forEach(p => { const img = el('img', 'dock'); img.src = asset('assets/dock.webp'); img.alt = ''; img.style.left = p.x + 'px'; img.style.top = p.y + 'px'; if (p.route) img.dataset.route = p.route; $('#docks').append(img); });
    $('#destination').style.top = (m.worldHeight - 670) + 'px'; buildScenery(); refreshPath();
    if (game.phase === 'road') { window.scrollTo(0, progress * m.maxScroll); update(); } else placePlayer(window.scrollY + m.anchor);
  }
  function seeded(seed) { let n = seed; return () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296; }; }
  function buildScenery() {
    const random = seeded(56), frag = document.createDocumentFragment();
    function free(x, y, padding = 0) {
      if (y > m.riverTop - 200 && y < m.riverTop + m.riverHeight + 230) return false;
      if (y < 610 && x < m.width * .46) return false;
      if (y > m.worldHeight - 850 && x > m.width * .10 && x < m.width * .90) return false;
      if (houseNodes.some(({ index, route }) => { const p = station(index, m, route); return Math.abs(y - p.y) < (index === 3 ? 290 : 210) && Math.abs(x - p.x) < (index === 3 ? Math.min(300, m.width * .4) : m.width < 650 ? 90 : 155) + padding; })) return false;
      const routes = y > m.fork && y < m.boatStart ? PATHS : [null];
      return !routes.some(path => Math.abs(x - pathX(y, m, path)) < (m.width < 650 ? 55 : 125) + padding);
    }
    for (let i = 0; i < 300; i++) { const y = 100 + random() * (m.worldHeight - 250), x = random() * m.width; if (!free(x, y)) continue; const img = el('img', 'scenery-object tree'); img.src = asset(`assets/${i % 3 ? 'pine' : 'broadleaf'}.webp`); img.alt = ''; const w = m.width < 650 ? 44 + random() * 32 : 78 + random() * 70; img.style.width = w + 'px'; img.style.left = x + 'px'; img.style.top = y + 'px'; img.style.zIndex = random() > .65 ? '4' : '1'; frag.append(img); }
    for (let i = 0; i < 45; i++) { const y = 530 + random() * (m.worldHeight - 1400), x = 35 + random() * (m.width - 70); if (!free(x, y, -15)) continue; const img = el('img', 'scenery-object animal'); img.src = asset(`assets/${['deer', 'rabbit', 'fox'][i % 3]}.webp`); img.alt = ''; img.style.width = (m.width < 650 ? 34 : 52) + 'px'; img.style.left = x + 'px'; img.style.top = y + 'px'; img.style.animationDelay = -(i % 5) + 's'; img.style.zIndex = '3'; frag.append(img); }
    for (let i = 0; i < 220; i++) { const x = random() * m.width, y = random() * m.worldHeight; if (y > m.riverTop && y < m.riverTop + m.riverHeight) continue; const e = el('span', i % 12 ? 'terrain-speck' : 'firefly'); e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.animationDelay = -random() * 6 + 's'; frag.append(e); }
    $('#scenery').replaceChildren(frag);
  }
  function refreshPath() {
    document.body.dataset.path = game.path || 'undecided';
    PATHS.forEach(path => { $('#' + path + '-road').classList.toggle('chosen-road', game.path === path); });
    houseNodes.forEach(({ node, index, route }) => { const inactive = !!route && route !== game.path; node.classList.toggle('inactive-path', inactive); node.classList.toggle('visited', game.hasVisited(index, route)); node.setAttribute('aria-label', inactive ? `Choose the ${TRACKS[route].label} road to visit ${HOUSES[index].name}` : `Enter House ${index + 1}: ${HOUSES[index].name}`); if (route) node.querySelector('.enter-label').textContent = inactive ? 'CHOOSE PATH ↗' : 'ENTER ↗'; });
    mapNodes.forEach((b, i) => { const visited = game.hasVisited(i); b.classList.toggle('visited', visited); b.querySelector('.map-symbol').textContent = visited ? '✓' : i > 3 && !game.path ? '◇' : '↗'; });
    $('#visited-count').textContent = game.visitedCount(); $('#map-path-status').textContent = game.path ? `Your road: ${TRACKS[game.path].label}. Return to House 04 to change.` : 'Choose your pathway in House 04 to continue.';
    $('#path-switch').textContent = game.path ? `${TRACKS[game.path].label.toUpperCase()} · CHANGE ↗` : 'CHOOSE YOUR PATHWAY ↗';
    refreshProgress();
  }
  STAGES.forEach((name, i) => { const stage = el('span', 'timeline-stage', name); stage.dataset.phase = i; $('#timeline-stages').append(stage); });
  function updateTimeline(index) {
    const meta = META[index]; $('#timeline-stages').querySelectorAll('[data-phase]').forEach(n => { const active = Number(n.dataset.phase) === meta.phase; n.classList.toggle('active', active); if (active) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current'); });
    $('#timeline-when').textContent = meta.when; $('#timeline-context').textContent = HOUSES[index].name;
    $('#room-timeline').textContent = `${STAGES[meta.phase]} / ${meta.when}`;
  }
  function rewardToast(text) {
    const toast = $('#exploration-toast'); if (room.open) room.append(toast); else document.body.append(toast);
    toast.textContent = text; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2700);
  }
  function refreshProgress() {
    const level = game.explorationScore(), gear = game.gear();
    $('#level-value').replaceChildren(document.createTextNode(String(level)), el('span', '', 'x')); $('#health-fill').style.width = level + '%'; $('.health-track').setAttribute('aria-valuenow', level);
    $('#room-level').textContent = `${level}x Explorer`; $('#map-explorer-score').textContent = `${level} / 100x earned`;
    $('#finish-progress').textContent = level === 100 ? '100x explored. Every house, every discovery. Imagine what you could build next.' : `${level}x earned so far. Revisit a house and explore its objects to keep growing.`;
    $('#finish-explore').hidden = level === 100;
    if (level > lastLevel) { player.classList.remove('level-up'); void player.offsetWidth; player.classList.add('level-up'); }
    lastLevel = level;
    mapNodes.forEach((b, i) => { b.querySelector('.map-symbol').textContent = game.houseScore(i) === 10 ? '10x ✓' : `${game.houseScore(i)}/10x`; });
    if (renderedGear !== gear.length) {
      $('#player-gear').replaceChildren(); $('#gear-unlocks').replaceChildren();
      [{ id:'toolkit', label:'Builder toolkit', at:20 }, { id:'backpack', label:'Explorer backpack', at:50 }, { id:'badge', label:'100x explorer badge', at:100 }].forEach(item => {
        const unlocked = level >= item.at, card = el('div', `gear-unlock${unlocked ? ' unlocked' : ''}`), img = el('img'); img.src = asset(`assets/gear-${item.id}.webp`); img.alt = ''; card.append(img, el('strong', '', item.label), el('span', '', unlocked ? 'Unlocked ✓' : `Unlocks at ${item.at}x`)); $('#gear-unlocks').append(card);
        if (unlocked) { const marker = img.cloneNode(); marker.className = `equipped-${item.id}`; $('#player-gear').append(marker); }
      });
      player.dataset.gear = gear.length; renderedGear = gear.length;
    }
  }
  function discover(ids) {
    const before = game.gear().length; let earned = 0; (Array.isArray(ids) ? ids : [ids]).forEach(id => { earned += game.discover(id); });
    refreshProgress(); if (earned) rewardToast(game.gear().length > before ? `+${earned}x · ${game.gear().at(-1).label} unlocked!` : `+${earned}x · Discovery added`);
  }
  function placePlayer(y) {
    player.style.left = pathX(y, m, game.path) + 'px'; player.style.top = y + 'px';
    const riding = transport(y) === 'boat'; player.classList.toggle('riding', riding); document.body.classList.toggle('on-river', riding); $('.player-name').textContent = riding ? 'ALL ABOARD' : `YOU · ${game.explorationScore()}x`;
    sound.setScene({ phase: game.phase });
  }
  function update() {
    if (game.phase !== 'road' || map.open) return;
    game.move(window.scrollY, m); if (Math.abs(window.scrollY - game.scroll) > 1) window.scrollTo(0, game.scroll);
    const y = game.scroll + m.anchor; placePlayer(y);
    updateTimeline(atPosition(y, HOUSE_Y)); document.body.classList.toggle('finished', game.progress > .964);
    let best = -1, distance = Infinity; HOUSES.forEach((_, i) => { if (i > 3 && !game.path) return; const delta = Math.abs(station(i, m, game.path).y - y); if (delta < distance) { best = i; distance = delta; } });
    nearest = distance < 265 ? best : -1;
    houseNodes.forEach(({ node, index, route }) => node.classList.toggle('nearest', index === nearest && (!route || route === game.path)));
    const h = HOUSES[nearest], riding = transport(y) === 'boat';
    if (h) { $('#nearby-kicker').textContent = h.stage; $('#nearby-title').textContent = h.name; $('#nearby-description').textContent = nearest === 3 ? 'Choose a door to continue your journey.' : isBranch(nearest) ? `${TRACKS[game.path].label} · Code and Low-code inside.` : 'Step inside to explore this part of the cohort.'; $('#nearby-enter').hidden = false; $('#nearby-enter').textContent = nearest === 3 ? 'Choose a path ↗' : 'Enter house ↗'; $('#scroll-cue').hidden = true; }
    else { $('#nearby-kicker').textContent = riding ? 'RIVER CROSSING' : game.scroll < 300 ? 'YOUR ADVENTURE BEGINS' : 'KEEP EXPLORING'; $('#nearby-title').textContent = riding ? 'Next stop: the shared road.' : game.scroll < 300 ? 'Follow the orange trail.' : 'There’s more around the bend.'; $('#nearby-description').textContent = riding ? 'Keep scrolling. Your boat carries you across.' : 'Scroll down or use the arrow keys to walk.'; $('#nearby-enter').hidden = true; $('#scroll-cue').hidden = false; }
  }
  window.addEventListener('scroll', () => { if (game.phase !== 'road' || map.open) return; player.classList.add('walking'); clearTimeout(walkingTimer); walkingTimer = setTimeout(() => player.classList.remove('walking'), 180); if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(() => { update(); scrollFrame = false; }); } }, { passive: true });
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if ((game.phase === 'road' && !map.open) || game.phase === 'boot') layout(); }, 130); });
  function freeze() { savedScroll = game.scroll; document.body.style.overflow = 'hidden'; }
  function unfreeze() { document.body.style.overflow = ''; window.scrollTo(0, savedScroll); }
  function goToHouse(index) { if (game.phase !== 'road') return; if (index > 3 && !game.path) { enterHouse(3, $('#map-toggle')); return; } const p = station(index, m, game.path); window.scrollTo({ top: p.scroll, behavior: reduced ? 'instant' : 'smooth' }); announce(`Walking to ${HOUSES[index].name}.`); }
  function enterHouse(index, trigger, route = game.path) {
    if (game.phase !== 'road' || map.open) return;
    if ((index > 3 && !game.path) || (isBranch(index) && route !== game.path)) { index = 3; route = null; announce('Visit the Pathway house to choose or change your road.'); }
    const p = station(index, m, route); window.scrollTo(0, p.scroll); update(); if (!game.enter(index, route)) return; sound.setScene({ phase: 'entering' });
    returnFocus = trigger || $('#map-toggle'); freeze(); $('#nearby-enter').disabled = true; player.classList.remove('walking', 'riding'); player.classList.add('stepping', 'entering'); player.style.transition = reduced ? 'none' : 'left .65s ease-in-out, top .65s ease-in-out'; player.style.left = (p.x - (index === 3 ? 30 : m.width < 650 ? 12 : 22)) + 'px'; player.style.top = (p.y - (index === 3 ? 20 : m.width < 650 ? 35 : 12)) + 'px'; $('#transition-veil span').textContent = `ENTERING ${HOUSES[index].name.toUpperCase()}`;
    setTimeout(() => { $('#transition-veil').classList.add('active'); setTimeout(() => {
      if (!game.arrive()) return; const h = HOUSES[index]; room.dataset.kind = h.kind; room.dataset.route = game.path || ''; $('#room-location').textContent = `${String(index + 1).padStart(2, '0')} / ${h.name.toUpperCase()}`; $('#pov-hint').textContent = h.kind === 'alumni' ? 'ALUMNI LIBRARY / PICK A BOOK' : h.kind === 'pathway' ? 'PATHWAY HOUSE / CHOOSE A DOOR' : 'INSIDE THE HOUSE';
      CohortRooms.render(index, game, { exit: exitRoom, choosePath, discover }); updateTimeline(index); document.body.classList.add('inside'); room.showModal(); sound.setScene({ phase: 'room' }); room.append(cursor); $('.room-scroll').scrollTop = 0; $('#exit-room').focus({ preventScroll: true }); player.classList.remove('stepping', 'entering'); refreshPath(); $('#transition-veil').classList.remove('active'); announce(`Inside ${h.name}. Use Exit to return to the road.`);
    }, reduced ? 0 : 270); }, reduced ? 0 : 680);
  }
  function choosePath(path) { if (!game.choosePath(path)) return; discover(['overview', 'work', 'support']); refreshPath(); announce(`${TRACKS[path].label} selected. Both Code and Low-code are available on your road.`); exitRoom(path); }
  function exitRoom(chosenPath) {
    if (!game.exit()) return; sound.setScene({ phase: 'exiting' }); const hasDoor = typeof chosenPath === 'string' && PATHS.includes(chosenPath); if (hasDoor) room.classList.add('pathway-leaving');
    setTimeout(() => { room.style.opacity = '0'; document.body.append(cursor); setTimeout(() => {
      document.body.append($('#exploration-toast')); room.close(); room.style.opacity = ''; room.classList.remove('pathway-leaving'); document.body.classList.remove('inside'); player.style.transition = 'none'; game.resume(); unfreeze(); if (m.width !== document.documentElement.clientWidth || m.height !== innerHeight) layout(); else update(); $('#nearby-enter').disabled = false; returnFocus?.focus({ preventScroll: true }); announce(hasDoor ? `You’re on the ${TRACKS[game.path].label} road. Scroll to continue.` : 'Back on the road. Scroll to continue.');
    }, reduced ? 0 : 230); }, hasDoor && !reduced ? 550 : 0);
  }
  $('#exit-room').addEventListener('click', () => exitRoom()); room.addEventListener('cancel', e => { e.preventDefault(); exitRoom(); }); $('#nearby-enter').addEventListener('click', () => { if (nearest >= 0) enterHouse(nearest, $('#nearby-enter')); }); $('#path-switch').addEventListener('click', () => { if (game.phase === 'road') enterHouse(3, $('#path-switch')); });
  $('#map-toggle').addEventListener('click', () => { if (game.phase !== 'road') return; mapScroll = window.scrollY; document.body.style.overflow = 'hidden'; map.showModal(); map.append(cursor); $('#close-map').focus({ preventScroll: true }); });
  function closeMap(focus = true) { map.close(); document.body.append(cursor); document.body.style.overflow = ''; window.scrollTo(0, mapScroll); if (m.width !== document.documentElement.clientWidth || m.height !== innerHeight) layout(); if (focus) $('#map-toggle').focus({ preventScroll: true }); }
  $('#close-map').addEventListener('click', () => closeMap()); map.addEventListener('cancel', e => { e.preventDefault(); closeMap(); }); map.addEventListener('click', e => { if (e.target === map) { const r = map.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeMap(); } });
  $('#finish-explore').addEventListener('click', () => { const i = HOUSES.findIndex((_, n) => game.houseScore(n) < 10); if (i >= 0) enterHouse(i, $('#finish-explore')); });
  $('#replay').addEventListener('click', () => { if (game.phase === 'road') window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }); }); $('.hud .logo').addEventListener('click', e => { e.preventDefault(); if (game.phase === 'road') window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }); });
  window.addEventListener('keydown', e => { if (game.phase !== 'road' || map.open) return; if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'SUMMARY'].includes(document.activeElement?.tagName)) return; if (e.key === 'Enter' && nearest >= 0) { e.preventDefault(); enterHouse(nearest, $('#nearby-enter')); } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); window.scrollBy({ top: e.key === 'ArrowDown' ? 95 : -95, behavior: reduced ? 'instant' : 'smooth' }); } });
  window.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || innerWidth <= 650) return; document.documentElement.classList.add('custom-cursor'); cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.classList.toggle('interactive', !!e.target.closest('button,a,summary')); }, { passive: true }); document.addEventListener('pointerout', e => { if (!e.relatedTarget) document.documentElement.classList.remove('custom-cursor'); });
  layout(); let loaded = 0, bootDone = false, wantSkip = false, assetsSettled = false;
  const assets = [...new Set(META.map(h => h.asset)), 'prop-desk', 'prop-computer', 'prop-noticeboard', 'gear-toolkit', 'gear-backpack', 'gear-badge', 'engineer-walk', 'pine', 'broadleaf', 'deer', 'rabbit', 'fox', 'workshop-interior', 'pathway-lodge', 'boat-with-seated-engineer', 'dock', 'river-crossing-terrain', 'river-current', 'reception', 'siddhant', 'book', 'pathway-hall-interior', 'alumni-library-interior'];
  Promise.all(assets.map(name => new Promise(resolve => { const img = new Image(); img.onload = img.onerror = () => { loaded++; resolve(); }; img.src = asset(`assets/${name}.webp`); }))).then(() => { assetsSettled = true; }); const bootStart = performance.now();
  function finishBoot() { if (bootDone) return; bootDone = true; $('#load-percent').textContent = '100'; $('.boot-bar>span').style.width = '100%'; $('.boot-bar').setAttribute('aria-valuenow', '100'); $('.power-avatar').style.setProperty('--charge', '100%'); $('.power-avatar').style.setProperty('--power-scale', '1'); $('#load-label').textContent = 'Powered up. Your journey starts at 0x.'; setTimeout(() => { $('#power-screen').classList.add('departing'); document.body.classList.remove('booting'); game.ready(); window.scrollTo(0, 0); update(); $('#start').classList.add('arrived'); setTimeout(() => { $('#power-screen').hidden = true; $('#power-screen').style.display = 'none'; $('#map-toggle').focus({ preventScroll: true }); }, reduced ? 0 : 600); }, wantSkip || reduced ? 0 : 550); }
  function charge(now) { if (bootDone) return; const animation = clamp((now - bootStart) / 2400, 0, 1), percent = Math.floor(Math.min(animation, loaded / assets.length) * 100); $('#load-percent').textContent = percent; $('.boot-bar>span').style.width = percent + '%'; $('.boot-bar').setAttribute('aria-valuenow', percent); $('.power-avatar').style.setProperty('--charge', percent + '%'); $('.power-avatar').style.setProperty('--power-scale', String(Math.max(.05, percent / 100))); $('#load-label').textContent = percent < 40 ? 'Building your world…' : percent < 80 ? 'Bringing your character to life…' : 'Ready for your first step.'; if ((assetsSettled && (animation === 1 || wantSkip || reduced)) || now - bootStart > 8500) { finishBoot(); return; } requestAnimationFrame(charge); }
  $('#skip-intro').addEventListener('click', () => { wantSkip = true; if (assetsSettled) finishBoot(); }); requestAnimationFrame(charge);
})();
