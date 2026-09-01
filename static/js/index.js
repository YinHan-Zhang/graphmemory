"use strict";

const showCases = [
  ["Chemical Plant / Backtrack", "ChemicalPlantEnv_8_3420_3800_ChemicalPlantEnv_8_3420_3800_ar.mp4"],
  ["Rome / Architectural Revisit", "Rome_4_6080_6460_Rome_4_6080_6460_ar.mp4"],
  ["New York / Long Traverse", "NYC_8_7220_7600_NYC_8_7220_7600_ar.mp4"],
  ["Ancient Temple / Orbit", "AncientTempleEnv_2_6460_6840_AncientTempleEnv_2_6460_6840_ar.mp4"],
  ["Chemical Plant / Sweep", "ChemicalPlantEnv_4_1520_1900_ChemicalPlantEnv_4_1520_1900_ar.mp4"],
  ["World Rollout / 01", "0.mp4"], ["World Rollout / 02", "3.mp4"], ["World Rollout / 03", "20.mp4"],
  ["World Rollout / 04", "21.mp4"], ["World Rollout / 05", "23.mp4"], ["World Rollout / 06", "33.mp4"],
  ["World Rollout / 07", "79.mp4"], ["World Rollout / 08", "89.mp4"], ["World Rollout / 09", "91.mp4"],
  ["World Rollout / 10", "98.mp4"], ["World Rollout / 11", "109.mp4"],
  ["Open World / A01", "0ec3730e659ab2fdbb6e1165d704754825f7fc10744be25863e18311b219c0ed.mp4"],
  ["Open World / A02", "2b660a52c63dd131f0a06543203dca9d127d883c49ecc78e6253df0685b46af2.mp4"],
  ["Open World / A03", "2dfb7fd0e0f0f36a0067b90120e8cf97e6270c7f0262fc136ae855b5009ddc50.mp4"],
  ["Open World / A04", "382e79123668ed71ed0b611e65674f5a51ccc4ed50c045edfb934825f0bdf493.mp4"],
  ["Open World / A05", "6e7a3aecf61f5360c666be3dc320c7a54ffd3e9ade60199186f784bc986d5cc2.mp4"],
  ["Open World / A06", "7851c27e942d14293b7a2448bc7e240fe95e1fd794eacada372f6b50ed195f30.mp4"],
  ["Open World / A07", "8648650ac5d5bc560964dba7a359eb9c9bc2e3f534be0d99d2ba828f059794d4.mp4"],
  ["Open World / A08", "8d05cafd6125bb965a1e9e91faa41c1eb8f0844b5489283693111c1fbd10f538.mp4"],
  ["Open World / A09", "a06872316995d5bfc88e9dc98b79e9b017762739c1ff7d4bd2cb5d1a6050dad2.mp4"],
  ["Open World / A10", "b4e577ec23310940fa5db81c4053cd56.mov"],
  ["Open World / A11", "be48a5aefa8e2f00011540b78c442238bb1ab2ccb0f39f9f57114848012dd8c6.mp4"],
  ["Open World / A12", "bf5a316a294b2a800ee099584a0dbd6a7cc9ad4ba313a6114d6c6e0f725ff151.mp4"],
  ["Open World / A13", "c37895c3094f8b8c07c7724d97866627210b1db3c2856a3078c69fd309efd3e9.mp4"],
  ["Open World / A14", "cd7acad3fac79ea97b0cb3c1851e4346997076964e77318e93bf6be9da80ccdf.mp4"]
];

const comparisonScenes = [
  { id: "FeudalJapan_8_4940_5320", label: "Feudal Japan" },
  { id: "NYC_4_2660_3040", label: "New York" },
  { id: "Rome_3_4180_4560", label: "Rome" }
];

const comparisonMethods = [
  { dir: "minwm", label: "minWM", suffix: "" },
  { dir: "sanaworld", label: "SANA-World", suffix: "" },
  { dir: "matrixgames", label: "MatrixGames 3.0", suffix: "" },
  { dir: "WorldKV", label: "WorldKV", suffix: "_ar" },
  { dir: "hy", label: "HY-WorldPlay 1.5", suffix: "" },
  { dir: "lingbot-1.5", label: "LingBot-World 1.5", suffix: "" },
  { dir: "lingbot-v2", label: "LingBot-World v2", suffix: "" },
  { dir: "ours", label: "GraphMem (Ours)", suffix: "_ar", ours: true }
];

const ablationScenes = [
  { id: "ChemicalPlantEnv_8_3420_3800", label: "Chemical Plant A" },
  { id: "ChemicalPlantEnv_2_6080_6460", label: "Chemical Plant B" },
  { id: "Warehouse_0_3420_3800", label: "Warehouse" },
  { id: "IslandMap_5_5320_5700", label: "Island" }
];

const ablationMethods = [
  { dir: "queue", label: "Queue", note: "Recent context", code: "M-01" },
  { dir: "bank", label: "Memory Bank", note: "Unstructured", code: "M-02" },
  { dir: "ours", label: "Full GraphMem", note: "Complete model", code: "M-03", ours: true },
  { dir: "temporal", label: "w/o Temporal", note: "Retrieval removed", code: "M-04" },
  { dir: "spatial", label: "w/o Spatial", note: "Retrieval removed", code: "M-05" }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupChrome() {
  const header = $(".site-header");
  const progress = $(".scroll-progress span");
  const glow = $(".cursor-glow");
  const menu = $(".menu-button");
  const nav = $(".desktop-nav");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.setProperty("--mx", `${event.clientX}px`);
      glow.style.setProperty("--my", `${event.clientY}px`);
    }, { passive: true });
  }

  menu.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }));

  const sections = ["showcase", "comparison", "ablation"].map(id => document.getElementById(id));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$(".desktop-nav a").forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%" });
  sections.forEach(section => sectionObserver.observe(section));
}

function setupReveal() {
  $$("[data-delay]").forEach(el => el.style.setProperty("--delay", `${el.dataset.delay}ms`));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach(el => observer.observe(el));
}

function videoMarkup(src, label, controls = true) {
  return `<video ${controls ? "controls" : ""} muted loop playsinline preload="metadata" aria-label="${label}"><source src="${src}"></video>`;
}

function setupDialog() {
  const dialog = $("#video-dialog");
  const player = $("video", dialog);
  const title = $("#dialog-title");
  const close = () => {
    player.pause();
    dialog.close();
    document.body.classList.remove("dialog-open");
  };
  $(".dialog-close", dialog).addEventListener("click", close);
  dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
  dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  window.openCaseDialog = (src, name) => {
    title.textContent = name;
    player.src = src;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    player.play().catch(() => {});
  };
}

function setupShowcase() {
  const grid = $("#showcase-grid");
  const loadButton = $("#load-more");
  const count = $("#case-count");
  let visible = 8;

  const makeCard = ([name, file], index) => {
    const article = document.createElement("article");
    const src = `./case/show-case/${file}`;
    article.className = "case-card";
    article.tabIndex = 0;
    article.style.animationDelay = `${Math.min(index % 8, 6) * 55}ms`;
    article.innerHTML = `<div class="case-media">
      ${videoMarkup(src, name, false)}
      <div class="case-meta"><div><small>Case ${String(index + 1).padStart(2, "0")}</small><strong>${name}</strong></div>
      <button class="case-open" type="button" aria-label="Open ${name}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4h9v9h-2V7.4l-9.3 9.3-1.4-1.4L12.6 6H7V4Z"/></svg></button></div>
    </div>`;
    const preview = $("video", article);
    article.addEventListener("mouseenter", () => preview.play().catch(() => {}));
    article.addEventListener("mouseleave", () => { preview.pause(); preview.currentTime = 0; });
    article.addEventListener("click", () => window.openCaseDialog(src, name));
    article.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") window.openCaseDialog(src, name); });
    return article;
  };

  const render = () => {
    const fragment = document.createDocumentFragment();
    for (let i = grid.children.length; i < visible; i += 1) fragment.appendChild(makeCard(showCases[i], i));
    grid.appendChild(fragment);
    count.textContent = `${String(visible).padStart(2, "0")} / ${showCases.length}`;
    if (visible >= showCases.length) loadButton.hidden = true;
  };
  loadButton.addEventListener("click", () => { visible = showCases.length; render(); });
  render();
}

function renderTabs(container, scenes, selected, onSelect) {
  container.innerHTML = "";
  scenes.forEach(scene => {
    const button = document.createElement("button");
    button.className = "scene-tab";
    button.type = "button";
    button.role = "tab";
    button.textContent = scene.label;
    button.setAttribute("aria-selected", String(scene.id === selected));
    button.addEventListener("click", () => onSelect(scene.id));
    container.appendChild(button);
  });
}

function setupSynchronizedButton(button, grid) {
  let playing = false;
  button.addEventListener("click", async () => {
    const videos = $$("video", grid);
    if (playing) {
      videos.forEach(video => video.pause());
      playing = false;
    } else {
      videos.forEach(video => { video.currentTime = 0; });
      await Promise.allSettled(videos.map(video => video.play()));
      playing = true;
    }
    button.classList.toggle("playing", playing);
    $("span", button).textContent = playing ? "Pause all" : "Play all";
  });
  return () => {
    playing = false;
    button.classList.remove("playing");
    $("span", button).textContent = "Play all";
  };
}

function setupComparison() {
  const tabs = $("#comparison-tabs");
  const grid = $("#comparison-grid");
  const button = $("#comparison-sync");
  let selected = comparisonScenes[0].id;
  const resetSync = setupSynchronizedButton(button, grid);

  const render = () => {
    resetSync();
    renderTabs(tabs, comparisonScenes, selected, id => { selected = id; render(); });
    grid.innerHTML = comparisonMethods.map((method, index) => {
      const stem = method.suffix ? `${selected}_${selected}` : selected;
      const src = `./case/comparison_case/${method.dir}/${stem}${method.suffix}.mp4`;
      return `<article class="method-card ${method.ours ? "ours" : ""}" style="animation-delay:${index * 45}ms">
        ${videoMarkup(src, `${method.label} — ${selected}`)}
        <div class="method-label"><strong>${method.label}</strong><small>${method.ours ? "Structured memory" : "Baseline"}</small></div>
      </article>`;
    }).join("");
  };
  render();
}

function setupAblation() {
  const tabs = $("#ablation-tabs");
  const grid = $("#ablation-grid");
  const button = $("#ablation-sync");
  let selected = ablationScenes[0].id;
  const resetSync = setupSynchronizedButton(button, grid);

  const render = () => {
    resetSync();
    renderTabs(tabs, ablationScenes, selected, id => { selected = id; render(); });
    grid.innerHTML = ablationMethods.map((method, index) => {
      const src = `./case/ablation_case/${method.dir}/${selected}_${selected}_ar.mp4`;
      return `<article class="ablation-card ${method.ours ? "ours" : ""}" style="animation-delay:${index * 55}ms">
        ${videoMarkup(src, `${method.label} — ${selected}`)}
        <div class="method-label"><div><strong>${method.label}</strong><small>${method.note}</small></div><span class="variant-code">${method.code}</span></div>
      </article>`;
    }).join("");
  };
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  setupChrome();
  setupReveal();
  setupDialog();
  setupShowcase();
  setupComparison();
  setupAblation();
});
