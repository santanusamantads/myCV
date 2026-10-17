/* ===== Dynamic CV =====
   Data priority: browser localStorage (your edits)  >  data.json (published)  >  DEFAULTS below. */
const KEY = 'cv-data-v1';

const DEFAULT_ORDER = ['about', 'links', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

const DEFAULTS = {
  profile: {
    name: 'Santanu Samanta',
    title: 'M.Sc. Data Science and AI Student',
    summary: 'First-semester M.Sc. Data Science & AI student with a B.Sc. in Physics. Strong foundation in machine learning, mathematical optimization, and algorithms, with hands-on experience implementing ML models from scratch.',
    email: 'santanusamanta97330795@gmail.com',
    phone: '',
    location: 'Belur, West Bengal, India',
    photo: ''
  },
  links: [
    { label: 'GitHub', url: 'https://github.com/santanusamantads' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/santanusamantads' },
    { label: 'Kaggle', url: 'https://kaggle.com/shyamsantanu01122004' }
  ],
  about: 'I am a first-semester M.Sc. Data Science and Artificial Intelligence student at Ramakrishna Mission Vivekananda Educational and Research Institute (RKMVERI), with a strong foundational background in Physics from RKMVCC Rahara. My academic interests center around statistical inference, mathematical optimization, linear algebra, and data structures & algorithms. I actively focus on building machine learning algorithms from scratch—including KNN and multi-class Logistic Regression with gradient descent optimization—and applying regularized predictive modeling (LASSO) to complex datasets.',
  experience: [],
  education: [
    { degree: 'M.Sc. in Data Science and Artificial Intelligence', school: 'Ramakrishna Mission Vivekananda Educational and Research Institute (RKMVERI)', period: '2026 – 2028', details: 'Focus on Machine Learning, Statistical Inference, and AI' },
    { degree: 'B.Sc. in Physics', school: 'Ramakrishna Mission Vivekananda Centenary College (RKMVCC), Rahara', period: '2026', details: 'CGPA: 7.24/10 (66.97%)' }
  ],
  skills: [
    { name: 'Python', showLevel: false, level: 80 },
    { name: 'Machine Learning', showLevel: false, level: 75 },
    { name: 'Data Structures & Algorithms', showLevel: false, level: 70 },
    { name: 'Linear Algebra & Optimization', showLevel: false, level: 75 }
  ],
  projects: [
    { name: 'Custom Machine Learning Algorithms - From Scratch', link: '', description: 'Implemented KNN and multi-class Logistic Regression from scratch, building sigmoid functions, distance calculations, and gradient-descent optimization.', tech: 'Python' },
    { name: 'Regularized Predictive Modeling', link: '', description: 'Built a regression workflow using polynomial features to model non-linear relationships and applied LASSO (L1) regularization.', tech: 'Python' }
  ],
  certifications: [],
  languages: [
    { name: 'English', showLevel: false, level: 90 },
    { name: 'Bengali', showLevel: false, level: 95 },
    { name: 'Hindi', showLevel: false, level: 85 }
  ],
  settings: {
    accent: '#2563eb',
    theme: 'dark',
    sidebarLayout: 'left', // 'none' (stacked), 'left' (GitHub style), or 'right'
    sidebarSections: ['skills', 'languages'], // Sections placed in the sidebar column
    linksPlacement: 'standalone', // 'standalone', 'profile', or 'about'
    order: [...DEFAULT_ORDER],
    show: { about: true, links: true, experience: false, education: true, skills: true, projects: true, certifications: false, languages: true }
  }
};

/* Section definitions: drives both rendering and the editor form */
const LISTS = {
  links:          { title: 'Links & Profiles', fields: [['label','Label'],['url','URL (https://…)']] },
  experience:     { title: 'Experience',     fields: [['role','Role'],['company','Company'],['period','Period'],['details','Details (one bullet per line)','area']] },
  education:      { title: 'Education',      fields: [['degree','Degree'],['school','School'],['period','Period'],['details','Details (one bullet per line)','area']] },
  skills:         { title: 'Skills',         fields: [['name','Skill']] },
  projects:       { title: 'Projects',       fields: [['name','Name'],['link','Link (https://…)'],['description','Description','area'],['tech','Tech (comma separated)']] },
  certifications: { title: 'Certifications', fields: [['name','Name'],['issuer','Issuer'],['year','Year']] },
  languages:      { title: 'Languages',      fields: [['name','Language']] }
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

/* Helper to generate links chip tags */
function getLinksChips() {
  if (!data.links || !data.links.length) return '';
  return data.links.map(l => {
    const u = safeUrl(l.url);
    return l.label ? (u ? `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>` : `<span class="chip">${esc(l.label)}</span>`) : '';
  }).join('');
}

/* ---------- Render CV ---------- */
function render() {
  const p = data.profile, s = data.settings;
  if (!s.order) s.order = [...DEFAULT_ORDER];
  if (!s.sidebarSections) s.sidebarSections = ['skills', 'languages'];
  if (!s.sidebarLayout) s.sidebarLayout = 'left';
  if (!s.linksPlacement) s.linksPlacement = 'standalone';

  document.documentElement.style.setProperty('--accent', s.accent);
  document.documentElement.dataset.theme = s.theme;
  document.title = (p.name || 'CV') + ' – CV';

  // Contact info chips
  const chips = [];
  if (p.location) chips.push(`<span class="chip">📍 ${esc(p.location)}</span>`);
  if (p.email) chips.push(`<a class="chip" href="mailto:${esc(p.email)}">✉ ${esc(p.email)}</a>`);
  if (p.phone) chips.push(`<a class="chip" href="tel:${esc(p.phone)}">☎ ${esc(p.phone)}</a>`);

  // If attached to Profile, append links directly inside the profile hero card
  if (s.linksPlacement === 'profile' && s.show.links) {
    data.links.forEach(l => {
      const u = safeUrl(l.url);
      if (l.label) chips.push(u ? `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>` : `<span class="chip">${esc(l.label)}</span>`);
    });
  }

  const heroHtml = `<section class="hero" id="top">
    ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}">` : `<div class="avatar">👤</div>`}
    <div><h1>${esc(p.name)}</h1><div class="title">${esc(p.title)}</div><p>${esc(p.summary)}</p><div class="chips">${chips.join('')}</div></div></section>`;

  const cvEl = $('#cv');
  
  // If attached to Profile or About, exclude standalone links section from rendering
  let visible = s.order.filter(k => s.show[k]);
  if (s.linksPlacement !== 'standalone') {
    visible = visible.filter(k => k !== 'links');
  }

  if (s.sidebarLayout === 'none') {
    cvEl.className = '';
    let html = heroHtml;
    for (const k of visible) html += `<section id="${k}"><h2>${TITLES[k]}</h2>${renderSection(k)}</section>`;
    cvEl.innerHTML = html;
  } else {
    cvEl.className = `layout-2col sidebar-${s.sidebarLayout}`;
    
    const sideKeys = visible.filter(k => s.sidebarSections.includes(k));
    const mainKeys = visible.filter(k => !s.sidebarSections.includes(k));

    let sideHtml = `<div class="cv-sidebar">${heroHtml}`;
    for (const k of sideKeys) sideHtml += `<section id="${k}"><h2>${TITLES[k]}</h2>${renderSection(k)}</section>`;
    sideHtml += `</div>`;

    let mainHtml = `<div class="cv-main">`;
    for (const k of mainKeys) mainHtml += `<section id="${k}"><h2>${TITLES[k]}</h2>${renderSection(k)}</section>`;
    mainHtml += `</div>`;

    cvEl.innerHTML = sideHtml + mainHtml;
  }

  // Navbar navigation
  $('#nav').innerHTML = visible.map(k => `<a href="#${k}">${TITLES[k]}</a>`).join('');
}

function renderSection(k) {
  if (k === 'about') {
    let out = data.about ? `<p>${esc(data.about).replace(/\n/g, '<br>')}</p>` : '<p class="empty">Nothing here yet.</p>';
    if (data.settings.linksPlacement === 'about' && data.settings.show.links) {
      out += `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.8rem;">${getLinksChips()}</div>`;
    }
    return out;
  }
  
  if (k === 'links') {
    const content = getLinksChips();
    return content ? `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${content}</div>` : '<p class="empty">Nothing here yet.</p>';
  }

  const list = data[k];
  if (!list.length) return '<p class="empty">Nothing here yet.</p>';
  const bullets = d => lines(d).length ? `<ul>${lines(d).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';

  if (k === 'skills' || k === 'languages') {
    const hasAnyBar = list.some(i => i.showLevel);

    if (hasAnyBar) {
      return `<div class="grid">${list.map(i => {
        if (!i.showLevel) {
          return `<div style="display:flex; align-items:center;"><span class="chip" style="font-size:0.95rem; padding:0.35rem 0.8rem;">${esc(i.name)}</span></div>`;
        }
        const lvl = Math.min(100, Math.max(0, +i.level || 0));
        return `<div><div class="row" style="display:flex;justify-content:space-between"><span>${esc(i.name)}</span><span class="when">${lvl}%</span></div><div class="bar"><i style="width:${lvl}%"></i></div></div>`;
      }).join('')}</div>`;
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
  if (!s.sidebarSections) s.sidebarSections = ['skills', 'languages'];
  if (!s.sidebarLayout) s.sidebarLayout = 'left';
  if (!s.linksPlacement) s.linksPlacement = 'standalone';

  let h = `<details open><summary>Profile</summary>
    <div class="photo-row"><img id="photoPrev" src="${esc(p.photo)}" alt="" ${p.photo ? '' : 'hidden'}>
      <div><input type="file" id="photoFile" accept="image/*"><br><button id="photoClear" style="margin-top:.4rem">Remove photo</button></div></div>
    ${input('Full name', p.name, 'data-p="name"')}${input('Job title', p.title, 'data-p="title"')}
    <label>Short summary</label><input type="text" value="${esc(p.summary)}" data-p="summary">
    ${input('Email', p.email, 'data-p="email"')}${input('Phone', p.phone, 'data-p="phone"')}${input('Location', p.location, 'data-p="location"')}</details>`;

  h += `<details><summary>About</summary><label>About me</label><textarea data-about>${esc(data.about)}</textarea></details>`;

  // List sections (Links, Experience, Education, Skills, Projects, etc.)
  for (const [k, def] of Object.entries(LISTS)) {
    h += `<details><summary>${def.title}</summary>` + data[k].map((item, i) => {
      let cardContent = def.fields.map(([f, label, type]) =>
        type === 'area' ? `<label>${label}</label><textarea data-list="${k}" data-i="${i}" data-f="${f}">${esc(item[f])}</textarea>`
        : `<label>${label}</label><input type="text" value="${esc(item[f])}" data-list="${k}" data-i="${i}" data-f="${f}">`).join('');

      // Custom per-item checkbox for Skills and Languages
      if (k === 'skills' || k === 'languages') {
        const isChecked = !!item.showLevel;
        cardContent += `
          <div style="margin-top:0.6rem; padding:0.4rem 0.6rem; background:rgba(128,128,128,0.08); border-radius:6px;">
            <label class="switch" style="margin:0; font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" data-act="toggle-level" data-list="${k}" data-i="${i}" ${isChecked ? 'checked' : ''}>
              Show level (%) on CV
            </label>
            <div id="lvl-box-${k}-${i}" style="margin-top:0.4rem; ${isChecked ? '' : 'display:none;'}">
              <label style="font-size:0.75rem; color:var(--muted);">Level (0-100)</label>
              <input type="number" min="0" max="100" value="${item.level !== undefined ? item.level : 75}" data-list="${k}" data-i="${i}" data-f="level">
            </div>
          </div>
        `;
      }

      return `<div class="card">${cardContent}<div class="tools"><button data-act="up" data-list="${k}" data-i="${i}">↑</button><button data-act="down" data-list="${k}" data-i="${i}">↓</button><button data-act="del" data-list="${k}" data-i="${i}">Delete</button></div></div>`;
    }).join('')
    + `<button data-act="add" data-list="${k}">+ Add ${def.title.toLowerCase()} entry</button></details>`;
  }

  h += `<details><summary>Appearance & layout</summary>
    <label>Accent colour</label><input type="color" id="accent" value="${esc(s.accent)}">
    <label>Theme</label><select id="theme"><option value="light">Light</option><option value="dark">Dark</option></select>

    <label style="margin-top:1rem; font-weight:600;">Overall Layout</label>
    <label style="font-size:0.75rem; color:var(--muted);">Sidebar placement</label>
    <select id="sidebarLayout">
      <option value="left" ${s.sidebarLayout === 'left' ? 'selected' : ''}>Sidebar Left (GitHub style)</option>
      <option value="right" ${s.sidebarLayout === 'right' ? 'selected' : ''}>Sidebar Right</option>
      <option value="none" ${s.sidebarLayout === 'none' ? 'selected' : ''}>Stacked (Single column)</option>
    </select>

    <label style="margin-top:1rem; font-weight:600;">Links Placement</label>
    <label style="font-size:0.75rem; color:var(--muted);">Choose where your profile links appear</label>
    <select id="linksPlacement">
      <option value="standalone" ${s.linksPlacement === 'standalone' ? 'selected' : ''}>Independent section (Custom placement)</option>
      <option value="profile" ${s.linksPlacement === 'profile' ? 'selected' : ''}>Attach to Profile section</option>
      <option value="about" ${s.linksPlacement === 'about' ? 'selected' : ''}>Attach to About section</option>
    </select>

    <label style="margin-top:1rem; font-weight:600;">Sections Position & Order</label>
    <p style="font-size:0.75rem; color:var(--muted); margin:0.2rem 0 0.5rem 0;">Check "Sidebar" to place any section on the side column.</p>
    <div style="display:flex; flex-direction:column; gap:0.4rem;">
      ${s.order.map((k, i) => {
        const inSide = s.sidebarSections.includes(k);
        const isLinksAttached = (k === 'links' && s.linksPlacement !== 'standalone');
        return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 8px; background:rgba(128,128,128,0.1); border-radius:6px; ${isLinksAttached ? 'opacity:0.5;' : ''}">
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="switch" style="margin:0;"><input type="checkbox" data-show="${k}" ${s.show[k] ? 'checked' : ''} ${isLinksAttached ? 'disabled' : ''}> <strong>${TITLES[k]}</strong></label>
            <label class="switch" style="margin:0; font-size:0.75rem; color:var(--muted); cursor:pointer;">
              <input type="checkbox" data-act="toggle-side" data-sec="${k}" ${inSide ? 'checked' : ''} ${isLinksAttached ? 'disabled' : ''}>
              Sidebar
            </label>
          </div>
          <div style="display:flex; gap:4px;">
            <button data-act="sec-up" data-i="${i}" ${i === 0 || isLinksAttached ? 'disabled' : ''} style="padding:2px 8px;">↑</button>
            <button data-act="sec-down" data-i="${i}" ${i === s.order.length - 1 || isLinksAttached ? 'disabled' : ''} style="padding:2px 8px;">↓</button>
          </div>
        </div>
      `}).join('')}
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
    else if ('about' in t.dataset) data.about = t.value;
    else if (t.dataset.list) data[t.dataset.list][+t.dataset.i][t.dataset.f] = t.type === 'number' ? Number(t.value) : t.value;
    else if (t.id === 'accent') data.settings.accent = t.value;
    else if (t.id === 'theme') data.settings.theme = t.value;
    else if (t.id === 'sidebarLayout') data.settings.sidebarLayout = t.value;
    else if (t.id === 'linksPlacement') {
      data.settings.linksPlacement = t.value;
      buildEditor();
    }
    else if (t.dataset.show) data.settings.show[t.dataset.show] = t.checked;
    else return;
    save(); render();
  });
  body.addEventListener('change', async e => {
    const t = e.target;
    if (t.dataset.act === 'toggle-level') {
      const k = t.dataset.list, i = +t.dataset.i;
      data[k][i].showLevel = t.checked;
      const box = document.getElementById(`lvl-box-${k}-${i}`);
      if (box) box.style.display = t.checked ? 'block' : 'none';
      save(); render();
    } else if (t.dataset.act === 'toggle-side') {
      const sec = t.dataset.sec;
      if (t.checked && !data.settings.sidebarSections.includes(sec)) {
        data.settings.sidebarSections.push(sec);
      } else if (!t.checked) {
        data.settings.sidebarSections = data.settings.sidebarSections.filter(x => x !== sec);
      }
      save(); render();
    } else if (t.id === 'photoFile' && t.files[0]) {
      try { data.profile.photo = await resizeImage(t.files[0]); save(); render(); buildEditor(); keepOpen(); }
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
      if (b.dataset.act === 'add') {
        if (k === 'links') arr.push({ label: '', url: '' });
        else if (k === 'skills' || k === 'languages') arr.push({ name: '', showLevel: false, level: 75 });
        else arr.push(Object.fromEntries(LISTS[k].fields.map(([f]) => [f, ''])));
      }
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