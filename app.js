/* ========================================================================
   EYQ Prototype — Shared Application Logic
   ======================================================================== */

const STATE = {
  role: 'admin',           // 'admin' or 'contributor'
  workspace: 'private',
  tenantPolicy: 'selfserve',
  pricingState: 'estimated',
  datasetApproved: true,
  exportAllowed: false,
  budgetState: 'within',
  navCollapsed: false,
  theme: 'dark',
  favorites: ['rfp-draft', 'policy-qa', 'client-pitch'],
  currentUser: {
    name: 'Alex Morgan', initials: 'AM', role: 'Consultant',
    serviceLine: 'Consulting', email: 'alex.morgan@ey.com',
    tasks: ['Draft proposal', 'Compile credentials', 'Summarize client materials']
  }
};

const WORKSPACES = {
  private: { id: 'private', name: 'My Private', type: 'private', status: 'active', icon: 'P', budget: null, caps: '200 runs/month', engCode: null, desc: 'Personal sandbox for free assets', region: 'US', riskTier: 'Low' },
  acme: { id: 'acme', name: 'ACME Retail RFP Team', type: 'team', status: 'approved', icon: 'A', engCode: 'ENG-ACME-2026-001', owner: 'Jane Patel', budget: 25000, used: 10500, pct: 42, region: 'EU', desc: 'Q2 retail proposal development', lastActivity: '2h ago', participants: [{i:'JP',n:'Jane Patel'},{i:'SK',n:'Sarah Kim'},{i:'RP',n:'Raj Patel'}], agents: ['RFP Draft Agent','Policy Q&A Agent','Controls Packager'], role: 'Admin', riskTier: 'Medium' },
  globo: { id: 'globo', name: 'GloboCo Finance Controls', type: 'team', status: 'approved', icon: 'G', engCode: 'ENG-GLOBO-2026-014', owner: 'Miguel Santos', budget: 40000, used: 26800, pct: 67, region: 'US', desc: 'Finance controls walkthrough engagement', lastActivity: '5h ago', participants: [{i:'MS',n:'Miguel Santos'},{i:'DB',n:'David Brown'},{i:'MG',n:'Maria Garcia'}], agents: ['Controls Evidence Packager','Controls Roleplay'], role: 'Editor', riskTier: 'High' },
  retail: { id: 'retail', name: 'Retail Q2 Pitch', type: 'team', status: 'pending', icon: 'R', engCode: 'ENG-RETAIL-2026-009', owner: 'Lin Wei', budget: 15000, used: 0, pct: 0, region: 'APAC', desc: 'Retail pitch preparation workspace', lastActivity: '1d ago', participants: [{i:'LW',n:'Lin Wei'}], agents: ['Client Pitch Roleplay'], role: 'Editor', riskTier: 'Low' }
};

const ENGAGEMENT_CODES = {
  'ENG-ACME-2026-001': { owner: 'Jane Patel', budget: 25000, region: 'EU', team: ['alex.morgan@ey.com', 'jane.patel@ey.com'] },
  'ENG-GLOBO-2026-014': { owner: 'Miguel Santos', budget: 40000, region: 'US', team: ['miguel.santos@ey.com'] },
  'ENG-RETAIL-2026-009': { owner: 'Lin Wei', budget: 15000, region: 'APAC', team: ['lin.wei@ey.com'] }
};

const ASSETS = {
  agents: [
    { id: 'rfp-draft', type: 'Agent', name: 'RFP Draft Agent', desc: 'Generates proposal drafts using EY RFP templates and credentials dataset.', template: 'RFP v7', risk: 'Low', pricing: 'estimated', cost: '$2.40/run', rating: 4.6, reviews: 128, requiresWorkspace: true, requiresDataset: false, teamUsed: true, isNew: false, whyReasons: ['Matches your "Draft proposal" task','Aligned to Consulting service line','Used by 3 members of your team this week'], govFit: 'good' },
    { id: 'controls-packager', type: 'Agent', name: 'Controls Evidence Packager', desc: 'Bundles walkthrough notes and artifacts into evidence packs.', template: 'Controls Walkthrough v3', risk: 'Medium', pricing: 'estimated', cost: '$3.80/run', rating: 4.3, reviews: 87, requiresWorkspace: true, requiresDataset: true, teamUsed: false, isNew: false, whyReasons: ['Aligned to Assurance methodology','Requires Medium-risk dataset access'], govFit: 'review' },
    { id: 'policy-qa', type: 'Agent', name: 'Policy Q&A Agent', desc: 'Answers internal policy questions grounded in EY policies dataset.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 4.8, reviews: 342, requiresWorkspace: false, requiresDataset: false, teamUsed: true, isNew: false, whyReasons: ['Free to use in any workspace','Top-rated by Consulting users','No dataset approval needed'], govFit: 'good' },
    { id: 'client-intake', type: 'Agent', name: 'Client Intake Agent', desc: 'Automates new client onboarding questionnaires and risk assessment.', template: null, risk: 'Low', pricing: 'estimated', cost: '$1.80/run', rating: 4.1, reviews: 45, requiresWorkspace: true, requiresDataset: false, teamUsed: false, isNew: true, whyReasons: ['New agent for client onboarding','Low risk, easy to adopt'], govFit: 'good' }
  ],
  roleplays: [
    { id: 'client-pitch', type: 'Roleplay', name: 'Client Pitch Roleplay', desc: 'Practice a skeptical stakeholder meeting aligned to EY pitch rubric.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 4.5, reviews: 215, requiresWorkspace: false, requiresDataset: false, teamUsed: true, isNew: false, whyReasons: ['Free practice tool','Matches "Summarize client materials" task'], govFit: 'good' },
    { id: 'controls-walkthrough', type: 'Roleplay', name: 'Controls Walkthrough Roleplay', desc: 'Simulate control owner interviews; scoring against EY methodology.', template: 'Controls Walkthrough v3', risk: 'Medium', pricing: 'estimated', cost: '$1.60/run', rating: 4.4, reviews: 93, requiresWorkspace: true, requiresDataset: false, teamUsed: false, isNew: false, whyReasons: ['Aligned to Controls methodology','Team training tool'], govFit: 'review' }
  ],
  datasets: [
    { id: 'credentials-repo', type: 'Dataset', name: 'EY Credentials Repository', desc: 'Service line/sector tagged portfolio; masked client identifiers; RLS by engagement.', template: null, risk: 'Medium', pricing: 'tbd', cost: 'Cost TBD', rating: 4.2, reviews: 56, requiresWorkspace: true, requiresDataset: true, teamUsed: false, isNew: false, whyReasons: ['Essential for proposal drafting','RLS-protected by engagement'], govFit: 'review' },
    { id: 'policy-library', type: 'Dataset', name: 'Policy & Methodology Library', desc: 'EY policies and methods; sensitivity labeled; legal hold enabled.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 4.7, reviews: 189, requiresWorkspace: false, requiresDataset: false, teamUsed: true, isNew: false, whyReasons: ['Official policy source','No restrictions'], govFit: 'good' }
  ],
  mcp: [
    { id: 'sharepoint', type: 'MCP', name: 'SharePoint Connector', desc: 'Document retrieval/export for EY Tenant.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 4.6, reviews: 203, requiresWorkspace: false, requiresDataset: false, teamUsed: true, isNew: false, whyReasons: ['EY-approved connector','Pre-configured for governance'], govFit: 'good' },
    { id: 'outlook', type: 'MCP', name: 'Outlook Connector', desc: 'Email summarization for EY Tenant.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 4.4, reviews: 167, requiresWorkspace: false, requiresDataset: false, teamUsed: false, isNew: false, whyReasons: ['Email integration','Low risk'], govFit: 'good' },
    { id: 'teams-connector', type: 'MCP', name: 'Teams Connector', desc: 'Meeting summaries and action items extraction.', template: null, risk: 'Low', pricing: 'free', cost: 'Free', rating: 0, reviews: 0, requiresWorkspace: true, requiresDataset: false, teamUsed: false, isNew: true, whyReasons: ['New connector','Meeting productivity'], govFit: 'good' }
  ]
};

const PERSONAS = {
  'Business Analyst': ['Summarize docs', 'Draft client deck', 'Extract tables', 'Create workspace for engagement', 'Data visualization'],
  'Accountant': ['Import trial balance', 'Tie out figures', 'Policy Q&A', 'Create evidence package', 'Reconciliation check'],
  'Delivery Manager': ['Create workspace', 'Set budgets/caps', 'Assign roleplays', 'Approve access', 'Review spend'],
  'Engagement Manager': ['Create workspace', 'Set budgets/caps', 'Assign roleplays', 'Approve access', 'Review ROI'],
  'UX Designer': ['Synthesize research notes', 'Generate personas', 'Draft wireframe copy', 'Stakeholder interview roleplay', 'Usability testing'],
  'Consultant': ['Draft proposal', 'Compile credentials', 'Summarize client materials', 'Request dataset access', 'Client pitch prep'],
  'Manager': ['Approve workspace requests', 'Review spend', 'Assign mandatory roleplay', 'Budget override', 'Team analytics'],
  'Data Analyst': ['Connect dataset', 'Build RAG agent', 'Run structured extraction', 'Test in sandbox', 'Data profiling'],
  'Hiring Manager': ['Draft JD', 'Interview roleplay', 'Screen candidates', 'Create hiring campaign workspace', 'Onboarding prep'],
  'Developer': ['Start from blueprint', 'Debug agent', 'Request connector', 'Publish to marketplace', 'API integration']
};

const SERVICE_LINES = ['Fabric', 'Assurance', 'Tax', 'Consulting', 'Strategy and Transactions', 'Internal Functions'];

/* ---- Helpers ---- */
function isAdmin() { return STATE.role === 'admin'; }
function getActiveWorkspace() {
  if (STATE.workspace === 'private') return WORKSPACES.private;
  if (STATE.workspace === 'approved') return WORKSPACES.acme;
  if (STATE.workspace === 'pending') return WORKSPACES.retail;
  return WORKSPACES.private;
}
function isInTeamWorkspace() { return STATE.workspace !== 'private'; }
function isApprovedWorkspace() { return STATE.workspace === 'approved'; }
function isPendingWorkspace() { return STATE.workspace === 'pending'; }
function canRunPaidAsset() { return isApprovedWorkspace(); }
function getAllAssets() { return [...ASSETS.agents, ...ASSETS.roleplays, ...ASSETS.datasets, ...ASSETS.mcp]; }
function isFavorite(id) { return STATE.favorites.includes(id); }
function toggleFavorite(id) {
  const idx = STATE.favorites.indexOf(id);
  if (idx >= 0) STATE.favorites.splice(idx, 1);
  else STATE.favorites.push(id);
  if (typeof updatePageUI === 'function') updatePageUI();
}

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function show(el) { if (el) el.classList.remove('hidden'); }
function hide(el) { if (el) el.classList.add('hidden'); }
function toggle(el) { if (el) el.classList.toggle('hidden'); }

function typeIcon(type) {
  const icons = { Agent: 'fa-robot', Roleplay: 'fa-comments', Dataset: 'fa-database', MCP: 'fa-plug' };
  return icons[type] || 'fa-cube';
}
function typeClass(type) { return type.toLowerCase().replace('/', ''); }
function riskBadge(risk) {
  const cls = { Low: 'badge-low', Medium: 'badge-med', High: 'badge-high' };
  return `<span class="badge ${cls[risk] || 'badge-low'}">${risk} Risk</span>`;
}
function pricingBadge(pricing, cost) {
  if (pricing === 'free') return '<span class="badge badge-free">Free</span>';
  if (pricing === 'estimated') return `<span class="badge badge-estimated">Est: ${cost}</span>`;
  return '<span class="badge badge-tbd">Cost TBD</span>';
}
function requiresChip(asset) {
  if (asset.requiresWorkspace) return '<span class="requires-chip">Requires Workspace + Engagement Code</span>';
  return '';
}
function starRating(rating) {
  if (!rating) return '<span class="asset-rating text-muted">No ratings yet</span>';
  const full = Math.floor(rating);
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (rating % 1 >= 0.3) html += '<i class="fas fa-star-half-alt"></i>';
  return `<span class="asset-rating">${html} ${rating}</span>`;
}
function govFitBadge(fit) {
  const map = { good: ['Good fit','good'], review: ['Review needed','review'], blocked: ['Blocked','blocked'] };
  const [label, cls] = map[fit] || map.good;
  return `<span class="governance-fit ${cls}"><i class="fas fa-shield-alt"></i> ${label}</span>`;
}

/* ---- Asset Card (no Run; role-aware CTA) ---- */
function renderAssetCard(asset, showWhy) {
  const favIcon = isFavorite(asset.id) ? 'fas fa-star' : 'far fa-star';
  const newBadge = asset.isNew ? '<span class="new-badge">New</span>' : '';
  const whyHtml = (showWhy !== false && asset.whyReasons) ? `
    <div class="why-reasons">
      <div class="why-label">Why this result</div>
      <ul>${asset.whyReasons.slice(0,2).map(r => `<li>${r}</li>`).join('')}</ul>
    </div>` : '';

  const ctaLabel = isAdmin() ? 'Add to Workspace' : 'Request add to Workspace';
  const ctaFn = isAdmin() ? 'openAddToWorkspaceModal' : 'openRequestAddModal';

  return `
    <div class="asset-card" data-asset-id="${asset.id}" onclick="navigateToAsset('${asset.id}')">
      ${newBadge}
      <div class="asset-card-top">
        <div class="asset-type-icon ${typeClass(asset.type)}"><i class="fas ${typeIcon(asset.type)}"></i></div>
        <div style="display:flex;align-items:center;gap:6px">
          ${asset.teamUsed ? '<span class="text-xs text-muted"><i class="fas fa-users"></i></span>' : ''}
          <i class="${favIcon}" style="color:var(--text-primary);cursor:pointer;font-size:12px" onclick="event.stopPropagation();toggleFavorite('${asset.id}')"></i>
        </div>
      </div>
      <div class="asset-card-name">${asset.name}</div>
      <div class="asset-card-desc">${asset.desc}</div>
      <div class="asset-card-badges">
        <span class="badge" style="background:var(--chip-bg);color:var(--ey-gray-600)">${asset.type}</span>
        ${riskBadge(asset.risk)}
        ${pricingBadge(asset.pricing, asset.cost)}
        ${asset.template ? `<span class="chip chip-default">${asset.template}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        ${starRating(asset.rating)}
        ${govFitBadge(asset.govFit)}
      </div>
      ${requiresChip(asset) ? `<div style="margin-bottom:6px">${requiresChip(asset)}</div>` : ''}
      ${whyHtml}
      <div class="asset-card-footer" style="margin-top:8px">
        <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();${ctaFn}('${asset.id}')">
          <i class="fas ${isAdmin() ? 'fa-plus' : 'fa-paper-plane'}"></i> ${ctaLabel}
        </button>
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();navigateToAsset('${asset.id}')">
          View details
        </button>
      </div>
    </div>`;
}

/* ---- Add to Workspace Modal (Admin) ---- */
function openAddToWorkspaceModal(assetId) {
  const asset = getAllAssets().find(a => a.id === assetId);
  if (!asset) return;
  const teamWs = Object.values(WORKSPACES).filter(w => w.type === 'team');
  let overlay = $('#add-ws-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'add-ws-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:560px"><div class="modal-header"><h2>Add to Workspace</h2><button class="modal-close" onclick="closeModal('add-ws-modal')">&times;</button></div><div class="modal-body" id="add-ws-body"></div><div class="modal-footer" id="add-ws-footer"></div></div>`;
    document.body.appendChild(overlay);
  }
  const body = $('#add-ws-body');
  const footer = $('#add-ws-footer');
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding:12px;background:var(--chip-bg);border-radius:var(--radius-md)">
      <div class="asset-type-icon ${typeClass(asset.type)}"><i class="fas ${typeIcon(asset.type)}"></i></div>
      <div><div style="font-weight:600">${asset.name}</div><div class="text-xs text-muted">${asset.type} &bull; ${asset.risk} Risk &bull; ${asset.cost}</div></div>
    </div>
    <div class="form-group"><label>Select existing workspace</label>
    <div style="display:flex;flex-direction:column;gap:8px" id="add-ws-list">
      ${teamWs.map(ws => `
        <div class="ws-select-item" onclick="selectWorkspaceForAdd(this,'${ws.id}')" data-ws="${ws.id}" style="display:flex;align-items:center;gap:12px;padding:12px;border:2px solid var(--card-border);border-radius:var(--radius-md);cursor:pointer;transition:all var(--transition)">
          <div class="avatar" style="width:32px;height:32px;background:${ws.status==='approved'?'var(--ey-green)':'var(--ey-orange)'};color:#1A1A24;font-size:12px">${ws.icon}</div>
          <div style="flex:1"><div style="font-weight:600;font-size:0.857rem">${ws.name}</div><div class="text-xs text-muted">${ws.engCode} &bull; ${ws.region}${ws.status==='pending'?' &bull; Pending':''}</div></div>
          ${ws.budget ? `<div style="text-align:right"><div class="text-xs text-muted">${ws.pct}% used</div><div style="width:60px;height:4px;background:var(--card-border);border-radius:2px;overflow:hidden"><div style="width:${ws.pct}%;height:100%;border-radius:2px;background:${ws.pct>75?'var(--ey-orange)':'var(--ey-green)'}"></div></div></div>` : ''}
        </div>`).join('')}
    </div></div>
    <div style="text-align:center;padding:12px;border-top:1px solid var(--card-border);margin-top:12px">
      <button class="btn btn-secondary" onclick="closeModal('add-ws-modal');openWorkspaceModal()"><i class="fas fa-plus-circle"></i> Create new Workspace instead</button>
    </div>
    ${asset.requiresDataset ? '<div style="padding:10px;background:var(--badge-warning-bg);border-radius:var(--radius-md);margin-top:12px;font-size:0.857rem;color:var(--ey-orange);display:flex;align-items:center;gap:8px"><i class="fas fa-exclamation-triangle"></i> This asset requires dataset access. Approval may be needed.</div>' : ''}`;
  footer.innerHTML = `<div></div><button class="btn btn-primary" id="confirm-add-btn" disabled onclick="confirmAddToWorkspace('${asset.id}')"><i class="fas fa-check"></i> Add to Workspace</button>`;
  openModal('add-ws-modal');
}

let selectedWsForAdd = null;
function selectWorkspaceForAdd(el, wsId) {
  $$('#add-ws-list .ws-select-item').forEach(i => i.style.borderColor = 'var(--card-border)');
  el.style.borderColor = 'var(--text-primary)';
  selectedWsForAdd = wsId;
  const btn = $('#confirm-add-btn');
  if (btn) btn.disabled = false;
}

function confirmAddToWorkspace(assetId) {
  const ws = WORKSPACES[selectedWsForAdd];
  if (!ws) return;
  const asset = getAllAssets().find(a => a.id === assetId);
  const body = $('#add-ws-body');
  const footer = $('#add-ws-footer');
  const lockedNote = ws.status === 'pending' ? '<div style="padding:10px;background:var(--badge-warning-bg);border-radius:var(--radius-md);margin-top:12px;font-size:0.857rem;color:var(--ey-orange);display:flex;align-items:center;gap:8px"><i class="fas fa-lock"></i> Locked until approval &mdash; workspace is pending. Free assets available now.</div>' : '';
  body.innerHTML = `<div class="completion-state"><div class="completion-icon approved"><i class="fas fa-check"></i></div><h2>${asset ? asset.name : 'Asset'} added to ${ws.name}</h2><p style="margin-top:8px;color:var(--ey-gray-600)">The asset is now available in the workspace's Assets tab.</p>${lockedNote}</div>`;
  footer.innerHTML = `<div></div><div style="display:flex;gap:8px"><a href="workspace-home.html?ws=${ws.id}" class="btn btn-primary">Open Workspace</a><button class="btn btn-secondary" onclick="closeModal('add-ws-modal')">Close</button></div>`;
  selectedWsForAdd = null;
}

/* ---- Request add to Workspace Modal (Contributor) ---- */
function openRequestAddModal(assetId) {
  const asset = getAllAssets().find(a => a.id === assetId);
  if (!asset) return;
  const teamWs = Object.values(WORKSPACES).filter(w => w.type === 'team');
  let overlay = $('#request-ws-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'request-ws-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:520px"><div class="modal-header"><h2>Request add to Workspace</h2><button class="modal-close" onclick="closeModal('request-ws-modal')">&times;</button></div><div class="modal-body" id="request-ws-body"></div><div class="modal-footer" id="request-ws-footer"></div></div>`;
    document.body.appendChild(overlay);
  }
  const body = $('#request-ws-body');
  const footer = $('#request-ws-footer');
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding:12px;background:var(--chip-bg);border-radius:var(--radius-md)">
      <div class="asset-type-icon ${typeClass(asset.type)}"><i class="fas ${typeIcon(asset.type)}"></i></div>
      <div><div style="font-weight:600">${asset.name}</div><div class="text-xs text-muted">${asset.type} &bull; ${asset.risk} Risk &bull; ${asset.cost}</div></div>
    </div>
    <div class="form-group"><label>Select workspace to request addition</label>
    <div style="display:flex;flex-direction:column;gap:8px" id="request-ws-list">
      ${teamWs.length ? teamWs.map(ws => `
        <div class="ws-select-item" onclick="selectWorkspaceForRequest(this,'${ws.id}')" data-ws="${ws.id}" style="display:flex;align-items:center;gap:12px;padding:12px;border:2px solid var(--card-border);border-radius:var(--radius-md);cursor:pointer;transition:all var(--transition)">
          <div class="avatar" style="width:32px;height:32px;background:${ws.status==='approved'?'var(--ey-green)':'var(--ey-orange)'};color:#1A1A24;font-size:12px">${ws.icon}</div>
          <div style="flex:1"><div style="font-weight:600;font-size:0.857rem">${ws.name}</div><div class="text-xs text-muted">${ws.engCode} &bull; Admin: ${ws.owner}</div></div>
        </div>`).join('') : '<div style="padding:16px;text-align:center;color:var(--ey-gray-500)">You don\'t belong to any team workspaces.</div>'}
    </div></div>
    <div class="form-group"><label>Reason (optional)</label><textarea class="form-input" rows="2" placeholder="Why do you need this asset?" id="request-reason"></textarea></div>`;
  footer.innerHTML = `<div></div><button class="btn btn-primary" id="confirm-request-btn" disabled onclick="confirmRequestAdd('${asset.id}')"><i class="fas fa-paper-plane"></i> Send Request</button>`;
  openModal('request-ws-modal');
}

let selectedWsForRequest = null;
function selectWorkspaceForRequest(el, wsId) {
  $$('#request-ws-list .ws-select-item').forEach(i => i.style.borderColor = 'var(--card-border)');
  el.style.borderColor = 'var(--text-primary)';
  selectedWsForRequest = wsId;
  const btn = $('#confirm-request-btn');
  if (btn) btn.disabled = false;
}

function confirmRequestAdd(assetId) {
  const ws = WORKSPACES[selectedWsForRequest];
  if (!ws) return;
  const asset = getAllAssets().find(a => a.id === assetId);
  const body = $('#request-ws-body');
  const footer = $('#request-ws-footer');
  body.innerHTML = `<div class="completion-state"><div class="completion-icon pending"><i class="fas fa-paper-plane"></i></div><h2>Request sent</h2><p style="margin-top:8px;color:var(--ey-gray-600)">Your request to add <strong>${asset ? asset.name : 'this asset'}</strong> to <strong>${ws.name}</strong> has been sent to the workspace admin (<strong>${ws.owner}</strong>).</p><div style="margin-top:12px"><span class="chip chip-orange">Pending approval</span></div></div>`;
  footer.innerHTML = `<div></div><button class="btn btn-secondary" onclick="closeModal('request-ws-modal')">Close</button>`;
  selectedWsForRequest = null;
}

/* ---- Left Navigation ---- */
function renderLeftNav() {
  const nav = $('.left-nav');
  if (!nav) return;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  nav.innerHTML = `
    <div class="nav-brand">
      <span class="logo-mark" style="width:24px;height:24px;font-size:10px">EY</span>
      <span class="nav-brand-text">EYQ</span>
    </div>
    <div class="nav-group">
      <div class="nav-item ${currentPage === 'index.html' ? 'active' : ''}" data-tooltip="Home">
        <a class="nav-item-content" href="index.html">
          <span class="nav-icon"><i class="fas fa-home"></i></span>
          <span class="nav-label">Home</span>
        </a>
      </div>
      <div class="nav-item ${currentPage === 'finder.html' ? 'active' : ''}" data-tooltip="Finder">
        <a class="nav-item-content" href="finder.html">
          <span class="nav-icon"><i class="fas fa-search"></i></span>
          <span class="nav-label">Finder</span>
        </a>
      </div>
      <div class="nav-item expanded" data-tooltip="Workspaces" onclick="this.classList.toggle('expanded')">
        <div class="nav-item-content">
          <span class="nav-icon"><i class="fas fa-folder"></i></span>
          <span class="nav-label">Workspaces</span>
          <span class="nav-expand-arrow"><i class="fas fa-chevron-down"></i></span>
        </div>
      </div>
      <div class="nav-children">
        <div class="nav-item" data-tooltip="My Private">
          <a class="nav-item-content" href="workspace-home.html?ws=private">
            <span class="nav-label">My Private</span>
          </a>
        </div>
        <div class="nav-item" data-tooltip="ACME Retail">
          <a class="nav-item-content" href="workspace-home.html?ws=acme">
            <span class="nav-label">ACME Retail RFP Team</span>
            <span class="nav-sublabel" style="font-size:9px;color:var(--ey-gray-500)">ENG-ACME-2026-001</span>
          </a>
        </div>
        <div class="nav-item" data-tooltip="GloboCo Finance">
          <a class="nav-item-content" href="workspace-home.html?ws=globo">
            <span class="nav-label">GloboCo Finance Controls</span>
            <span class="nav-sublabel" style="font-size:9px;color:var(--ey-gray-500)">ENG-GLOBO-2026-014</span>
          </a>
        </div>
        <div class="nav-item" data-tooltip="Retail Q2">
          <a class="nav-item-content" href="workspace-home.html?ws=retail">
            <span class="nav-label">Retail Q2 Pitch</span>
            <span class="nav-sublabel" style="font-size:9px;color:var(--ey-gray-500)">ENG-RETAIL-2026-009 &bull; Pending</span>
          </a>
        </div>
      </div>
      <div class="nav-item expanded" data-tooltip="Assets" onclick="this.classList.toggle('expanded')">
        <div class="nav-item-content">
          <span class="nav-icon"><i class="fas fa-th"></i></span>
          <span class="nav-label">Assets</span>
          <span class="nav-expand-arrow"><i class="fas fa-chevron-down"></i></span>
        </div>
      </div>
      <div class="nav-children">
        <div class="nav-item"><a class="nav-item-content" href="finder.html?type=agent"><span class="nav-label">Agents</span></a></div>
        <div class="nav-item"><a class="nav-item-content" href="finder.html?type=roleplay"><span class="nav-label">Roleplays</span></a></div>
        <div class="nav-item"><a class="nav-item-content" href="finder.html?type=dataset"><span class="nav-label">Datasets</span></a></div>
        <div class="nav-item"><a class="nav-item-content" href="finder.html?type=mcp"><span class="nav-label">MCP/Connectors</span></a></div>
      </div>
      <div class="nav-item ${currentPage === 'agent-studio.html' ? 'active' : ''}" data-tooltip="Agent Studio">
        <a class="nav-item-content" href="agent-studio.html">
          <span class="nav-icon"><i class="fas fa-flask"></i></span>
          <span class="nav-label">Build &mdash; Agent Studio</span>
        </a>
      </div>
      <div class="nav-item ${currentPage === 'approvals.html' ? 'active' : ''}" data-tooltip="Approvals">
        <a class="nav-item-content" href="approvals.html">
          <span class="nav-icon"><i class="fas fa-check-circle"></i></span>
          <span class="nav-label">Approvals</span>
          <span class="nav-badge">5</span>
        </a>
      </div>
      <div class="nav-item ${currentPage === 'budgets.html' ? 'active' : ''}" data-tooltip="Budgets & Reporting">
        <a class="nav-item-content" href="budgets.html">
          <span class="nav-icon"><i class="fas fa-chart-bar"></i></span>
          <span class="nav-label">Budgets &amp; Reporting</span>
          ${STATE.budgetState === 'softcap' ? '<span class="nav-alert-dot"></span>' : ''}
        </a>
      </div>
      <div class="nav-item ${currentPage === 'steward.html' ? 'active' : ''}" data-tooltip="Steward Console">
        <a class="nav-item-content" href="steward.html">
          <span class="nav-icon"><i class="fas fa-database"></i></span>
          <span class="nav-label">Steward Console</span>
        </a>
      </div>
    </div>
    <div class="nav-group">
      <div class="nav-group-title">Administration</div>
      <div class="nav-item" data-tooltip="Admin Settings">
        <a class="nav-item-content" href="#" onclick="event.preventDefault();openAdminSettings()">
          <span class="nav-icon"><i class="fas fa-cog"></i></span>
          <span class="nav-label">Admin Settings</span>
        </a>
      </div>
      <div class="nav-item" data-tooltip="Help & Policies">
        <a class="nav-item-content" href="#" onclick="event.preventDefault()">
          <span class="nav-icon"><i class="fas fa-book"></i></span>
          <span class="nav-label">Help &amp; Policies</span>
        </a>
      </div>
    </div>
    <div class="nav-collapse-btn" onclick="toggleNavCollapse()" role="button" tabindex="0" aria-label="Toggle navigation">
      <span class="nav-icon"><i class="fas fa-${STATE.navCollapsed ? 'chevron-right' : 'chevron-left'}"></i></span>
      <span class="nav-collapse-label">${STATE.navCollapsed ? 'Expand' : 'Collapse'}</span>
    </div>`;
}

function toggleNavCollapse() {
  STATE.navCollapsed = !STATE.navCollapsed;
  const nav = $('.left-nav');
  if (nav) nav.classList.toggle('collapsed', STATE.navCollapsed);
  document.body.classList.toggle('nav-collapsed', STATE.navCollapsed);
  renderLeftNav();
}

function openAdminSettings() {
  const html = `
    <div class="form-group">
      <label>Tenant Policy</label>
      <div style="display:flex;gap:12px">
        <label style="display:flex;align-items:center;gap:6px;font-weight:normal;text-transform:none;letter-spacing:0;cursor:pointer">
          <input type="radio" name="tenant-policy" value="selfserve" ${STATE.tenantPolicy === 'selfserve' ? 'checked' : ''} onchange="STATE.tenantPolicy='selfserve';updateAllUI()"> Self-serve with approval
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-weight:normal;text-transform:none;letter-spacing:0;cursor:pointer">
          <input type="radio" name="tenant-policy" value="manageronly" ${STATE.tenantPolicy === 'manageronly' ? 'checked' : ''} onchange="STATE.tenantPolicy='manageronly';updateAllUI()"> Manager-only creation
        </label>
      </div>
    </div>`;
  showInlineModal('Admin Settings', html);
}

function showInlineModal(title, bodyHtml) {
  let overlay = $('#inline-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'inline-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:480px"><div class="modal-header"><h2></h2><button class="modal-close" onclick="closeModal('inline-modal')">&times;</button></div><div class="modal-body"></div></div>`;
    document.body.appendChild(overlay);
  }
  overlay.querySelector('.modal-header h2').textContent = title;
  overlay.querySelector('.modal-body').innerHTML = bodyHtml;
  openModal('inline-modal');
}

/* ---- Banners ---- */
function updateBanners() {
  const area = $('#banner-area');
  if (!area) return;
  let html = '';
  if (STATE.workspace === 'private') {
    html += `<div class="banner banner-info"><i class="fas fa-info-circle"></i><span>Use free assets in My Private (limits apply). Create a Team Workspace for paid assets.</span>${isAdmin() ? '<button class="btn btn-sm btn-secondary" onclick="openWorkspaceModal()">Create Team Workspace</button>' : ''}</div>`;
  } else if (STATE.workspace === 'pending') {
    html += `<div class="banner banner-warning"><i class="fas fa-clock"></i><span>Awaiting manager approval &mdash; free assets available. <a href="#" onclick="event.preventDefault();alert('Reminder sent!')">Nudge approver</a></span></div>`;
  }
  area.innerHTML = html;
}

/* ---- State Switcher ---- */
function updateStateSwitcher() {
  const body = $('.state-switcher-body');
  if (!body) return;
  body.innerHTML = `
    <label>Role <select onchange="STATE.role=this.value;updateAllUI()">
      <option value="admin" ${STATE.role === 'admin' ? 'selected' : ''}>Admin</option>
      <option value="contributor" ${STATE.role === 'contributor' ? 'selected' : ''}>Contributor</option>
    </select></label>
    <label>Workspace <select onchange="STATE.workspace=this.value;updateAllUI()">
      <option value="private" ${STATE.workspace === 'private' ? 'selected' : ''}>No Team WS</option>
      <option value="approved" ${STATE.workspace === 'approved' ? 'selected' : ''}>Approved (ACME)</option>
      <option value="pending" ${STATE.workspace === 'pending' ? 'selected' : ''}>Pending (Retail)</option>
    </select></label>
    <label>Policy <select onchange="STATE.tenantPolicy=this.value;updateAllUI()">
      <option value="selfserve" ${STATE.tenantPolicy === 'selfserve' ? 'selected' : ''}>Self-serve + Approval</option>
      <option value="manageronly" ${STATE.tenantPolicy === 'manageronly' ? 'selected' : ''}>Manager-only</option>
    </select></label>
    <label>Dataset <select onchange="STATE.datasetApproved=this.value==='true';updateAllUI()">
      <option value="true" ${STATE.datasetApproved ? 'selected' : ''}>Approved</option>
      <option value="false" ${!STATE.datasetApproved ? 'selected' : ''}>Not Approved</option>
    </select></label>
    <label>Budget <select onchange="STATE.budgetState=this.value;updateAllUI()">
      <option value="within" ${STATE.budgetState === 'within' ? 'selected' : ''}>Within budget</option>
      <option value="softcap" ${STATE.budgetState === 'softcap' ? 'selected' : ''}>Soft cap alert</option>
      <option value="hardcap" ${STATE.budgetState === 'hardcap' ? 'selected' : ''}>Hard cap block</option>
    </select></label>
    <label>Export <select onchange="STATE.exportAllowed=this.value==='true';updateAllUI()">
      <option value="false" ${!STATE.exportAllowed ? 'selected' : ''}>Blocked</option>
      <option value="true" ${STATE.exportAllowed ? 'selected' : ''}>Allowed</option>
    </select></label>
    <label>Nav <select onchange="STATE.navCollapsed=this.value==='true';document.querySelector('.left-nav')?.classList.toggle('collapsed',STATE.navCollapsed);document.body.classList.toggle('nav-collapsed',STATE.navCollapsed);renderLeftNav()">
      <option value="false" ${!STATE.navCollapsed ? 'selected' : ''}>Expanded</option>
      <option value="true" ${STATE.navCollapsed ? 'selected' : ''}>Collapsed</option>
    </select></label>`;
}
function toggleStateSwitcher() { toggle($('.state-switcher-body')); }

/* ---- Modal Helpers ---- */
function openModal(id) { const o = $(`#${id}`); if (o) o.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { const o = $(`#${id}`); if (o) o.classList.remove('open'); document.body.style.overflow = ''; }
function closeAllModals() { $$('.modal-overlay, .run-panel-overlay').forEach(m => m.classList.remove('open')); document.body.style.overflow = ''; }

/* ---- Workspace Creation Modal ---- */
let wsCreateStep = 1;
let wsCreateData = {};

function openWorkspaceModal() {
  if (!isAdmin() && STATE.tenantPolicy === 'manageronly') { alert('Workspace creation is restricted to managers. Contact your engagement manager.'); return; }
  wsCreateStep = 1; wsCreateData = {};
  renderWSCreateStep();
  openModal('ws-create-modal');
}

function renderWSCreateStep() {
  const body = $('#ws-create-body');
  const footer = $('#ws-create-footer');
  if (!body) return;
  $$('.stepper .step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 < wsCreateStep) s.classList.add('completed');
    if (i + 1 === wsCreateStep) s.classList.add('active');
  });
  if (wsCreateStep === 1) {
    body.innerHTML = `<div class="form-group"><label>Workspace Name</label><input class="form-input" id="ws-name" placeholder="e.g., ACME Retail RFP Team" value="${wsCreateData.name || ''}"></div>
      <div class="form-row"><div class="form-group"><label>Service Line</label><select class="form-select" id="ws-sl"><option value="">Select...</option>${SERVICE_LINES.map(s => `<option ${wsCreateData.serviceLine === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="form-group"><label>Industry</label><select class="form-select"><option value="">Select...</option><option>Retail &amp; Consumer</option><option>Financial Services</option><option>Technology</option><option>Health &amp; Life Sciences</option><option>Government</option></select></div></div>
      <div class="form-row"><div class="form-group"><label>Region / Residency</label><select class="form-select"><option value="">Select...</option><option>US</option><option>EU</option><option>APAC</option><option>UK</option></select></div>
      <div class="form-group"><label>Template</label><select class="form-select"><option value="">None</option><option>RFP delivery</option><option>Controls walkthrough</option><option>Audit engagement</option></select></div></div>`;
    footer.innerHTML = `<div></div><button class="btn btn-primary" onclick="wsCreateNext()">Next: Engagement Code <i class="fas fa-arrow-right"></i></button>`;
  } else if (wsCreateStep === 2) {
    body.innerHTML = `<div class="form-group"><label>Engagement Code</label><div style="display:flex;gap:8px"><input class="form-input" id="ws-engcode" placeholder="e.g., ENG-ACME-2026-001" value="${wsCreateData.engCode || ''}"><button class="btn btn-secondary" onclick="validateEngCode()"><i class="fas fa-check-circle"></i> Validate</button></div><div class="form-help">Enter the engagement code to link budget and governance.</div></div><div id="code-validation-result"></div>`;
    footer.innerHTML = `<button class="btn btn-secondary" onclick="wsCreateStep=1;renderWSCreateStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" id="ws-step2-next" disabled onclick="wsCreateNext()">Next <i class="fas fa-arrow-right"></i></button>`;
  } else if (wsCreateStep === 3) {
    body.innerHTML = `<div class="form-group"><label>Add Members</label><input class="form-input" placeholder="Search by name or SSO group...">
      <div class="member-list" style="margin-top:12px"><div class="member-item"><div class="avatar">AM</div><span>Alex Morgan (you)</span><span class="chip chip-blue">Owner</span></div><div class="member-item"><div class="avatar">JP</div><span>Jane Patel</span><span class="chip chip-default">Member</span></div></div></div>
      <div class="form-group"><label>Initial Assets</label><div style="display:flex;flex-wrap:wrap;gap:6px">${getAllAssets().slice(0, 5).map(a => `<span class="chip chip-clickable chip-outline" onclick="this.classList.toggle('active')">${a.name}</span>`).join('')}</div></div>`;
    footer.innerHTML = `<button class="btn btn-secondary" onclick="wsCreateStep=2;renderWSCreateStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" onclick="wsCreateNext()">Next <i class="fas fa-arrow-right"></i></button>`;
  } else if (wsCreateStep === 4) {
    body.innerHTML = `<div class="form-group"><label>Monthly Budget</label><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:600">$</span><input class="form-input" type="number" value="1500" style="max-width:180px"><span class="text-sm text-muted">/month</span></div></div>
      <div class="form-row"><div class="form-group"><label>Soft Cap</label><div style="display:flex;align-items:center;gap:8px"><input class="form-input" type="number" value="75" style="max-width:100px"><span class="text-sm text-muted">%</span></div></div>
      <div class="form-group"><label>Hard Cap</label><div style="display:flex;align-items:center;gap:8px"><input class="form-input" type="number" value="100" style="max-width:100px"><span class="text-sm text-muted">%</span></div></div></div>
      <div class="form-group"><label>Per-User Weekly Cap</label><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:600">$</span><input class="form-input" type="number" value="100" style="max-width:180px"><span class="text-sm text-muted">/week</span></div></div>
      <div class="form-group"><label>Export Destinations</label><div style="display:flex;flex-direction:column;gap:8px">
        <label style="display:flex;align-items:center;gap:8px;font-size:0.857rem;text-transform:none;font-weight:normal;letter-spacing:0"><input type="checkbox" checked> EY SharePoint</label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.857rem;text-transform:none;font-weight:normal;letter-spacing:0"><input type="checkbox"> External email (requires approval)</label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.857rem;text-transform:none;font-weight:normal;letter-spacing:0"><input type="checkbox" disabled> Third-party storage <span class="text-xs text-muted">(Blocked)</span></label>
      </div></div>`;
    footer.innerHTML = `<button class="btn btn-secondary" onclick="wsCreateStep=3;renderWSCreateStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary btn-lg" onclick="wsCreateComplete()"><i class="fas fa-check"></i> Create Workspace</button>`;
  }
}

function wsCreateNext() {
  if (wsCreateStep === 1) { wsCreateData.name = $('#ws-name')?.value || ''; wsCreateData.serviceLine = $('#ws-sl')?.value || ''; }
  wsCreateStep++;
  renderWSCreateStep();
}

function validateEngCode() {
  const input = $('#ws-engcode');
  const result = $('#code-validation-result');
  const nextBtn = $('#ws-step2-next');
  if (!input || !result) return;
  const code = input.value.trim();
  const eng = ENGAGEMENT_CODES[code];
  if (!eng) {
    result.innerHTML = `<div class="code-validation error"><i class="fas fa-times-circle" style="color:var(--ey-red)"></i><div class="code-validation-info"><strong>Invalid code</strong><p>No engagement found for "${code}".</p></div></div>`;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }
  wsCreateData.engCode = code;
  const onTeam = eng.team.includes(STATE.currentUser.email);
  if (onTeam) {
    result.innerHTML = `<div class="code-validation success"><i class="fas fa-check-circle" style="color:var(--ey-green)"></i><div class="code-validation-info"><strong>Verified &mdash; Auto-approved</strong><p>Owner: ${eng.owner} &bull; Budget: $${eng.budget.toLocaleString()} &bull; Region: ${eng.region}</p><p style="color:var(--ey-green);font-size:0.786rem;margin-top:4px">You are on the engagement team.</p></div></div>`;
  } else {
    result.innerHTML = `<div class="code-validation pending"><i class="fas fa-clock" style="color:var(--ey-orange)"></i><div class="code-validation-info"><strong>Verified &mdash; Approval required</strong><p>Owner: ${eng.owner} &bull; Budget: $${eng.budget.toLocaleString()} &bull; Region: ${eng.region}</p><p style="color:var(--ey-orange);font-size:0.786rem;margin-top:4px">Not on engagement team. ${eng.owner} will be notified. Free assets available while pending.</p></div></div>`;
  }
  if (nextBtn) nextBtn.disabled = false;
}

function wsCreateComplete() {
  const body = $('#ws-create-body');
  if (!body) return;
  const eng = ENGAGEMENT_CODES[wsCreateData.engCode];
  const onTeam = eng && eng.team.includes(STATE.currentUser.email);
  if (onTeam) {
    body.innerHTML = `<div class="completion-state"><div class="completion-icon approved"><i class="fas fa-check"></i></div><h2>Workspace Created &mdash; Ready to Use</h2><p style="margin-top:8px">"<strong>${wsCreateData.name || 'New Workspace'}</strong>" linked to <strong>${wsCreateData.engCode}</strong>.</p><p style="margin-top:4px;color:var(--ey-green)">You can now run paid assets.</p><div style="margin-top:20px;display:flex;gap:8px;justify-content:center"><a href="workspace-home.html?ws=acme" class="btn btn-primary">Go to Workspace</a><button class="btn btn-secondary" onclick="closeModal('ws-create-modal')">Close</button></div></div>`;
  } else {
    body.innerHTML = `<div class="completion-state"><div class="completion-icon pending"><i class="fas fa-clock"></i></div><h2>Workspace Created &mdash; Pending Approval</h2><p style="margin-top:8px">Awaiting approval from <strong>${eng?.owner}</strong>.</p><p style="margin-top:4px;color:var(--ey-orange)">Free assets available while pending.</p><div style="margin-top:20px;display:flex;gap:8px;justify-content:center"><a href="workspace-home.html?ws=retail" class="btn btn-primary">Use Free Assets</a><button class="btn btn-secondary" onclick="alert('Reminder sent!')">Nudge Approver</button></div></div>`;
  }
  $('#ws-create-footer').innerHTML = '';
}

/* ---- Navigation Helpers ---- */
function navigateToAsset(id) { window.location.href = `asset-detail.html?id=${id}`; }
function navigateTo(page) { window.location.href = page; }

/* ---- Theme ---- */
function toggleTheme() {
  const isDark = document.body.classList.contains('motif-theme-dark');
  document.body.classList.remove('motif-theme-light', 'motif-theme-dark');
  document.body.classList.add(isDark ? 'motif-theme-light' : 'motif-theme-dark');
  STATE.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('eyq-theme', STATE.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = $('#theme-toggle-btn');
  if (!btn) return;
  btn.innerHTML = STATE.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  btn.title = STATE.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

function initTheme() {
  const saved = localStorage.getItem('eyq-theme') || 'dark';
  STATE.theme = saved;
  document.body.classList.remove('motif-theme-light', 'motif-theme-dark');
  document.body.classList.add(saved === 'dark' ? 'motif-theme-dark' : 'motif-theme-light');
  updateThemeIcon();
}

/* ---- Update All ---- */
function updateAllUI() {
  updateBanners();
  updateStateSwitcher();
  renderLeftNav();
  updateRoleIndicator();
  if (typeof updatePageUI === 'function') updatePageUI();
}

function updateRoleIndicator() {
  const el = $('#role-indicator');
  if (el) el.innerHTML = `<i class="fas ${isAdmin() ? 'fa-shield-alt' : 'fa-user'}"></i> ${isAdmin() ? 'Admin' : 'Contributor'}`;
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateAllUI();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
});
