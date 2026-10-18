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
  about: 'I am a first-semester M.Sc. Data Science and Artificial Intelligence student at Ramakrishna Mission Vivekananda Educational and Research Institute (RKMVERI), with a foundational background in Physics from RKMVCC Rahara. My academic interests center around statistical inference, mathematical optimization, linear algebra, and data structures & algorithms. I actively focus on building machine learning algorithms from scratch—including KNN and multi-class Logistic Regression with gradient descent optimization—and applying regularized predictive modeling (LASSO) to complex datasets.',
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
  customSections: [],
  settings: {
    accent: '#2563eb',
    theme: 'dark',
    sidebarLayout: 'left',
    sidebarSections: ['skills', 'languages'],
    linksPlacement: 'standalone',
    order: [...DEFAULT_ORDER],
    show: { about: true, links: true, experience: false, education: true, skills: true, projects: true, certifications: false, languages: true }
  }
};

const LISTS = {
  links:          { title: 'Links & Profiles', fields: [['label','Label'],['url','URL (https://…)']] },
  experience:     { title: 'Experience',     fields: [['role','Role'],['company','Company'],['period','Period'],['details','Details (one bullet per line)','area']] },
  education:      { title: 'Education',      fields: [['degree','Degree'],['school','School'],['period','Period'],['details','Details (one bullet per line)','area']] },
  skills:         { title: 'Skills',         fields: [['name','Skill']] },
  projects:       { title: 'Projects',       fields: [['name','Name'],['link','Link (https://…)'],['description','Description','area'],['tech','Tech (comma separated)']] },
  certifications: { title: 'Certifications', fields: [['name','Name'],['issuer','Issuer'],['year','Year']] },
  languages:      { title: 'Languages',      fields: [['name','Language']] }
};

let data = structuredClone(DEFAULTS);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^(https?:|mailto:|tel:)/i.test(u || '') ? u : (u && /^[\w.-]+\.[a-z]{2,}/i.test(u) ? 'https://' + u : '');
const lines = t => String(t || '').split('\n').map(s => s.trim()).filter(Boolean);

/* Parse text with markdown links [label](url) */
function parseLinks(raw) {
  if (!raw) return '';
  const escaped = esc(raw);
  return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const valid = safeUrl(url);
    return valid ? `<a href="${esc(valid)}" target="_blank" rel="noopener" style="color:var(--accent); text-decoration:underline;">${label} ↗</a>` : label;
  });
}

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

function getSectionTitle(k) {
  if (k === 'about') return 'About';
  if (LISTS[k]) return LISTS[k].title;
  const custom = (data.customSections || []).find(c => c.id === k);
  return custom ? custom.title : k;
}

function syncOrderAndShow() {
  if (!data.customSections) data.customSections = [];
  if (!data.settings.order) data.settings.order = [...DEFAULT_ORDER];
  if (!data.settings.show) data.settings.show = {};

  data.customSections.forEach(c => {
    if (!data.settings.order.includes(c.id)) data.settings.order.push(c.id);
    if (data.settings.show[c.id] === undefined) data.settings.show[c.id] = true;
  });

  data.settings.order = data.settings.order.filter(k => DEFAULT_ORDER.includes(k) || data.customSections.some(c => c.id === k));
}

function getLinksChips() {
  if (!data.links || !data.links.length) return '';
  return data.links.map(l => {
    const u = safeUrl(l.url);
    return l.label ? (u ? `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>` : `<span class="chip">${esc(l.label)}</span>`) : '';
  }).join('');
}

/* Helper to render the Phrase to Link Box in the editor */
function linkHelperHtml(targetId) {
  return `
    <div class="link-helper-box">
      <div style="font-weight:600; font-size:0.75rem; color:var(--muted);">🔗 Make text into a link</div>
      <label>Portion of text (Label)</label>
      <input type="text" id="lh-label-${targetId}" placeholder="e.g. RKMVERI">
      <label>URL (Link)</label>
      <input type="text" id="lh-url-${targetId}" placeholder="https://...">
      <button type="button" data-act="apply-link" data-target="${targetId}">Insert Link</button>
    </div>
  `;
}

/* ---------- Render CV ---------- */
function render() {
  syncOrderAndShow();
  const p = data.profile, s = data.settings;
  if (!s.sidebarSections) s.sidebarSections = ['skills', 'languages'];
  if (!s.sidebarLayout) s.sidebarLayout = 'left';
  if (!s.linksPlacement) s.linksPlacement = 'standalone';

  document.documentElement.style.setProperty('--accent', s.accent);
  document.documentElement.dataset.theme = s.theme;
  document.title = (p.name || 'CV') + ' – CV';

  const chips = [];
  if (p.location) chips.push(`<span class="chip">📍 ${esc(p.location)}</span>`);
  if (p.email) chips.push(`<a class="chip" href="mailto:${esc(p.email)}">✉ ${esc(p.email)}</a>`);
  if (p.phone) chips.push(`<a class="chip" href="tel:${esc(p.phone)}">☎ ${esc(p.phone)}</a>`);

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
  let visible = s.order.filter(k => s.show[k]);
  if (s.linksPlacement !== 'standalone') {
    visible = visible.filter(k => k !== 'links');
  }

  if (s.sidebarLayout === 'none') {
    cvEl.className = '';
    let html = heroHtml;
    for (const k of visible) html += `<section id="${k}"><h2>${esc(getSectionTitle(k))}</h2>${renderSection(k)}</section>`;
    cvEl.innerHTML = html;
  } else {
    cvEl.className = `layout-2col sidebar-${s.sidebarLayout}`;
    const sideKeys = visible.filter(k => s.sidebarSections.includes(k));
    const mainKeys = visible.filter(k => !s.sidebarSections.includes(k));

    let sideHtml = `<div class="cv-sidebar">${heroHtml}`;
    for (const k of sideKeys) sideHtml += `<section id="${k}"><h2>${esc(getSectionTitle(k))}</h2>${renderSection(k)}</section>`;
    sideHtml += `</div>`;

    let mainHtml = `<div class="cv-main">`;
    for (const k of mainKeys) mainHtml += `<section id="${k}"><h2>${esc(getSectionTitle(k))}</h2>${renderSection(k)}</section>`;
    mainHtml += `</div>`;

    cvEl.innerHTML = sideHtml + mainHtml;
  }

  $('#nav').innerHTML = visible.map(k => `<a href="#${k}">${esc(getSectionTitle(k))}</a>`).join('');
}

function renderSection(k) {
  if (k === 'about') {
    let out = data.about ? `<p>${parseLinks(data.about).replace(/\n/g, '<br>')}</p>` : '<p class="empty">Nothing here yet.</p>';
    if (data.settings.linksPlacement === 'about' && data.settings.show.links) {
      out += `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.8rem;">${getLinksChips()}</div>`;
    }
    return out;
  }
  
  if (k === 'links') {
    const content = getLinksChips();
    return content ? `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${content}</div>` : '<p class="empty">Nothing here yet.</p>';
  }

  const custom = (data.customSections || []).find(c => c.id === k);
  if (custom) {
    if (!custom.items || !custom.items.length) return '<p class="empty">Nothing here yet.</p>';
    if (custom.type === 'tags') {
      const hasBar = custom.items.some(i => i.showLevel);
      if (hasBar) {
        return `<div class="grid">${custom.items.map(i => {
          if (!i.showLevel) return `<div style="display:flex; align-items:center;"><span class="chip" style="font-size:0.95rem; padding:0.35rem 0.8rem;">${esc(i.name)}</span></div>`;
          const lvl = Math.min(100, Math.max(0, +i.level || 0));
          return `<div><div class="row" style="display:flex;justify-content:space-between"><span>${esc(i.name)}</span><span class="when">${lvl}%</span></div><div class="bar"><i style="width:${lvl}%"></i></div></div>`;
        }).join('')}</div>`;
      }
      return `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${custom.items.map(i => `<span class="chip" style="font-size:0.95rem; padding:0.4rem 0.8rem;">${esc(i.name)}</span>`).join('')}</div>`;
    } else {
      const bullets = d => lines(d).length ? `<ul>${lines(d).map(x => `<li>${parseLinks(x)}</li>`).join('')}</ul>` : '';
      return custom.items.map(i => `
        <div class="item">
          <div class="row"><h3>${parseLinks(i.title)}</h3>${i.period ? `<span class="when">${esc(i.period)}</span>` : ''}</div>
          ${i.subtitle ? `<div class="sub">${parseLinks(i.subtitle)}</div>` : ''}
          ${bullets(i.details)}
        </div>
      `).join('');
    }
  }

  const list = data[k];
  if (!list || !list.length) return '<p class="empty">Nothing here yet.</p>';
  const bullets = d => lines(d).length ? `<ul>${lines(d).map(x => `<li>${parseLinks(x)}</li>`).join('')}</ul>` : '';

  if (k === 'skills' || k === 'languages') {
    const hasAnyBar = list.some(i => i.showLevel);
    if (hasAnyBar) {
      return `<div class="grid">${list.map(i => {
        if (!i.showLevel) return `<div style="display:flex; align-items:center;"><span class="chip" style="font-size:0.95rem; padding:0.35rem 0.8rem;">${esc(i.name)}</span></div>`;
        const lvl = Math.min(100, Math.max(0, +i.level || 0));
        return `<div><div class="row" style="display:flex;justify-content:space-between"><span>${esc(i.name)}</span><span class="when">${lvl}%</span></div><div class="bar"><i style="width:${lvl}%"></i></div></div>`;
      }).join('')}</div>`;
    }
    return `<div class="chips" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${list.map(i => `<span class="chip" style="font-size:0.95rem; padding:0.4rem 0.8rem;">${esc(i.name)}</span>`).join('')}</div>`;
  }

  return list.map(i => {
    if (k === 'experience') return `<div class="item"><div class="row"><h3>${parseLinks(i.role)}</h3><span class="when">${esc(i.period)}</span></div><div class="sub">${parseLinks(i.company)}</div>${bullets(i.details)}</div>`;
    if (k === 'education') return `<div class="item"><div class="row"><h3>${parseLinks(i.degree)}</h3><span class="when">${esc(i.period)}</span></div><div class="sub">${parseLinks(i.school)}</div>${bullets(i.details)}</div>`;
    if (k === 'projects') {
      const u = safeUrl(i.link);
      return `<div class="item">
        <div class="row">
          <h3>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(i.name)} ↗</a>` : parseLinks(i.name)}</h3>
        </div>
        <div>${parseLinks(i.description)}</div>
        <div class="tags">${String(i.tech || '').split(',').map(t => t.trim()).filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      </div>`;
    }
    if (k === 'certifications') return `<div class="item"><div class="row"><h3>${parseLinks(i.name)}</h3><span class="when">${esc(i.year)}</span></div><div class="sub">${parseLinks(i.issuer)}</div></div>`;
  }).join('');
}

/* ---------- Editor ---------- */
const input = (label, val, attrs = '') => `<label>${label}</label><input type="text" value="${esc(val)}" ${attrs}>`;

function buildEditor() {
  syncOrderAndShow();
  const p = data.profile, s = data.settings;

  let h = `<details open><summary>Profile</summary>
    <div class="photo-row"><img id="photoPrev" src="${esc(p.photo)}" alt="" ${p.photo ? '' : 'hidden'}>
      <div><input type="file" id="photoFile" accept="image/*"><br><button id="photoClear" style="margin-top:.4rem">Remove photo</button></div></div>
    ${input('Full name', p.name, 'data-p="name"')}${input('Job title', p.title, 'data-p="title"')}
    <label>Short summary</label><input type="text" value="${esc(p.summary)}" data-p="summary">
    ${input('Email', p.email, 'data-p="email"')}${input('Phone', p.phone, 'data-p="phone"')}${input('Location', p.location, 'data-p="location"')}</details>`;

  h += `<details><summary>About</summary>
    <label>About me</label>
    <textarea id="ta-about" data-about>${esc(data.about)}</textarea>
    ${linkHelperHtml('ta-about')}
  </details>`;

  for (const [k, def] of Object.entries(LISTS)) {
    h += `<details><summary>${def.title}</summary>` + data[k].map((item, i) => {
      let cardContent = def.fields.map(([f, label, type]) => {
        const fieldId = `field-${k}-${i}-${f}`;
        if (type === 'area') {
          return `<label>${label}</label>
                  <textarea id="${fieldId}" data-list="${k}" data-i="${i}" data-f="${f}">${esc(item[f])}</textarea>
                  ${linkHelperHtml(fieldId)}`;
        }
        return `<label>${label}</label><input id="${fieldId}" type="text" value="${esc(item[f])}" data-list="${k}" data-i="${i}" data-f="${f}">`;
      }).join('');

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

  (data.customSections || []).forEach((c, cIdx) => {
    h += `<details><summary>✦ ${esc(c.title)} (Custom)</summary>
      <div style="padding:0.4rem 0; border-bottom:1px solid var(--line); margin-bottom:0.6rem;">
        <label>Section Title</label>
        <input type="text" value="${esc(c.title)}" data-custom-title="${cIdx}">
        <label style="margin-top:0.4rem;">Format / Style</label>
        <select data-custom-type="${cIdx}" style="width:100%; padding:.4rem; border:1px solid var(--line); border-radius:8px; background:var(--bg); color:var(--text);">
          <option value="cards" ${c.type === 'cards' ? 'selected' : ''}>Timeline Cards (Like Experience/Education)</option>
          <option value="tags" ${c.type === 'tags' ? 'selected' : ''}>Chips / Tags (Like Skills)</option>
        </select>
        <button data-act="del-custom-sec" data-cidx="${cIdx}" class="danger" style="margin-top:0.6rem; padding:0.2rem 0.6rem; font-size:0.8rem;">Delete this whole section</button>
      </div>`;

    if (c.type === 'tags') {
      h += (c.items || []).map((item, i) => `
        <div class="card">
          <label>Item Name</label>
          <input type="text" value="${esc(item.name)}" data-cust-list="${cIdx}" data-i="${i}" data-f="name">
          <div style="margin-top:0.6rem; padding:0.4rem 0.6rem; background:rgba(128,128,128,0.08); border-radius:6px;">
            <label class="switch" style="margin:0; font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" data-act="toggle-custom-level" data-cidx="${cIdx}" data-i="${i}" ${item.showLevel ? 'checked' : ''}>
              Show level (%) on CV
            </label>
            <div id="cust-lvl-box-${cIdx}-${i}" style="margin-top:0.4rem; ${item.showLevel ? '' : 'display:none;'}">
              <label style="font-size:0.75rem; color:var(--muted);">Level (0-100)</label>
              <input type="number" min="0" max="100" value="${item.level !== undefined ? item.level : 75}" data-cust-list="${cIdx}" data-i="${i}" data-f="level">
            </div>
          </div>
          <div class="tools">
            <button data-act="cust-item-up" data-cidx="${cIdx}" data-i="${i}">↑</button>
            <button data-act="cust-item-down" data-cidx="${cIdx}" data-i="${i}">↓</button>
            <button data-act="cust-item-del" data-cidx="${cIdx}" data-i="${i}">Delete</button>
          </div>
        </div>
      `).join('');
    } else {
      h += (c.items || []).map((item, i) => {
        const detailsId = `cust-details-${cIdx}-${i}`;
        return `
        <div class="card">
          <label>Title</label><input type="text" value="${esc(item.title)}" data-cust-list="${cIdx}" data-i="${i}" data-f="title">
          <label>Subtitle / Issuer / Org</label><input type="text" value="${esc(item.subtitle)}" data-cust-list="${cIdx}" data-i="${i}" data-f="subtitle">
          <label>Period / Year</label><input type="text" value="${esc(item.period)}" data-cust-list="${cIdx}" data-i="${i}" data-f="period">
          <label>Details (one bullet per line)</label>
          <textarea id="${detailsId}" data-cust-list="${cIdx}" data-i="${i}" data-f="details">${esc(item.details)}</textarea>
          ${linkHelperHtml(detailsId)}
          <div class="tools">
            <button data-act="cust-item-up" data-cidx="${cIdx}" data-i="${i}">↑</button>
            <button data-act="cust-item-down" data-cidx="${cIdx}" data-i="${i}">↓</button>
            <button data-act="cust-item-del" data-cidx="${cIdx}" data-i="${i}">Delete</button>
          </div>
        </div>
      `}).join('');
    }

    h += `<button data-act="add-custom-item" data-cidx="${cIdx}">+ Add entry to ${esc(c.title)}</button></details>`;
  });

  h += `<div style="margin: 1rem 0;">
    <button data-act="add-new-section" style="width:100%; padding:0.6rem; font-weight:600; border-style:dashed;">+ Add Custom Section</button>
  </div>`;

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
            <label class="switch" style="margin:0;"><input type="checkbox" data-show="${k}" ${s.show[k] ? 'checked' : ''} ${isLinksAttached ? 'disabled' : ''}> <strong>${esc(getSectionTitle(k))}</strong></label>
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
    else if (t.dataset.custList) {
      const cIdx = +t.dataset.custList, itemIdx = +t.dataset.i, f = t.dataset.f;
      data.customSections[cIdx].items[itemIdx][f] = t.type === 'number' ? Number(t.value) : t.value;
    }
    else if ('customTitle' in t.dataset) {
      data.customSections[+t.dataset.customTitle].title = t.value;
    }
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
    } else if (t.dataset.act === 'toggle-custom-level') {
      const cIdx = +t.dataset.cidx, i = +t.dataset.i;
      data.customSections[cIdx].items[i].showLevel = t.checked;
      const box = document.getElementById(`cust-lvl-box-${cIdx}-${i}`);
      if (box) box.style.display = t.checked ? 'block' : 'none';
      save(); render();
    } else if ('customType' in t.dataset) {
      const cIdx = +t.dataset.customType;
      data.customSections[cIdx].type = t.value;
      data.customSections[cIdx].items = [];
      save(); render(); buildEditor();
    } else if (t.dataset.act === 'toggle-side') {
      const sec = t.dataset.sec;
      if (t.checked && !data.settings.sidebarSections.includes(sec)) {
        data.settings.sidebarSections.push(sec);
      } else if (!t.checked) {
        data.settings.sidebarSections = data.settings.sidebarSections.filter(x => x !== sec);
      }
      save(); render();
    } else if (t.id === 'photoFile' && t.files[0]) {
      try { data.profile.photo = await resizeImage(t.files[0]); save(); render(); buildEditor(); }
      catch { alert('Could not read that image.'); }
    }
  });

  body.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;

    if (b.dataset.act === 'apply-link') {
      const targetId = b.dataset.target;
      const lblEl = document.getElementById(`lh-label-${targetId}`);
      const urlEl = document.getElementById(`lh-url-${targetId}`);
      const txtEl = document.getElementById(targetId);

      const label = (lblEl?.value || '').trim();
      const url = (urlEl?.value || '').trim();

      if (!label || !url) {
        alert('Please provide both the text portion (Label) and the URL.');
        return;
      }

      if (txtEl) {
        const mdLink = `[${label}](${url})`;
        if (txtEl.value.includes(label)) {
          txtEl.value = txtEl.value.replace(label, mdLink);
        } else {
          txtEl.value = txtEl.value + (txtEl.value ? ' ' : '') + mdLink;
        }
        txtEl.dispatchEvent(new Event('input', { bubbles: true }));
        lblEl.value = '';
        urlEl.value = '';
      }
      return;
    }

    if (b.id === 'photoClear') { data.profile.photo = ''; }
    else if (b.dataset.act === 'sec-up' || b.dataset.act === 'sec-down') {
      const i = +b.dataset.i, ord = data.settings.order;
      if (b.dataset.act === 'sec-up' && i > 0) [ord[i - 1], ord[i]] = [ord[i], ord[i - 1]];
      if (b.dataset.act === 'sec-down' && i < ord.length - 1) [ord[i + 1], ord[i]] = [ord[i], ord[i + 1]];
    }
    else if (b.dataset.act === 'add-new-section') {
      const newSec = {
        id: `custom_${Date.now()}`,
        title: 'New Section',
        type: 'cards',
        items: []
      };
      if (!data.customSections) data.customSections = [];
      data.customSections.push(newSec);
      syncOrderAndShow();
    }
    else if (b.dataset.act === 'del-custom-sec') {
      const cIdx = +b.dataset.cidx;
      const secId = data.customSections[cIdx].id;
      data.customSections.splice(cIdx, 1);
      data.settings.order = data.settings.order.filter(x => x !== secId);
      delete data.settings.show[secId];
      data.settings.sidebarSections = data.settings.sidebarSections.filter(x => x !== secId);
    }
    else if (b.dataset.act === 'add-custom-item') {
      const cIdx = +b.dataset.cidx;
      const sec = data.customSections[cIdx];
      if (sec.type === 'tags') {
        sec.items.push({ name: '', showLevel: false, level: 75 });
      } else {
        sec.items.push({ title: '', subtitle: '', period: '', details: '' });
      }
    }
    else if (b.dataset.act === 'cust-item-del') {
      const cIdx = +b.dataset.cidx, i = +b.dataset.i;
      data.customSections[cIdx].items.splice(i, 1);
    }
    else if (b.dataset.act === 'cust-item-up') {
      const cIdx = +b.dataset.cidx, i = +b.dataset.i, arr = data.customSections[cIdx].items;
      if (i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    }
    else if (b.dataset.act === 'cust-item-down') {
      const cIdx = +b.dataset.cidx, i = +b.dataset.i, arr = data.customSections[cIdx].items;
      if (i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
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
