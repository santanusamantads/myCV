/* ===== Dynamic CV =====
   Data priority: browser localStorage (your edits)  >  data.json (published)  >  DEFAULTS below. */
const KEY = 'cv-data-v1';

const DEFAULT_ORDER = ['about', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

const DEFAULTS = {
  profile: { name: 'Santanu Samanta', title: 'M.Sc. Data Science and AI Student', summary: 'First-semester M.Sc. Data Science and Artificial Intelligence student with a B.Sc. background in Physics.',
             email: '', phone: '', location: 'Belur, West Bengal, India', photo: '' },
  links: [{ label: 'GitHub', url: 'https://github.com/santanusamantads' }],
  about: 'First-semester M.Sc. Data Science and Artificial Intelligence student with a B.Sc. background in Physics. Building a strong foundation in machine learning, statistics, linear algebra, optimization, and data structures and algorithms. Hands-on experience implementing machine learning algorithms from scratch and working with regression and classification problems using Python.',
  experience: [],
  education: [
    { degree: 'M.Sc. in Data Science and Artificial Intelligence', school: 'Ramakrishna Mission Vivekananda Educational and Research Institute (RKMVERI)', period: '2026 – 2028', details: 'Focus on Machine Learning, Statistical Inference, and AI' },
    { degree: 'B.Sc. in Physics', school: 'Ramakrishna Mission Vivekananda Centenary College (RKMVCC), Rahara', period: '2026', details: 'CGPA: 7.24/10 (66.97%)' }
  ],
  skills: [
    { name: 'Python', level: 0 },
    { name: 'Machine Learning', level: 0 },
    { name: 'Data Structures & Algorithms', level: 0 },
    { name: 'Linear Algebra & Optimization', level: 0 }
  ],
  projects: [
    { name: 'Custom Machine Learning Algorithms - From Scratch', link: '', description: 'Implemented KNN and multi-class Logistic Regression from scratch, building sigmoid functions, distance calculations, and gradient-descent optimization.', tech: 'Python' },
    { name: 'Regularized Predictive Modeling', link: '', description: 'Built a regression workflow using polynomial features to model non-linear relationships and applied LASSO (L1) regularization.', tech: 'Python' }
  ],
  certifications: [],
  languages: [{ name: 'English', level: 90 }],
  settings: {
    accent: '#2563eb',
    theme: 'dark',
    showLevels: false,
    order: [...DEFAULT_ORDER],
    show: { about: true, experience: false, education: true, skills: true, projects: true, certifications: false, languages: true }
  }
};

/* Section definitions: drives both rendering and the editor form */
const LISTS = {
  experience:     { title: 'Experience',     fields: [['role','Role'],['company','Company'],['period','Period'],['details','Details (one bullet per line)','area']] },
  education:      { title: 'Education',      fields: [['degree','Degree'],['school','School'],['period','Period'],['details','Details (one bullet per line)','area']] },
  skills:         { title: 'Skills',         fields: [['name','Skill'],['level','Level 0-100','num']] },
  projects:       { title: 'Projects',       fields: [['name','Name'],['link','Link (https://…)'],['description','Description','area'],['tech','Tech (comma separated)']] },
  certifications: { title: 'Certifications', fields: [['name','Name'],['issuer','Issuer'],['year','Year']] },
  languages:      { title: 'Languages',      fields: [['name','Language'],['level','Level 0-100','num']] }
};
const TITLES = { about: 'About', ...Object.fromEntries(Object.entries(LISTS).map(([k, v]) => [k, v.title])) };

let data = structuredClone(DEFAULTS);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^(https?:|mailto:|tel:)/i.test(u || '') ? u : (u && /^[\w.-]+\.[a-z]{2,}/i.test(u) ? 'https://' + u : '');
const lines = t => String(t || '').split('\n').map(s => s.trim()).filter(Boolean);
const merge = (base, over) => {
  const out = structuredClone(base);
  for (const k in over || {}) {
    out[k] = (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && typeof base[k] === 'object' && !Array.isArray(base[k]))
      ? merge(base[k], over[k])
      : over[k];
  }
  return out;
};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { alert('Could not save (storage full?). Use a smaller photo or download data.json.'); } };

/* ---------- Render CV ---------- */
function render() {
  const p = data.profile, s = data.settings;
  if (!s.order) s.order = [...DEFAULT_ORDER];
  if (s.showLevels === undefined) s.showLevels = false;

  document.documentElement.style.setProperty('--accent', s.accent);
  document.documentElement.dataset.theme = s.theme;
  document.title = (p.name || 'CV') + ' – CV';

  const chips = [];
  if (p.location) chips.push(`<span class="chip">📍 ${esc(p.location)}</span>`);
  if (p.email) chips.push(`<a class="chip" href="mailto:${esc(p.email)}">✉ ${esc(p.email)}</a>`);
  if (p.phone) chips.push(`<a class="chip" href="tel:${esc(p.phone)}">☎ ${esc(p.phone)}</a>`);
  data.links.forEach(l => { const u = safeUrl(l.url); if (l.label) chips.push(u ? `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>` : `<span class="chip">${esc(l.label)}</span>`); });

  let html = `<section class="hero" id="top">
    ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}">` : `<div class="avatar">👤</div>`}
    <div><h1>${esc(p.name)}</h1><div class="title">${esc(p.title)}</div><p>${esc(p.summary)}</p><div class="chips">${chips.join('')}</div></div></section>`;

  const visible = s.order.filter(k => s.show[k]);
  for (const k of visible) html += `<section id="${k}"><h2>${TITLES[k]}</h2>${renderSection(k)}</section>`;
  $('#cv').innerHTML = html;
  $('#nav').innerHTML = visible.map(k => `<a href="#${k}">${TITLES[k]}</a>`).join('');
}

function renderSection(k) {
  if (k === 'about') return data.about ? `<p>${esc(data.about).replace(/\n/g, '<br>')}</p>` : '<p class="empty">Nothing here yet.</p>';
  const list = data[k];
  if (!list.length) return '<p class="empty">Nothing here yet.</p>';
  const bullets = d => lines(d).length ? `<ul>${lines(d).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';

  if (k === 'skills' || k === 'languages') {
    if (data.settings.showLevels) {
      return `<div class="grid">${list.map(i => `<div><div class="row" style="display:flex;justify-content:space-between"><span>${esc(i.name)}</span><span class="when">${+i.level || 0}%</span></div><div class="bar"><i style="width:${Math.min(100, Math.max(0, +i.level || 0))}%"></i></div></div>`).join('')}</div>`;
    }
    return `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${list.map(i => `<span class="chip" style="font-size:0.95rem; padding:0.4rem 0.8rem;">${esc(i.name)}</span>`).join('')}</div>`;
  }

  return list.map(i => {
    if (k === 'experience') return `<div class="item"><div class="row"><h3>${esc(i.role)}</h3><span class="when">${esc(i.period)}</span></div><div class="sub">${esc(i.company)}</div>${bullets(i.details)}</div>`;
    if (k === 'education') return `<div class="item"><div class="row"><h3>${esc(i.degree)}</h3><span class="when">${esc(i.period)}</span></div><div class="sub">${esc(i.school)}</div>${bullets(i.details)}</div>`;
    if (k === 'projects') { const u = safeUrl(i.link); return `<div class="item"><div class="row"><h3>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(i.name)} ↗</a>` : esc(i.name)}</h3></div><div>${esc(i.description)}</div><div class="tags">${String(i.tech || '').split(',').map(t => t.trim()).filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('')}</div></div>`; }
    if (k === 'certifications') return `<div class="item"><div class="row"><h3>${esc(i.name)}</h3><span class="when">${esc(i.year)}</span></div><div class="sub">${esc(i.issuer)}</div></div>`;
  }).join('');
}

/* ---------- Editor ---------- */
const input = (label, val, attrs = '') => `<label>${label}</label><input type="text" value="${esc(val)}" ${attrs}>`;

function buildEditor() {
  const p = data.profile, s = data.settings;
  if (!s.order) s.order = [...DEFAULT_ORDER];
  if (s.showLevels === undefined) s.showLevels = false;

  let h = `<details open><summary>Profile</summary>
    <div class="photo-row"><img id="photoPrev" src="${esc(p.photo)}" alt="" ${p.photo ? '' : 'hidden'}>
      <div><input type="file" id="photoFile" accept="image/*"><br><button id="photoClear" style="margin-top:.4rem">Remove photo</button></div></div>
    ${input('Full name', p.name, 'data-p="name"')}${input('Job title', p.title, 'data-p="title"')}
    <label>Short summary</label><input type="text" value="${esc(p.summary)}" data-p="summary">
    ${input('Email', p.email, 'data-p="email"')}${input('Phone', p.phone, 'data-p="phone"')}${input('Location', p.location, 'data-p="location"')}</details>`;

  h += `<details><summary>Links (GitHub, LinkedIn…)</summary>${data.links.map((l, i) => `<div class="card">${input('Label', l.label, `data-l="${i}" data-f="label"`)}${input('URL', l.url, `data-l="${i}" data-f="url"`)}<div class="tools"><button data-act="del" data-list="links" data-i="${i}">Delete</button></div></div>`).join('')}<button data-act="add" data-list="links">+ Add link</button></details>`;

  h += `<details><summary>About</summary><label>About me</label><textarea data-about>${esc(data.about)}</textarea></details>`;

  for (const [k, def] of Object.entries(LISTS)) {
    h += `<details><summary>${def.title}</summary>` + data[k].map((item, i) => `<div class="card">` + def.fields.map(([f, label, type]) =>
      type === 'area' ? `<label>${label}</label><textarea data-list="${k}" data-i="${i}" data-f="${f}">${esc(item[f])}</textarea>`
      : `<label>${label}</label><input type="${type === 'num' ? 'number' : 'text'}" ${type === 'num' ? 'min="0" max="100"' : ''} value="${esc(item[f])}" data-list="${k}" data-i="${i}" data-f="${f}">`).join('')
      + `<div class="tools"><button data-act="up" data-list="${k}" data-i="${i}">↑</button><button data-act="down" data-list="${k}" data-i="${i}">↓</button><button data-act="del" data-list="${k}" data-i="${i}">Delete</button></div></div>`).join('')
      + `<button data-act="add" data-list="${k}">+ Add ${def.title.toLowerCase()} entry</button></details>`;
  }

  h += `<details><summary>Appearance & sections</summary>
    <label>Accent colour</label><input type="color" id="accent" value="${esc(s.accent)}">
    <label>Theme</label><select id="theme"><option value="light">Light</option><option value="dark">Dark</option></select>
    
    <label style="margin-top:1rem; font-weight:600;">Display Options</label>
    <label class="switch"><input type="checkbox" id="chkShowLevels" ${s.showLevels ? 'checked' : ''}> Show skill & language levels (%)</label>

    <label style="margin-top:1rem; font-weight:600;">Section Order & Visibility</label>
    <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.3rem;">
      ${s.order.map((k, i) => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:4px 8px; background:rgba(128,128,128,0.1); border-radius:4px;">
          <label class="switch" style="margin:0;"><input type="checkbox" data-show="${k}" ${s.show[k] ? 'checked' : ''}>${TITLES[k]}</label>
          <div style="display:flex; gap:4px;">
            <button data-act="sec-up" data-i="${i}" ${i === 0 ? 'disabled' : ''} style="padding:2px 8px;">↑</button>
            <button data-act="sec-down" data-i="${i}" ${i === s.order.length - 1 ? 'disabled' : ''} style="padding:2px 8px;">↓</button>
          </div>
        </div>
      `).join('')}
    </div>
  </details>`;

  $('#edBody').innerHTML = h;
  $('#theme').value = s.theme;
}

/* Resize photo -> small JPEG data URL so data.json stays light */
function resizeImage(file, max = 480) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = img.width * r; c.height = img.height * r;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = rej; img.src = url;
  });
}

function wireEditor() {
  const body = $('#edBody');
  body.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.p) data.profile[t.dataset.p] = t.value;
    else if (t.dataset.l !== undefined) data.links[+t.dataset.l][t.dataset.f] = t.value;
    else if ('about' in t.dataset) data.about = t.value;
    else if (t.dataset.list) data[t.dataset.list][+t.dataset.i][t.dataset.f] = t.type === 'number' ? Number(t.value) : t.value;
    else if (t.id === 'accent') data.settings.accent = t.value;
    else if (t.id === 'theme') data.settings.theme = t.value;
    else if (t.id === 'chkShowLevels') data.settings.showLevels = t.checked;
    else if (t.dataset.show) data.settings.show[t.dataset.show] = t.checked;
    else return;
    save(); render();
  });
  body.addEventListener('change', async e => {
    if (e.target.id === 'photoFile' && e.target.files[0]) {
      try { data.profile.photo = await resizeImage(e.target.files[0]); save(); render(); buildEditor(); keepOpen(); }
      catch { alert('Could not read that image.'); }
    }
  });
  body.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'photoClear') { data.profile.photo = ''; }
    else if (b.dataset.act === 'sec-up' || b.dataset.act === 'sec-down') {
      const i = +b.dataset.i, ord = data.settings.order;
      if (b.dataset.act === 'sec-up' && i > 0) [ord[i - 1], ord[i]] = [ord[i], ord[i - 1]];
      if (b.dataset.act === 'sec-down' && i < ord.length - 1) [ord[i + 1], ord[i]] = [ord[i], ord[i + 1]];
    }
    else if (b.dataset.act) {
      const k = b.dataset.list, i = +b.dataset.i, arr = data[k];
      if (b.dataset.act === 'add') arr.push(k === 'links' ? { label: '', url: '' } : Object.fromEntries(LISTS[k].fields.map(([f, , t]) => [f, t === 'num' ? 50 : ''])));
      if (b.dataset.act === 'del') arr.splice(i, 1);
      if (b.dataset.act === 'up' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      if (b.dataset.act === 'down' && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    } else return;
    save(); render();
    const open = [...body.querySelectorAll('details')].map(d => d.open);
    buildEditor(); body.querySelectorAll('details').forEach((d, n) => d.open = open[n]);
  });
}
const keepOpen = () => { const d = $('#edBody details'); if (d) d.open = true; };

/* ---------- Boot ---------- */
async function load() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (stored) { data = merge(DEFAULTS, stored); return; }
  try { const r = await fetch('data.json', { cache: 'no-store' }); if (r.ok) data = merge(DEFAULTS, await r.json()); } catch {}
}

(async function init() {
  await load(); render();
  const ed = $('#editor');
  $('#btnEdit').onclick = () => { buildEditor(); ed.hidden = false; };
  $('#btnClose').onclick = () => ed.hidden = true;
  $('#btnPrint').onclick = () => window.print();
  $('#btnTheme').onclick = () => { data.settings.theme = data.settings.theme === 'dark' ? 'light' : 'dark'; save(); render(); };
  $('#btnExport').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = 'data.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  $('#btnImport').onclick = () => $('#fileImport').click();
  $('#fileImport').onchange = async e => {
    try { data = merge(DEFAULTS, JSON.parse(await e.target.files[0].text())); save(); render(); buildEditor(); }
    catch { alert('Invalid JSON file.'); }
  };
  $('#btnReset').onclick = () => {
    if (!confirm('Discard your browser edits and go back to the published version?')) return;
    try { localStorage.removeItem(KEY); } catch {}
    location.reload();
  };
  wireEditor();
})();