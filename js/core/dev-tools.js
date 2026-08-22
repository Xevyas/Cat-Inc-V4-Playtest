(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const actions = Object.create(null);
  let runtime = null;
  let lastSummary = "No DEV action run yet.";
  let recoveryChoicePending = false;
  let validatedSupportExport = null;

  function queryDebugEnabled() {
    return /(?:^|[?&])debug=1(?:&|$)/.test(root.location && root.location.search || "");
  }

  function authorized() {
    return Boolean(queryDebugEnabled() && CatInc.save
      && typeof CatInc.save.isRealDevEnvironment === "function"
      && CatInc.save.isRealDevEnvironment());
  }

  function fail(reason) { return { ok: false, reason: reason }; }
  function pass(summary, details) {
    return { ok: true, summary: summary, details: details || null };
  }
  function state() { return runtime && runtime.getState ? runtime.getState() : null; }
  function supportStorageKey() {
    return CatInc.save.STORAGE_NAMESPACE + ".devTools.supportSave.v1";
  }
  function readSupportSession() {
    if (!authorized() || !root.localStorage) return null;
    try {
      const value = JSON.parse(root.localStorage.getItem(supportStorageKey()));
      return value && value.version === 1 && typeof value.backupRaw === "string"
      && ["active", "activating", "restoring"].includes(value.status) ? value : null;
    } catch (error) { return null; }
  }
  function writeSupportSession(session) {
    if (!authorized() || !root.localStorage) return false;
    try { root.localStorage.setItem(supportStorageKey(), JSON.stringify(session)); return true; }
    catch (error) { return false; }
  }
  function clearSupportSession() {
    if (!root.localStorage) return false;
    try { root.localStorage.removeItem(supportStorageKey()); return true; }
    catch (error) { return false; }
  }
  function supportSessionActive() {
    const session = readSupportSession();
    return Boolean(session && session.status === "active");
  }
  function updateSupportIndicator() {
    if (!root.document) return;
    const active = supportSessionActive();
    root.document.body.dataset.supportSaveMode = active ? "true" : "false";
    let badge = root.document.getElementById("dev-support-mode-badge");
    if (active && !badge) {
      badge = root.document.createElement("div");
      badge.id = "dev-support-mode-badge";
      badge.setAttribute("role", "status");
      badge.textContent = "SUPPORT SAVE MODE";
      root.document.body.appendChild(badge);
    }
    if (badge) badge.hidden = !active;
  }
  function setSupportMessage(message) {
    const target = root.document && root.document.getElementById("dev-support-message");
    if (target) target.textContent = message || "";
  }
  function startSupportSession(base) {
    if (!authorized() || !runtime) return fail("Support Save is not authorized.");
    if (readSupportSession()) return fail("A Support Save session already exists.");
    if (!["current", "fresh"].includes(base)) return fail("Choose Current DEV state or Fresh current-version save.");
    const backupRaw = runtime.captureCurrentRaw && runtime.captureCurrentRaw();
    const backupAnalysis = typeof backupRaw === "string" && CatInc.save.analyserSauvegardeBrute(backupRaw);
    if (!backupAnalysis || !backupAnalysis.ok) return fail("The current DEV save could not be backed up safely.");
    const session = {
      version: 1,
      status: base === "fresh" ? "activating" : "active",
      base: base,
      startedAt: new Date().toISOString(),
      backupRaw: backupRaw
    };
    if (!writeSupportSession(session)) return fail("The persistent Support Save backup could not be stored.");
    recoveryChoicePending = false;
    validatedSupportExport = null;
    updateSupportIndicator();
    if (base === "fresh") {
      const freshRaw = runtime.createFreshRaw && runtime.createFreshRaw();
      const freshAnalysis = typeof freshRaw === "string" && CatInc.save.analyserSauvegardeBrute(freshRaw);
      if (!freshAnalysis || !freshAnalysis.ok) {
        clearSupportSession();
        updateSupportIndicator();
        return fail("The canonical fresh state could not be validated.");
      }
      let reloadScheduled;
      try { reloadScheduled = runtime.activateRaw && runtime.activateRaw(freshRaw); }
      catch (error) {
        clearSupportSession();
        updateSupportIndicator();
        return fail("The canonical fresh workspace could not be activated; the original DEV save was not replaced.");
      }
      if (!reloadScheduled) {
        writeSupportSession(Object.assign({}, session, { status: "active" }));
        runtime.rerender();
        renderSupportSection();
      }
    } else {
      runtime.save();
      runtime.rerender();
      renderSupportSection();
    }
    return pass("Support Save Mode started from " + (base === "fresh" ? "the canonical fresh state" : "the current DEV state") + ".");
  }
  function resumeSupportSession() {
    if (!supportSessionActive()) return fail("No interrupted Support Save session is available.");
    recoveryChoicePending = false;
    updateSupportIndicator();
    renderSupportSection();
    return pass("Support Save session resumed.");
  }
  function restoreSupportSession() {
    const session = readSupportSession();
    if (!session) return fail("No Support Save backup is available.");
    const analysis = CatInc.save.analyserSauvegardeBrute(session.backupRaw);
    if (!analysis.ok) return fail("The original DEV backup no longer passes canonical validation.");
    const restoring = Object.assign({}, session, { status: "restoring" });
    if (!writeSupportSession(restoring)) return fail("Could not preserve the restore marker.");
    try {
      const reloadScheduled = runtime.activateRaw && runtime.activateRaw(session.backupRaw);
      if (!reloadScheduled) {
        clearSupportSession();
        recoveryChoicePending = false;
        validatedSupportExport = null;
        updateSupportIndicator();
        runtime.rerender();
        renderSupportSection();
      }
      return pass("Original DEV save restored; Support Save Mode exited.");
    } catch (error) {
      writeSupportSession(session);
      return fail("The original DEV save could not be restored.");
    }
  }
  function summarizePlayerSave(data) {
    const jobs = Array.from(new Set((data.kittiesData || []).map(function(kitty) { return kitty && kitty.metier; }).filter(Boolean)));
    const camp = data.camp || {};
    const placed = (camp.layout || []).filter(function(item) { return item && item.construit !== false; });
    const houses = placed.filter(function(item) {
      const definition = CatInc.data && CatInc.data.campGameplay && CatInc.data.campGameplay.definitions
        && CatInc.data.campGameplay.definitions[item.type];
      return definition && definition.category === "house";
    });
    return {
      saveVersion: data.saveVersion,
      cats: (data.kittiesData || []).length,
      resources: {
        cardboardPlanks: data.cardboardPlanks || 0,
        basicWoodPlanks: data.basicWoodPlanks || 0,
        pebbleBricks: data.pebbleBricks || 0,
        rockBricks: data.rockBricks || 0,
        cannedCatFood: data.cannedCatFood || 0
      },
      jobs: jobs,
      learnedPerks: data.perksV2 && Array.isArray(data.perksV2.learned) ? data.perksV2.learned.length : 0,
      exploredZones: Array.isArray(data.zonesExplorees) ? data.zonesExplorees.length : 0,
      campBuildings: Math.max(0, placed.length - houses.length),
      campHouses: houses.length
    };
  }
  function validateSupportExport() {
    if (!supportSessionActive()) return fail("Start or resume Support Save Mode first.");
    const prepared = runtime.preparePlayerExport && runtime.preparePlayerExport();
    if (!prepared || !prepared.ok || typeof prepared.raw !== "string") {
      return fail(prepared && prepared.reason || "Canonical player-save validation failed.");
    }
    const analysis = CatInc.save.analyserSauvegardeBrute(prepared.raw);
    if (!analysis.ok || analysis.data.saveVersion !== CatInc.save.SAVE_VERSION) {
      return fail(analysis.erreur || "The export is not a current-version player save.");
    }
    validatedSupportExport = { raw: prepared.raw, summary: summarizePlayerSave(analysis.data) };
    renderSupportSection();
    return pass("Player save validated. Review the summary, then download the normal .txt save.", validatedSupportExport.summary);
  }
  function downloadSupportExport() {
    if (!supportSessionActive() || !validatedSupportExport) return fail("Validate the current Support Save workspace first.");
    const current = runtime.preparePlayerExport && runtime.preparePlayerExport();
    if (!current || !current.ok || current.raw !== validatedSupportExport.raw) {
      validatedSupportExport = null;
      renderSupportSection();
      return fail("The support workspace changed after validation. Validate it again before downloading.");
    }
    const downloaded = runtime.downloadPlayerSave && runtime.downloadPlayerSave(validatedSupportExport.raw);
    return downloaded === false ? fail("The player save could not be downloaded.") : pass("Validated normal player save exported.");
  }
  function finiteWhole(value) {
    const number = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(number) && Number.isInteger(number) && number >= 0 ? number : null;
  }
  function resourceCatalog() {
    const info = CatInc.data && CatInc.data.content && CatInc.data.content.RESOURCE_INFO || {};
    return Object.keys(info).map(function(key) { return info[key]; })
      .filter(function(entry) { return entry && entry.resourceId; })
      .map(function(entry) { return { id: entry.resourceId, label: entry.nom }; });
  }
  function perkCatalog() {
    return CatInc.data && CatInc.data.perksV2 && CatInc.data.perksV2.nodes || [];
  }
  function nodeById(perkId) {
    return perkCatalog().find(function(node) { return node.id === perkId && node.available; }) || null;
  }

  function register(id, handler) {
    if (!id || typeof handler !== "function" || actions[id]) throw new Error("Invalid DEV action registration: " + id);
    actions[id] = handler;
  }

  function execute(id, input, options) {
    if (!authorized()) return fail("DEV Toolkit is not authorized in this environment.");
    if (!runtime || !state()) return fail("DEV runtime is not configured.");
    const handler = actions[id];
    if (!handler) return fail("Unknown DEV action.");
    let result;
    try { result = handler(input || {}); }
    catch (error) { result = fail(error && error.message || "DEV action failed."); }
    if (!result || !result.ok) return result || fail("DEV action failed.");
    if (!options || !options.composed) {
      if (supportSessionActive()) validatedSupportExport = null;
      runtime.save();
      runtime.rerender();
      lastSummary = result.summary || id;
      renderSummary();
      renderSupportSection();
    }
    return result;
  }

  register("resource.add", function(input) {
    const amount = finiteWhole(input.amount);
    const entry = resourceCatalog().find(function(item) { return item.id === input.resourceId; });
    if (!entry || amount === null) return fail("Select a canonical resource and enter a non-negative whole number.");
    const current = state()[entry.id];
    if (!Number.isFinite(current) || current < 0) return fail("That resource is not valid in the current state.");
    const next = current + amount;
    if (!Number.isSafeInteger(next)) return fail("Resource amount is too large.");
    state()[entry.id] = next;
    return pass(entry.label + ": " + current + " → " + next + ".");
  });

  register("resource.set", function(input) {
    const amount = finiteWhole(input.amount);
    const entry = resourceCatalog().find(function(item) { return item.id === input.resourceId; });
    if (!entry || amount === null || !Number.isSafeInteger(amount)) return fail("Select a canonical resource and enter a safe non-negative whole number.");
    const current = state()[entry.id];
    if (!Number.isFinite(current) || current < 0) return fail("That resource is not valid in the current state.");
    state()[entry.id] = amount;
    return pass(entry.label + ": " + current + " → " + amount + ".");
  });

  register("perk.learn", function(input) {
    const node = nodeById(input.perkId);
    if (!node || node.granted || node.jobId !== input.jobId) return fail("Select a purchasable canonical perk in this tree.");
    const progress = CatInc.perksV2.normalizeProgress(state().perksV2);
    const active = new Set(progress.learned.concat(perkCatalog().filter(function(item) { return item.available && item.granted; }).map(function(item) { return item.id; })));
    if (active.has(node.id)) return fail("That perk is already effective.");
    if (!node.prerequisites.every(function(id) { return active.has(id); })) return fail("Learn every prerequisite first, or use prerequisite closure.");
    progress.learned.push(node.id);
    state().perksV2 = CatInc.perksV2.normalizeProgress(progress);
    return pass("Learned " + node.name + " with DEV cost bypass.");
  });

  register("perk.learnClosure", function(input) {
    const node = nodeById(input.perkId);
    if (!node || node.granted || node.jobId !== input.jobId) return fail("Select a purchasable canonical perk in this tree.");
    const ordered = [];
    const visiting = new Set();
    function visit(candidate) {
      if (!candidate || visiting.has(candidate.id)) return;
      visiting.add(candidate.id);
      candidate.prerequisites.forEach(function(id) { visit(nodeById(id)); });
      if (!candidate.granted && candidate.available) ordered.push(candidate.id);
    }
    visit(node);
    const progress = CatInc.perksV2.normalizeProgress(state().perksV2);
    const learned = new Set(progress.learned);
    ordered.forEach(function(id) { learned.add(id); });
    state().perksV2 = CatInc.perksV2.normalizeProgress({ version: 2, learned: Array.from(learned) });
    return pass("Learned " + node.name + " and its canonical prerequisite closure (DEV cost bypass).");
  });

  register("perk.resetTree", function(input) {
    const treeIds = new Set(perkCatalog().filter(function(node) { return node.jobId === input.jobId; }).map(function(node) { return node.id; }));
    if (!treeIds.size) return fail("Select a canonical job tree.");
    const progress = CatInc.perksV2.normalizeProgress(state().perksV2);
    state().perksV2 = CatInc.perksV2.normalizeProgress({ version: 2, learned: progress.learned.filter(function(id) { return !treeIds.has(id); }) });
    return pass("Reset purchased perks for the selected tree; granted roots remain derived.");
  });

  register("world.reveal", function(input) {
    const region = CatInc.data.content.REGIONS[state().regionCourante];
    const zone = region && region.zones && region.zones[input.zoneId];
    if (!zone) return fail("Select a zone from the current canonical region.");
    if (!Array.isArray(state().zonesExplorees)) state().zonesExplorees = [];
    if (!state().zonesExplorees.includes(zone.id)) state().zonesExplorees.push(zone.id);
    if (runtime.markExplorationDirty) runtime.markExplorationDirty();
    return pass("Marked " + zone.nom + " explored without granting mission rewards.");
  });

  register("world.revealAll", function() {
    const region = CatInc.data.content.REGIONS[state().regionCourante];
    if (!region || !region.zones) return fail("Current region is invalid.");
    const explored = new Set(Array.isArray(state().zonesExplorees) ? state().zonesExplorees : []);
    Object.keys(region.zones).forEach(function(id) { explored.add(id); });
    state().zonesExplorees = Array.from(explored);
    if (runtime.markExplorationDirty) runtime.markExplorationDirty();
    return pass("Marked all zones in " + region.nom + " explored without granting rewards.");
  });

  register("camp.ready", function() {
    const count = runtime.markCampJobsReady ? runtime.markCampJobsReady() : 0;
    return count ? pass("Marked " + count + " active Camp action" + (count === 1 ? "" : "s") + " ready to claim; nothing was claimed.")
      : fail("No compatible active Camp action is waiting.");
  });

  register("job.grant", function(input) {
    return runtime.grantJob ? runtime.grantJob(input) : fail("Canonical Job Center grant seam is unavailable.");
  });

  register("scenario.perks", function() {
    const grant = execute("resource.add", { resourceId: "cannedCatFood", amount: 100 }, { composed: true });
    if (!grant.ok) return grant;
    const availability = runtime.trainingCenterStatus ? runtime.trainingCenterStatus() : "Training Center placement remains unchanged.";
    return pass("Perks QA: granted 100 Canned Cat Food; canonical granted roots remain derived and ready. " + availability + " No perk was auto-learned.");
  });

  register("scenario.houseT3", function() {
    const changes = [
      execute("resource.add", { resourceId: "cardboardPlanks", amount: 500 }, { composed: true }),
      execute("resource.add", { resourceId: "basicWoodPlanks", amount: 500 }, { composed: true })
    ];
    if (changes.some(function(result) { return !result.ok; })) return fail("House T3 resource preparation failed.");
    return pass("House T3 QA: granted 500 Cardboard Planks and 500 Basic Wood Planks. Use the Builder tree quick grants below; existing Camp placement and the real T2 → T3 path remain unchanged.");
  });

  register("scenario.exploration", function() {
    const existing = state().kittiesData.findIndex(function(kitty) { return kitty && kitty.metier === "explorator"; });
    const eligible = state().kittiesData.findIndex(function(kitty, index) {
      return kitty && kitty.metier === null && runtime.catEligibleForJob && runtime.catEligibleForJob(index);
    });
    const grant = existing >= 0
      ? pass((state().kittiesData[existing].nom || "A Cat") + " is already the Explorator.")
      : eligible >= 0
        ? execute("job.grant", { kittyIndex: eligible, jobId: "explorator" }, { composed: true })
        : fail("No eligible unassigned Cat.");
    return pass("Exploration QA: zone reveal controls are ready. " + (grant.ok ? grant.summary : "Explorator was not granted: " + grant.reason) + " No rewards were fabricated.");
  });

  function optionsHtml(items) {
    return items.map(function(item) { return '<option value="' + item.id + '">' + item.label + '</option>'; }).join("");
  }
  function renderSummary() {
    const target = root.document && root.document.getElementById("dev-tools-summary");
    if (target) target.textContent = lastSummary;
  }
  function refreshPerks() {
    const job = root.document.getElementById("dev-perk-job");
    const perk = root.document.getElementById("dev-perk-id");
    if (!job || !perk) return;
    perk.innerHTML = optionsHtml(perkCatalog().filter(function(node) { return node.jobId === job.value && !node.granted; })
      .map(function(node) { return { id: node.id, label: node.name }; }));
  }
  function refreshWorld() {
    const select = root.document.getElementById("dev-zone-id");
    const region = state() && CatInc.data.content.REGIONS[state().regionCourante];
    if (select && region) select.innerHTML = optionsHtml(Object.keys(region.zones).map(function(id) { return { id: id, label: region.zones[id].nom + " (" + id + ")" }; }));
  }
  function refreshJobs() {
    const select = root.document.getElementById("dev-cat-id");
    if (select) select.innerHTML = optionsHtml((state().kittiesData || []).map(function(kitty, index) { return { id: String(index), label: kitty.nom + " — " + (kitty.metier || "Unassigned") }; }));
  }
  function runFromUi(id, input) {
    const result = execute(id, input || {});
    if (!result.ok) { lastSummary = "Rejected: " + result.reason; renderSummary(); }
    refreshWorld(); refreshJobs();
  }
  function supportSummaryHtml(summary) {
    if (!summary) return "";
    const resources = summary.resources;
    return '<div class="dev-support-summary"><strong>Validated player-save summary</strong><dl>'
      + '<dt>Save version</dt><dd>' + summary.saveVersion + '</dd>'
      + '<dt>Cats</dt><dd>' + summary.cats + '</dd>'
      + '<dt>Resources</dt><dd>' + resources.cardboardPlanks + ' Cardboard Planks · '
        + resources.basicWoodPlanks + ' Basic Wood Planks · ' + resources.pebbleBricks + ' Pebble Bricks · '
        + resources.rockBricks + ' Rock Bricks · ' + resources.cannedCatFood + ' CCF</dd>'
      + '<dt>Learned Jobs</dt><dd>' + (summary.jobs.length ? summary.jobs.join(', ') : 'None') + '</dd>'
      + '<dt>Purchased Perks</dt><dd>' + summary.learnedPerks + '</dd>'
      + '<dt>Explored zones</dt><dd>' + summary.exploredZones + '</dd>'
      + '<dt>Camp</dt><dd>' + summary.campBuildings + ' buildings · ' + summary.campHouses + ' houses</dd>'
      + '</dl></div>';
  }
  function renderSupportSection() {
    const section = root.document && root.document.getElementById("dev-support-section");
    if (!section) return;
    const session = readSupportSession();
    if (session && session.status === "active" && recoveryChoicePending) {
      section.innerHTML = '<h3>Support Save</h3><p class="dev-support-warning"><strong>Interrupted Support Save session found.</strong> Choose how to continue.</p>'
        + '<button id="dev-support-resume">Resume Support Session</button>'
        + '<button id="dev-support-restore" class="dev-danger">Restore original DEV save</button>'
        + '<output id="dev-support-message" aria-live="polite"></output>';
    } else if (session && session.status === "active") {
      section.innerHTML = '<h3>Support Save</h3><p><strong>SUPPORT SAVE MODE</strong></p><p>The normal DEV Toolkit actions now edit the support workspace.</p>'
        + '<button id="dev-support-validate">Validate &amp; Export Player Save</button>'
        + supportSummaryHtml(validatedSupportExport && validatedSupportExport.summary)
        + (validatedSupportExport ? '<button id="dev-support-download">Download validated player save (.txt)</button>' : '')
        + '<button id="dev-support-restore" class="dev-danger">Restore my DEV save &amp; exit Support Mode</button>'
        + '<output id="dev-support-message" aria-live="polite"></output>';
    } else {
      section.innerHTML = '<h3>Support Save</h3><p>Start a recoverable workspace. Your current DEV save is backed up before the workspace changes.</p>'
        + '<button data-dev-support-base="current">Start Support Session — Current DEV state</button>'
        + '<button data-dev-support-base="fresh">Start Support Session — Fresh current-version save</button>'
        + '<output id="dev-support-message" aria-live="polite"></output>';
    }
    section.querySelectorAll("[data-dev-support-base]").forEach(function(button) {
      button.addEventListener("click", function() {
        const result = startSupportSession(button.dataset.devSupportBase);
        if (!result.ok) setSupportMessage("Rejected: " + result.reason);
      });
    });
    const resume = section.querySelector("#dev-support-resume");
    if (resume) resume.addEventListener("click", function() {
      const result = resumeSupportSession();
      if (!result.ok) setSupportMessage("Rejected: " + result.reason);
    });
    const restore = section.querySelector("#dev-support-restore");
    if (restore) restore.addEventListener("click", function() {
      if (!root.confirm("Discard the current Support Save workspace and restore your original DEV save?")) return;
      const result = restoreSupportSession();
      if (!result.ok) setSupportMessage("Rejected: " + result.reason);
    });
    const validate = section.querySelector("#dev-support-validate");
    if (validate) validate.addEventListener("click", function() {
      const result = validateSupportExport();
      if (!result.ok) setSupportMessage("Rejected: " + result.reason);
      else setSupportMessage(result.summary);
    });
    const download = section.querySelector("#dev-support-download");
    if (download) download.addEventListener("click", function() {
      const result = downloadSupportExport();
      setSupportMessage(result.ok ? result.summary : "Rejected: " + result.reason);
    });
  }
  function mount() {
    if (!authorized() || !root.document || root.document.getElementById("dev-tools-toggle")) return false;
    const jobs = Array.from(new Set(perkCatalog().map(function(node) { return node.jobId; }))).map(function(id) {
      const job = CatInc.data.content.METIERS[id]; return { id: id, label: job ? job.nom : id };
    });
    const normalJobs = Object.keys(CatInc.data.content.METIERS).filter(function(id) { return !["gang-leader", "camp-engineer"].includes(id); })
      .map(function(id) { return { id: id, label: CatInc.data.content.METIERS[id].nom }; });
    const wrap = root.document.createElement("div");
    wrap.id = "dev-tools-root";
    wrap.innerHTML = '<button id="dev-tools-toggle" type="button" aria-controls="dev-tools-panel" aria-expanded="false">DEV</button>'
      + '<aside id="dev-tools-panel" aria-label="DEV QA Toolkit" aria-hidden="true"><header><strong>DEV QA Toolkit</strong><button id="dev-tools-close" type="button" aria-label="Close DEV Toolkit">×</button></header>'
      + '<p class="dev-state">DEV STATE · real DEV namespace</p><section><h3>Quick QA</h3><button data-dev-action="scenario.perks">Perks QA</button><button data-dev-action="scenario.houseT3">House T3 QA</button><button data-dev-action="scenario.exploration">Exploration QA</button></section>'
      + '<section><h3>Resources</h3><select id="dev-resource-id" aria-label="Resource">' + optionsHtml(resourceCatalog()) + '</select><input id="dev-resource-amount" type="number" min="0" step="1" value="100" aria-label="Resource amount"><div class="dev-row"><button data-dev-resource-add="10">+10</button><button data-dev-resource-add="100">+100</button><button id="dev-resource-set">Set amount</button></div></section>'
      + '<section><h3>Cats / Jobs / Perks</h3><label>Job tree<select id="dev-perk-job">' + optionsHtml(jobs) + '</select></label><label>Perk<select id="dev-perk-id"></select></label><button data-dev-perk="perk.learn">Learn selected perk DEV</button><button data-dev-perk="perk.learnClosure">Learn + prerequisite closure</button><button id="dev-perk-reset" class="dev-danger">Reset purchased perks for tree</button><div class="dev-row"><button data-dev-tier-perk="builderReinforcedCardboardBox">Grant Reinforced Cardboard Box</button><button data-dev-tier-perk="builderMasterWoodCathouse">Grant Master Wood Cathouse</button></div><label>Cat<select id="dev-cat-id"></select></label><label>Normal job<select id="dev-job-id">' + optionsHtml(normalJobs) + '</select></label><button id="dev-job-grant">Grant available job DEV</button></section>'
      + '<section><h3>World</h3><select id="dev-zone-id" aria-label="Current-region zone"></select><button id="dev-zone-reveal">Reveal / mark explored</button><button data-dev-action="world.revealAll">Reveal all zones in current region</button></section>'
      + '<section><h3>Camp / Time</h3><button data-dev-action="camp.ready">Make active Camp actions ready to claim</button><p>Construction, repair, Tier Upgrade, and compatible junk clearing. Results are never auto-claimed. Other timer families are deferred from 001A.</p></section>'
      + '<section id="dev-support-section"></section>'
      + '<output id="dev-tools-summary" aria-live="polite"></output></aside>';
    root.document.body.appendChild(wrap);
    const panel = root.document.getElementById("dev-tools-panel");
    function setOpen(open) { panel.setAttribute("aria-hidden", open ? "false" : "true"); root.document.getElementById("dev-tools-toggle").setAttribute("aria-expanded", open ? "true" : "false"); if (open) { refreshWorld(); refreshJobs(); renderSummary(); } }
    root.document.getElementById("dev-tools-toggle").addEventListener("click", function() { setOpen(panel.getAttribute("aria-hidden") === "true"); });
    root.document.getElementById("dev-tools-close").addEventListener("click", function() { setOpen(false); });
    root.document.getElementById("dev-perk-job").addEventListener("change", refreshPerks);
    root.document.querySelectorAll("[data-dev-action]").forEach(function(button) { button.addEventListener("click", function() { runFromUi(button.dataset.devAction); }); });
    root.document.querySelectorAll("[data-dev-resource-add]").forEach(function(button) { button.addEventListener("click", function() { runFromUi("resource.add", { resourceId: root.document.getElementById("dev-resource-id").value, amount: button.dataset.devResourceAdd }); }); });
    root.document.getElementById("dev-resource-set").addEventListener("click", function() { const id = root.document.getElementById("dev-resource-id").value; const amount = root.document.getElementById("dev-resource-amount").value; const current = state()[id]; if (Number(amount) < current && !root.confirm("Lower " + id + " from " + current + " to " + amount + "?")) return; runFromUi("resource.set", { resourceId: id, amount: amount }); });
    root.document.querySelectorAll("[data-dev-perk]").forEach(function(button) { button.addEventListener("click", function() { runFromUi(button.dataset.devPerk, { jobId: root.document.getElementById("dev-perk-job").value, perkId: root.document.getElementById("dev-perk-id").value }); }); });
    root.document.getElementById("dev-perk-reset").addEventListener("click", function() { const jobId = root.document.getElementById("dev-perk-job").value; if (root.confirm("Reset purchased perks for " + jobId + "?")) runFromUi("perk.resetTree", { jobId: jobId }); });
    root.document.querySelectorAll("[data-dev-tier-perk]").forEach(function(button) { button.addEventListener("click", function() { runFromUi("perk.learnClosure", { jobId: "builder", perkId: button.dataset.devTierPerk }); }); });
    root.document.getElementById("dev-job-grant").addEventListener("click", function() { runFromUi("job.grant", { kittyIndex: Number(root.document.getElementById("dev-cat-id").value), jobId: root.document.getElementById("dev-job-id").value }); });
    root.document.getElementById("dev-zone-reveal").addEventListener("click", function() { runFromUi("world.reveal", { zoneId: root.document.getElementById("dev-zone-id").value }); });
    refreshPerks(); refreshWorld(); refreshJobs(); renderSupportSection(); updateSupportIndicator();
    root.document.body.dataset.devToolkit = "true";
    return true;
  }

  function configure(adapter) {
    if (!authorized() || !adapter) return false;
    runtime = adapter;
    const session = readSupportSession();
    if (session && session.status === "restoring") {
      clearSupportSession();
      recoveryChoicePending = false;
    } else if (session && session.status === "activating") {
      writeSupportSession(Object.assign({}, session, { status: "active" }));
      recoveryChoicePending = false;
    } else if (session && session.status === "active") {
      recoveryChoicePending = true;
    }
    return mount();
  }

  CatInc.devTools = Object.freeze({
    authorized: authorized,
    configure: configure,
    execute: execute,
    actionIds: function() { return Object.keys(actions); },
    resourceCatalog: resourceCatalog,
    support: Object.freeze({
      storageKey: supportStorageKey,
      session: readSupportSession,
      start: startSupportSession,
      resume: resumeSupportSession,
      validateExport: validateSupportExport,
      downloadExport: downloadSupportExport,
      restore: restoreSupportSession
    })
  });
})(typeof window !== "undefined" ? window : globalThis);
