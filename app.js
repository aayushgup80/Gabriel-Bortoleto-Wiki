(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const state = { manifest: null, pages: [], activeId: null, contents: new Map(), showResults: false };
  const search = $("search"), tree = $("tree"), reader = $("reader"), resultsPanel = $("resultsPanel"), results = $("results");
  const normalize = (s) => (s || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function flatten(groups) {
    const out = [];
    for (const group of groups) for (const page of group.pages) out.push({...page, groupId: group.id, groupTitle: group.title, groupOrder: groups.indexOf(group)});
    return out;
  }
  async function getText(page) {
    if (state.contents.has(page.id)) return state.contents.get(page.id);
    const res = await fetch(page.file);
    if (!res.ok) throw new Error(`Could not load ${page.file} (HTTP ${res.status})`);
    const md = await res.text(); state.contents.set(page.id, md); return md;
  }
  function makeFilters() {
    for (const g of state.manifest.groups) $("groupFilter").add(new Option(g.title, g.id));
    const types = [...new Set(state.pages.map(p => p.sourceType || "Mixed"))].sort();
    for (const t of types) $("sourceFilter").add(new Option(t, t));
  }
  function renderTree() {
    tree.innerHTML = "";
    for (const group of state.manifest.groups) {
      const details = document.createElement("details"); details.className = "group"; details.open = true;
      const summary = document.createElement("summary"); summary.textContent = group.title; details.append(summary);
      for (const page of group.pages) {
        const b = document.createElement("button"); b.type = "button"; b.className = "page-link"; b.dataset.id = page.id; b.textContent = page.title;
        b.addEventListener("click", () => openPage(page.id));
        details.append(b);
      }
      tree.append(details);
    }
  }
  async function openPage(id) {
    const page = state.pages.find(p => p.id === id); if (!page) return;
    state.activeId = id;
    document.querySelectorAll(".page-link").forEach(b => b.classList.toggle("active", b.dataset.id === id));
    reader.innerHTML = '<p>Loading article…</p>'; resultsPanel.classList.remove("visible");
    try {
      const md = await getText(page);
      let html;
      if (window.marked && window.marked.parse) {
        window.marked.setOptions({gfm:true, breaks:false});
        html = window.marked.parse(md);
      } else html = "<pre>" + esc(md) + "</pre>";
      reader.innerHTML = `<div class="kicker">${esc(page.groupTitle)}</div><div class="article-meta"><span class="chip">${esc(page.sourceType || "Mixed sources")}</span><span class="chip">Verified: ${esc(page.lastVerified || "date not set")}</span></div><div class="article-body">${html}</div><p class="side-note">Page file: <code>${esc(page.file)}</code></p>`;
      reader.querySelectorAll("a").forEach(a => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
      history.replaceState(null, "", "#" + encodeURIComponent(id));
    } catch (err) { reader.innerHTML = `<div class="load-error"><strong>Could not load this page.</strong><p>${esc(err.message)}</p><p>Run a local server, e.g. <code>python -m http.server 8000</code>, instead of opening index.html as a file.</p></div>`; }
  }
  function pageMatches(page, q, group, source) {
    return (!group || page.groupId === group) && (!source || (page.sourceType || "Mixed") === source) && (!q || normalize([page.title,page.groupTitle,page.summary,(page.keywords||[]).join(" "),state.contents.get(page.id)||""].join(" ")).includes(q));
  }
  async function runSearch() {
    const q = normalize(search.value.trim()), group = $("groupFilter").value, source = $("sourceFilter").value;
    // Load all article text once so the search covers every subgroup, not merely titles.
    if (q) {
      $("searchMeta").textContent = "Searching every subgroup…";
      await Promise.all(state.pages.map(async p => { try { await getText(p); } catch (_) {} }));
    }
    let found = state.pages.filter(p => pageMatches(p,q,group,source));
    const sort = $("sortFilter").value;
    found.sort((a,b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "updated" ? (b.lastVerified||"").localeCompare(a.lastVerified||"") : a.groupOrder-b.groupOrder || a.order-b.order);
    $("searchMeta").textContent = q ? `Search across ${state.pages.length} Markdown pages` : "Search by keyword or browse the tree";
    if (!q && !group && !source) { resultsPanel.classList.remove("visible"); return; }
    resultsPanel.classList.add("visible"); $("resultCount").textContent = `${found.length} page(s)`;
    results.innerHTML = found.length ? "" : "<p>No pages match. Try a broader keyword or clear a filter.</p>";
    for (const p of found) {
      let raw = state.contents.get(p.id) || p.summary || "";
      raw = raw.replace(/^---[\s\S]*?---\s*/,"").replace(/^#+\s.*$/gm,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[*_`>#|]/g," ").replace(/\s+/g," ").trim();
      if (q) { const i = normalize(raw).indexOf(q); if (i >= 0) raw = (i > 80 ? "…" : "") + raw.slice(Math.max(0,i-80), i+220) + "…"; }
      const card = document.createElement("div"); card.className = "result-card";
      card.innerHTML = `<button type="button">${esc(p.title)}</button><div class="meta">${esc(p.groupTitle)} · ${esc(p.sourceType||"Mixed")} · Verified ${esc(p.lastVerified||"unknown")}</div><p>${esc(raw || p.summary || "Open this subgroup to read its contents.")}</p>`;
      card.querySelector("button").addEventListener("click", () => openPage(p.id));
      results.append(card);
    }
  }
  async function init() {
    try {
      const res = await fetch("manifest.json"); if (!res.ok) throw new Error("Unable to load manifest.json");
      state.manifest = await res.json(); state.pages = flatten(state.manifest.groups);
      makeFilters(); renderTree(); $("searchMeta").textContent = `${state.pages.length} research subgroups indexed`;
      search.addEventListener("input", runSearch);
      ["groupFilter","sourceFilter","sortFilter"].forEach(id => $(id).addEventListener("change", runSearch));
      $("expandAll").addEventListener("click", () => { const all = [...tree.querySelectorAll("details")]; const opening = all.some(d => !d.open); all.forEach(d => d.open = opening); $("expandAll").textContent = opening ? "Collapse all" : "Expand all"; });
      document.addEventListener("keydown", e => { if (e.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) { e.preventDefault(); search.focus(); } if (e.key === "Escape" && document.activeElement === search) { search.value = ""; runSearch(); } });
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && state.pages.some(p => p.id === id)) openPage(id);
      else openPage("overview");
    } catch (err) { tree.innerHTML = `<p class="load-error">${esc(err.message)}. Use a local server to open this site.</p>`; $("searchMeta").textContent = "Index failed to load"; }
  }
  window.addEventListener("DOMContentLoaded", init);
})();