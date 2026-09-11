(function (root) {
  'use strict';
  const { HOUSES, OVERVIEW, TRACKS, MATURITY, MENTORS, BOOKS, PEOPLE, COMPANIES, UNIVERSITIES, PAGE_TITLES } = CohortContent;
  const { META, PATH_COMPARISON } = ExplorationContent;
  const asset = key => root.PREVIEW_ASSETS?.[key] || key;
  function el(tag, cls, text) {
    const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n;
  }
  function image(name, cls, alt = '') { const n = el('img', cls); n.src = asset(`assets/${name}.webp`); n.alt = alt; return n; }
  function button(text, cls, action) { const n = el('button', cls, text); n.type = 'button'; n.addEventListener('click', action); return n; }
  function details(title) { const d = el('details', 'room-extra'); const s = el('summary', '', title); s.append(el('span', '', '+')); d.append(s); return d; }
  function table(headers, rows) {
    const wrap = el('div', 'table-wrap'); wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', headers.join(', '));
    const t = el('table'), head = el('thead'), tr = el('tr'); headers.forEach(h => { const th = el('th', '', h); th.scope = 'col'; tr.append(th); }); head.append(tr);
    const body = el('tbody'); rows.forEach(row => { const r = el('tr'); row.forEach(c => r.append(el('td', '', c))); body.append(r); }); t.append(head, body); wrap.append(t); return wrap;
  }
  function features(items) {
    const list = el('div', 'room-features'); items.forEach(([title, body], i) => {
      const row = el('section', 'feature-row'), copy = el('div'); copy.append(el('h3', '', title), el('p', '', body)); row.append(el('span', '', String(i + 1).padStart(2, '0')), copy); list.append(row);
    }); return list;
  }
  function brochure(pages) {
    const d = details('Open the brochure pages in this house'); d.classList.add('brochure-folio');
    d.append(el('p', 'folio-caption', 'Applied AI Mastery · Cohort 9. Browse the original pages for every detail.'));
    const nav = el('div', 'folio-nav'), view = el('figure', 'folio-page'), caption = el('figcaption'), img = el('img'), viewport = el('div', 'folio-image-viewport'); img.loading = 'lazy'; viewport.tabIndex = 0; viewport.setAttribute('aria-label', 'Brochure page; scroll to pan when zoomed');
    const pageButtons = [];
    function show(n, open = false) {
      img.src = asset(`assets/brochure-${String(n).padStart(2, '0')}.webp`); img.alt = `Brochure page ${n}: ${PAGE_TITLES[n - 1]}`;
      caption.textContent = `PAGE ${String(n).padStart(2, '0')} · ${PAGE_TITLES[n - 1]}`; viewport.scrollTop = 0; viewport.scrollLeft = 0;
      pageButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.page) === n)));
      if (open) { d.open = true; d.scrollIntoView({ block: 'start', behavior: 'instant' }); }
    }
    pages.forEach(n => { const b = button(String(n).padStart(2, '0'), '', () => show(n)); b.dataset.page = n; b.setAttribute('aria-label', `Page ${n}: ${PAGE_TITLES[n - 1]}`); pageButtons.push(b); nav.append(b); });
    const zoom = button('Zoom page +', 'folio-zoom', () => { const on = viewport.classList.toggle('is-zoomed'); zoom.textContent = on ? 'Fit page −' : 'Zoom page +'; zoom.setAttribute('aria-pressed', String(on)); }); zoom.setAttribute('aria-pressed', 'false'); viewport.append(img); view.append(caption, zoom, viewport); d.append(nav, view); show(pages[0]); return { node: d, show };
  }
  function welcome(host) {
    const reception = el('section', 'reception-scene');
    const speech = el('div', 'comic-bubble reception-bubble'); speech.append(el('span', 'eyebrow', 'SRIDEV · YOUR WELCOME GUIDE'), el('p', '', 'Welcome! Here’s the whole cohort at a glance. Take a look at the desk, then make yourself at home.'));
    const npc = image('reception', 'reception-npc', 'Game character of Sridev Ramesh waiting behind a reception desk');
    reception.append(speech, npc);
    const board = el('div', 'desk-board'); board.append(el('span', 'eyebrow', 'APPLIED AI MASTERY / COHORT 9'), el('h3', '', 'Your cohort overview.'));
    const grid = el('div', 'overview-grid'); OVERVIEW.forEach(([v, label]) => { const c = el('div', 'overview-cell'); c.append(el('strong', '', v), el('span', '', label)); grid.append(c); });
    board.append(grid, el('p', 'fine-print', '3-cohort access means your live cohort plus recordings and updates from the following two cohorts.')); reception.append(board); host.append(reception);
  }
  function pathSummary(host) {
    const compare = el('section', 'pathway-compare');
    compare.append(el('span', 'eyebrow', 'FIRST, CHOOSE WHAT YOU ARE BUILDING TOWARDS'), el('h3', '', 'Find the road that fits your goal.'), table(['Your decision', 'Entrepreneurship', 'Career Accelerator'], PATH_COMPARISON));
    host.append(compare);
  }
  function syncExecution(game, key) {
    if (!game.chooseExecution(key)) return;
    const host = document.getElementById('room-content');
    host.querySelectorAll('[data-execution]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.execution === key)));
    host.querySelectorAll('.execution-columns').forEach(c => { c.dataset.focus = key; });
    host.querySelectorAll('.build-choice-summary').forEach(n => { n.textContent = executionLabel(key); });
  }
  function executionLabel(key) { return `Your build approach: ${key === 'code' ? 'Code' : 'Low-code / No-code'}. You can compare and change it in the learning houses.`; }
  function executionChoice(host, game) {
    const section = el('section', 'execution-choice');
    section.append(el('span', 'eyebrow', 'THEN, CHOOSE HOW YOU BUILD'), el('h3', '', 'Either approach works on either road.'));
    const choices = el('div', 'build-choice-grid'), selected = el('p', 'build-choice-summary');
    const options = [['code', 'Code', 'Write, debug and control your implementation with AI-assisted coding.'], ['lowcode', 'Low-code / No-code', 'Connect visual tools, configure workflows and build with less manual code.']];
    const buttons = [];
    function select(key) { syncExecution(game, key); buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.execution === key))); selected.textContent = executionLabel(key); }
    options.forEach(([key, title, copy]) => { const b = button('', 'build-choice', () => select(key)); b.dataset.execution = key; b.append(el('strong', '', title), el('span', '', copy)); buttons.push(b); choices.append(b); });
    section.append(choices, selected); host.append(section); select(game.execution);
  }
  function pathway(host, game, choose) {
    pathSummary(host); executionChoice(host, game);
    const scene = el('section', 'pathway-scene');
    const speech = el('div', 'comic-bubble pathway-bubble'); speech.append(el('span', 'eyebrow', 'SIDDHANT · YOUR PATHWAY GUIDE'), el('p', '', 'Choose Entrepreneurship to validate and grow a venture, or Career Accelerator to build your portfolio and prepare for AI roles. Your Code or Low-code preference works with either choice.'));
    const npc = image('siddhant', 'pathway-npc', 'Game character of Siddhant Goswami standing between two doors');
    const doors = el('div', 'pathway-doors');
    Object.entries(TRACKS).forEach(([key, track]) => {
      const door = button('', `path-door ${key}-door`, () => {
        scene.dataset.chosen = key; doors.querySelectorAll('button').forEach(b => b.disabled = true); choose(key);
      });
      door.setAttribute('aria-label', `Choose the ${track.label} door`);
      door.append(el('span', 'door-number', key === 'entrepreneurship' ? 'DOOR 01' : 'DOOR 02'), el('strong', '', track.label), el('span', 'door-for', track.audience), el('span', 'door-action', game.path === key ? 'Continue this road →' : 'Choose this road →'));
      doors.append(door);
    }); scene.append(speech, npc, doors); host.append(scene);
    host.append(el('p', 'fine-print', 'The doors personalise this website’s journey. Your cohort track is discussed with the team during LaunchPad and placement.'));
  }
  function comparison(host, h, game) {
    const goal = el('section', `goal-context ${game.path}`); goal.append(el('span', 'eyebrow', TRACKS[game.path].label), el('h3', '', 'Bring it back to your goal.'), el('p', '', h.goals[game.path])); host.append(goal);
    const section = el('section', 'execution-section'); section.append(el('span', 'eyebrow', 'CHOOSE HOW YOU BUILD'), el('h3', '', 'Code or Low-code. Same foundation.'));
    section.append(el('p', 'execution-intro', 'Both execution paths are available on either road. Compare the tools and depth of implementation below.'));
    const tabs = el('div', 'execution-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Execution path to focus on');
    const columns = el('div', 'execution-columns'); let buttons = [];
    function focus(path) { syncExecution(game, path); columns.dataset.focus = path; buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.execution === path))); }
    [['code', 'Code'], ['lowcode', 'Low-code / No-code']].forEach(([key, label]) => { const b = button(label, '', () => focus(key)); b.dataset.execution = key; buttons.push(b); tabs.append(b); });
    ['code', 'lowcode'].forEach((key, j) => {
      const c = el('div', `execution-column ${key}`); c.append(el('span', 'eyebrow', j ? 'LOW-CODE / NO-CODE' : 'CODE'), el('h4', '', j ? 'Connect. Configure. Build.' : 'Implement. Control. Scale.'));
      h.compare.forEach(row => { const f = el('section'); f.append(el('strong', '', row[0]), el('p', '', row[j + 1])); c.append(f); }); columns.append(c);
    }); section.append(tabs, columns); focus(game.execution); host.append(section);
  }
  function curriculum(h) {
    const d = details(`Explore weeks ${h.weeks[0]}–${h.weeks[1]}`), list = el('div', 'curriculum-weeks');
    for (let w = h.weeks[0]; w <= h.weeks[1]; w++) { const data = COHORT_WEEKS[w - 1], row = el('section', 'curriculum-week'); row.append(el('span', 'eyebrow', `WEEK ${String(w).padStart(2, '0')}`), el('h4', '', data[0]), el('p', '', data[1])); const tags = el('div', 'tool-tags'); data[2].forEach(t => tags.append(el('span', '', t))); row.append(tags, el('p', 'week-work', `Your work: ${data[3]}`)); list.append(row); }
    d.append(list, el('p', 'fine-print', 'Week sequence follows the uploaded In-Depth Curriculum C9. Final sprint dates are confirmed by the cohort team.')); return d;
  }
  function alumni(host, folio) {
    const section = el('section', 'alumni-bookshelf'); section.append(el('span', 'eyebrow', 'THE COMMUNITY BOOKSHELF'), el('h3', '', 'Pick a story.'));
    const tabs = el('div', 'book-tabs'), shelf = el('div', 'book-grid'), reader = el('article', 'open-book'); reader.hidden = true; reader.setAttribute('aria-label', 'Selected community story');
    const options = ['Outcomes', 'Projects', 'Community']; let tabButtons = [];
    function openBook(book, trigger) {
      reader.replaceChildren(); reader.hidden = false;
      const heading = el('h3', '', book.name); heading.tabIndex = -1;
      reader.append(el('span', 'eyebrow', book.tag), heading, el('h4', '', book.title), el('p', '', book.body));
      const actions = el('div', 'book-actions'); actions.append(button('Read the original profile ↗', '', () => folio.show(book.page, true)), button('Close book', 'text-button', () => { reader.hidden = true; trigger.setAttribute('aria-expanded', 'false'); trigger.focus({ preventScroll: true }); }));
      reader.append(actions, el('span', 'fine-print', `Reported in the Cohort 9 brochure, page ${book.page}. ${book.shelf === 'Community' ? 'A community practitioner profile.' : 'An individual story; outcomes vary.'}`));
      shelf.querySelectorAll('button').forEach(b => b.setAttribute('aria-expanded', String(b === trigger))); heading.focus({ preventScroll: true }); reader.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
    function showShelf(name) {
      shelf.replaceChildren(); reader.hidden = true; tabButtons.forEach(b => b.setAttribute('aria-pressed', String(b.textContent === name)));
      BOOKS.filter(b => b.shelf === name).forEach((book, i) => { const b = button('', `alumni-book book-colour-${i % 4}`, () => openBook(book, b)); b.setAttribute('aria-expanded', 'false'); const cover = el('span', 'book-art'); cover.append(image('book', '', '')); b.append(cover, el('span', 'book-shelf-tag', book.tag), el('strong', '', book.name), el('span', 'book-title', book.title), el('span', 'book-open-label', 'Open book ↗')); shelf.append(b); });
    }
    options.forEach(name => { const b = button(name, '', () => showShelf(name)); tabButtons.push(b); tabs.append(b); }); section.append(tabs, shelf, reader); showShelf('Outcomes'); host.append(section);
    const companies = details('The companies and people around you'); companies.open = true;
    companies.append(el('p', '', 'A community of working professionals, founders and alumni. Roles below are listed in the brochure; this is a community directory, not a placement list.'), table(['Company', 'Community member', 'Role in the brochure'], PEOPLE));
    const employerList = details('More companies represented in the community'); const rows = []; for (let i = 0; i < COMPANIES.length; i += 3) rows.push(COMPANIES.slice(i, i + 3)); employerList.append(table(['Company', 'Company', 'Company'], rows)); companies.append(employerList);
    const schools = el('div', 'alma-mater'); schools.append(el('h4', '', 'Alma mater across the community')); const tags = el('div', 'tool-tags'); UNIVERSITIES.forEach(s => tags.append(el('span', '', s))); schools.append(tags); companies.append(schools); host.append(companies);
  }
  function renderReference(index, game, handlers) {
    const h = HOUSES[index], host = document.getElementById('room-content'); host.replaceChildren();
    const header = el('header'); header.append(el('span', 'eyebrow', h.stage)); const title = el('h2', '', h.title); title.id = 'room-title'; header.append(title, el('p', 'room-intro', h.intro)); host.append(header);
    const folioPages = h.kind === 'alumni' ? [19, ...h.pages] : h.pages;
    const folio = brochure(folioPages);
    if (h.kind === 'welcome') welcome(host);
    if (h.kind === 'pathway') pathway(host, game, handlers.choosePath);
    if (h.kind === 'learning') comparison(host, h, game);
    if (h.kind === 'alumni') alumni(host, folio);
    host.append(features(h.features));
    if (h.kind === 'welcome') { const d = details('What changes as you become AI-native?'); d.append(table(['Dimension', 'AI Curious', 'AI Literate', 'AI Native'], MATURITY)); host.append(d); }
    if (h.weeks) host.append(curriculum(h));
    if (h.kind === 'mentors') { const d = details('Meet the faculty & track mentors'); d.open = true; const grid = el('div', 'mentor-grid'); MENTORS.forEach(([name, role, bio]) => { const card = el('section'); card.append(el('h3', '', name), el('span', 'eyebrow', role), el('p', '', bio)); grid.append(card); }); d.append(grid); host.append(d); }
    if (h.kind === 'launchpad') {
      const schedule = details('Class schedule & weekly commitment'); schedule.append(table(['When', 'What to expect'], [['Friday & Saturday', 'Live classes · 90–120 minutes'], ['Monday–Thursday', 'Two office-hour sessions each week'], ['Throughout the cohort', 'Specialised labs on emerging technology'], ['24 weeks / 6 months', '8–12 hours a week for live learning and building']]));
      schedule.append(el('p', 'fine-print', 'The brochure’s eligibility page says 8–10 hours; its schedule recommends 8–12. Allow 8–12 when planning.')); host.append(schedule);
      const official = el('a', 'source-link', 'Check the official cohort website ↗'); official.href = 'https://www.100xengineers.com/'; official.target = '_blank'; official.rel = 'noopener'; host.append(official);
    }
    if (h.kind === 'learning') { const note = el('p', 'fine-print', 'Execution-path tools follow the brochure and the official 100xEngineers website. The examples above explain how to apply the shared curriculum to your goal.'); const source = el('a', '', ' View the official tool stack ↗'); source.href = 'https://www.100xengineers.com/'; source.target = '_blank'; source.rel = 'noopener'; note.append(source); host.append(note); }
    host.append(folio.node);
    if (h.links) { const links = el('div', 'room-links'); const mail = el('a', '', 'Email the cohort team ↗'); mail.href = 'mailto:info@100xengineers.com'; const tel = el('a', '', '+91 98800 36985'); tel.href = 'tel:+919880036985'; links.append(mail, tel); host.append(links); }
    const footer = el('div', 'room-foot'); footer.append(el('span', '', h.note), button(h.kind === 'pathway' && !game.path ? 'Back to the crossroads →' : 'Back to the journey →', '', handlers.exit)); host.append(footer);
  }
  function objectContent(index, id, panel, game) {
    const h = HOUSES[index];
    const selectedFeatures = items => panel.append(features(items));
    if (index === 0) {
      if (id === 'overview') welcome(panel);
      else if (id === 'work') { selectedFeatures([h.features[2]]); panel.append(table(['Dimension', 'AI Curious', 'AI Literate', 'AI Native'], MATURITY)); }
      else selectedFeatures(h.features.slice(0, 2));
    } else if (index === 1) {
      if (id === 'overview') selectedFeatures(h.features.slice(0, 2));
      else if (id === 'work') selectedFeatures(h.features.slice(2, 5));
      else { selectedFeatures(h.features.slice(5)); panel.append(table(['When', 'What to expect'], [['Friday & Saturday', 'Live classes · 90–120 minutes'], ['Monday–Thursday', 'Two office-hour sessions each week'], ['Throughout the cohort', 'Specialist labs and hands-on building']])); }
    } else if (index === 2) {
      if (id === 'overview') selectedFeatures(h.features.slice(0, 3));
      else if (id === 'work') { const c = curriculum(h); c.open = true; panel.append(c); }
      else selectedFeatures(h.features.slice(3));
    } else if (index === 3) {
      if (id === 'overview') pathSummary(panel);
      else if (id === 'work') executionChoice(panel, game);
      else { Object.values(TRACKS).forEach(track => { panel.append(el('h4', '', track.label)); const list = el('ul', 'discovery-list'); track.benefits.forEach(item => list.append(el('li', '', item))); panel.append(list); }); }
    } else if (index >= 4 && index <= 6) {
      if (id === 'overview') comparison(panel, h, game);
      else if (id === 'work') { const c = curriculum(h); c.open = true; panel.append(c); }
      else { panel.append(el('p', 'discovery-lead', h.goals[game.path])); selectedFeatures(h.features); }
    } else if (index === 7) {
      if (id === 'overview') { const grid = el('div', 'mentor-grid'); MENTORS.forEach(([name, role, bio]) => { const c = el('section'); c.append(el('h3', '', name), el('span', 'eyebrow', role), el('p', '', bio)); grid.append(c); }); panel.append(grid); }
      else selectedFeatures(id === 'work' ? h.features.slice(0, 3) : h.features.slice(3));
    } else if (index === 8) {
      selectedFeatures(id === 'overview' ? h.features.slice(0, 2) : id === 'work' ? h.features.slice(2, 5) : h.features.slice(5));
      if (id === 'support') panel.append(el('p', 'fine-print', h.note));
    } else {
      if (id === 'overview') { const folio = brochure([19, ...h.pages]); alumni(panel, folio); panel.append(folio.node); }
      else if (id === 'work') selectedFeatures(h.features.slice(0, 3));
      else { selectedFeatures(h.features.slice(3)); panel.append(table(['Company', 'Community member', 'Role in the brochure'], PEOPLE)); }
    }
  }
  function render(index, game, handlers) {
    renderReference(index, game, handlers);
    const host = document.getElementById('room-content'), nodes = Array.from(host.children), header = nodes.shift(), footer = nodes.pop(), meta = META[index];
    const reference = details('Read everything in this house'); reference.classList.add('complete-house-details'); nodes.forEach(n => reference.append(n));
    host.replaceChildren(header);
    const snapshot = el('dl', 'house-snapshot');
    [['When', meta.when], ['Your focus', meta.focus], ['You leave with', meta.outcome]].forEach(([label, copy]) => { const cell = el('div'); cell.append(el('dt', '', label), el('dd', '', copy)); snapshot.append(cell); }); host.append(snapshot);
    if (index === 0) { const scene = el('div', 'welcome-host'); scene.append(image('reception', '', 'Sridev welcoming you at the reception desk'), el('p', 'comic-bubble', 'Welcome to the village. The reception desk has your cohort overview. Explore the objects below, then follow your curiosity.')); host.append(scene); }
    if (index === 3) pathway(host, game, handlers.choosePath);
    const section = el('section', 'room-exploration'); section.append(el('span', 'eyebrow', 'EXPLORE THE ROOM'), el('h3', '', index === 9 ? 'A library full of next chapters.' : 'Every object has something to tell you.'), el('p', 'exploration-instruction', 'Open an object to explore. Each first discovery adds 2x to your journey.'));
    const status = el('div', 'room-exploration-status'); status.dataset.houseScore = index; section.append(status);
    const objects = el('div', 'room-objects'), panel = el('section', 'discovery-panel'); panel.id = `discovery-panel-${index}`; panel.hidden = true; const buttons = [];
    const refresh = () => { status.textContent = `${game.houseScore(index)} / 10x earned here · ${meta.objects.filter(([id]) => game.hasDiscovered(index, id)).length} / 3 discoveries`; buttons.forEach(b => { const done = game.hasDiscovered(index, b.dataset.discovery); b.classList.toggle('discovered', done); b.querySelector('.object-reward').textContent = done ? 'Discovered ✓' : 'Discover +2x'; }); };
    meta.objects.forEach(([id, art, title, copy]) => {
      const b = button('', 'room-object', () => {
        handlers.discover(id); panel.replaceChildren(); panel.hidden = false;
        buttons.forEach(x => x.setAttribute('aria-expanded', String(x === b)));
        const top = el('div', 'discovery-top'), heading = el('h3', '', title); heading.tabIndex = -1;
        top.append(heading, button('Close ×', 'close-discovery', () => { panel.hidden = true; b.setAttribute('aria-expanded', 'false'); b.focus({ preventScroll: true }); })); panel.append(top);
        objectContent(index, id, panel, game); refresh(); heading.focus({ preventScroll: true }); panel.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      });
      b.dataset.discovery = id; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', panel.id); b.append(image(art, 'object-art'), el('strong', '', title), el('span', 'object-copy', copy), el('span', 'object-reward')); buttons.push(b); objects.append(b);
    });
    section.append(objects, panel); host.append(section, reference, footer); refresh();
    reference.addEventListener('toggle', () => { if (reference.open && host.contains(reference) && game.house === index) { handlers.discover(['overview', 'work', 'support']); refresh(); } });
  }
  root.CohortRooms = { render };
})(window);
