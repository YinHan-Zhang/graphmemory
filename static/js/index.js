"use strict";

const perfectCases = ["1", "2", "3", "25", "70", "79", "89", "110"].map(id => [
  `Featured Case / ${id.padStart(3, "0")}`,
  `./case/perfect_case/${id}.mp4`
]);

const showCases = [
  ["New York / Long Traverse", "./case/show-case/NYC_8_7220_7600_NYC_8_7220_7600_ar.mp4"],
  ["Ancient Temple / Orbit", "./case/show-case/AncientTempleEnv_2_6460_6840_AncientTempleEnv_2_6460_6840_ar.mp4"],
  ["Chemical Plant / Sweep", "./case/show-case/ChemicalPlantEnv_4_1520_1900_ChemicalPlantEnv_4_1520_1900_ar.mp4"],
  ["World Rollout / 01", "./case/show-case/0.mp4"],
  ["World Rollout / 02", "./case/show-case/3.mp4"],
  ["World Rollout / 03", "./case/show-case/20.mp4"],
  ["World Rollout / 04", "./case/show-case/21.mp4"],
  ["World Rollout / 05", "./case/show-case/23.mp4"],
  ["World Rollout / 06", "./case/show-case/33.mp4"],
  ["World Rollout / 07", "./case/show-case/79.mp4"],
  ["World Rollout / 08", "./case/show-case/91.mp4"],
  ["World Rollout / 09", "./case/show-case/98.mp4"],
  ["World Rollout / 10", "./case/show-case/109.mp4"],
  ["Open World / 01", "./case/show-case/2b660a52c63dd131f0a06543203dca9d127d883c49ecc78e6253df0685b46af2.mp4"],
  ["Open World / 02", "./case/show-case/2dfb.mp4"],
  ["Open World / 03", "./case/show-case/7851c27e942d14293b7a2448bc7e240fe95e1fd794eacada372f6b50ed195f30.mp4"],
  ["Open World / 04", "./case/show-case/8648650ac5d5bc560964dba7a359eb9c9bc2e3f534be0d99d2ba828f059794d4.mp4"],
  ["Open World / 05", "./case/show-case/a06872316995d5bfc88e9dc98b79e9b017762739c1ff7d4bd2cb5d1a6050dad2.mp4"],
  ["Open World / 06", "./case/show-case/b4e577ec23310940fa5db81c4053cd56.mov"],
  ["Open World / 07", "./case/show-case/be48a5aefa8e2f00011540b78c442238bb1ab2ccb0f39f9f57114848012dd8c6.mp4"],
  ["Open World / 08", "./case/show-case/bf5a316a294b2a800ee099584a0dbd6a7cc9ad4ba313a6114d6c6e0f725ff151.mp4"],
  ...["109", "110", "119", "138", "153", "156", "164", "196", "199", "227", "269"].map(id => [
    `September Set / ${id}`,
    `./case/show-case/cases_0923/${id}.mp4`
  ])
];

const crossBackboneScenes = [
  { id: "13", label: "Case 13" },
  { id: "27", label: "Case 27" },
  { id: "51", label: "Case 51" },
  { id: "dreamxworld", label: "DreamXWorld" },
  { id: "echowm", label: "EchoWM" },
  { id: "hy1.5", label: "HY-WorldPlay 1.5" },
  { id: "lingbot1.5", label: "LingBot-World 1.5" },
  { id: "lingbotv2", label: "LingBot-World v2" }
];

const crossBackboneMethods = [
  { dir: "baselines", label: "Baseline", note: "Original backbone" },
  { dir: "ours", label: "GraphMem", note: "Graph memory enabled", ours: true }
];

const comparisonScenes = [
  { id: "FeudalJapan_8_4940_5320", label: "Feudal Japan" },
  { id: "NYC_4_2660_3040", label: "New York" },
  { id: "Rome_3_4180_4560", label: "Rome" }
];

const comparisonMethods = [
  { dir: "minwm", label: "minWM", suffix: "" },
  { dir: "sanaworld", label: "SANA-World", suffix: "" },
  { dir: "alayaworld", label: "AlayaWorld", suffix: "" },
  { dir: "matrixgames", label: "MatrixGames 3.0", suffix: "" },
  { dir: "WorldKV", label: "WorldKV", suffix: "_ar" },
  { dir: "hy", label: "HY-WorldPlay 1.5", suffix: "" },
  { dir: "lingbot-1.5", label: "LingBot-World 1.5", suffix: "" },
  { dir: "lingbot-v2", label: "LingBot-World v2", suffix: "" },
  { dir: "ours", label: "GraphMem (Ours)", suffix: "_ar", ours: true }
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

  const sections = ["perfect-cases", "showcase", "cross-backbone", "comparison"].map(id => document.getElementById(id));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target.id === "comparison" ? "#cross-backbone" : `#${entry.target.id}`;
      $$(".desktop-nav a").forEach(link => link.classList.toggle("active", link.hash === target));
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

function setupCaseCollection(cases, options) {
  const grid = $(options.grid);
  const loadButton = options.loadButton ? $(options.loadButton) : null;
  const count = options.count ? $(options.count) : null;
  let visible = Math.min(options.initialVisible ?? cases.length, cases.length);

  const makeCard = ([name, src], index) => {
    const article = document.createElement("article");
    article.className = "case-card";
    article.tabIndex = 0;
    article.style.animationDelay = `${Math.min(index % 8, 6) * 55}ms`;
    article.innerHTML = `<div class="case-media">
      ${videoMarkup(src, name, false)}
      <div class="case-meta"><div><small>${options.eyebrow} ${String(index + 1).padStart(2, "0")}</small><strong>${name}</strong></div>
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
    for (let i = grid.children.length; i < visible; i += 1) fragment.appendChild(makeCard(cases[i], i));
    grid.appendChild(fragment);
    if (count) count.textContent = `${String(visible).padStart(2, "0")} / ${cases.length}`;
    if (loadButton && visible >= cases.length) loadButton.hidden = true;
  };
  if (loadButton) loadButton.addEventListener("click", () => { visible = cases.length; render(); });
  render();
}

function setupShowcases() {
  setupCaseCollection(perfectCases, {
    grid: "#perfect-grid",
    eyebrow: "Featured"
  });
  setupCaseCollection(showCases, {
    grid: "#showcase-grid",
    loadButton: "#load-more",
    count: "#case-count",
    initialVisible: 8,
    eyebrow: "Case"
  });
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

function setupCrossBackbone() {
  const tabs = $("#cross-backbone-tabs");
  const grid = $("#cross-backbone-grid");
  const button = $("#cross-backbone-sync");
  let selected = crossBackboneScenes[0].id;
  const resetSync = setupSynchronizedButton(button, grid);

  const render = () => {
    resetSync();
    renderTabs(tabs, crossBackboneScenes, selected, id => { selected = id; render(); });
    const scene = crossBackboneScenes.find(item => item.id === selected);
    grid.innerHTML = crossBackboneMethods.map((method, index) => {
      const src = `./case/cross_backbone_comprison_case/${method.dir}/${selected}.mp4`;
      return `<article class="method-card ${method.ours ? "ours" : ""}" style="animation-delay:${index * 55}ms">
        ${videoMarkup(src, `${method.label} — ${scene.label}`)}
        <div class="method-label"><div><strong>${method.label}</strong><small>${method.note}</small></div><span class="variant-code">${scene.label}</span></div>
      </article>`;
    }).join("");
  };
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  setupChrome();
  setupReveal();
  setupDialog();
  setupShowcases();
  setupCrossBackbone();
  setupComparison();
});
