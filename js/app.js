import { registry } from "./registry.js";
import { renderFrame, renderNote } from "./renderer.js";

// Import patterns so they self-register.
import "../patterns/twoPointers.js";

const $ = (id) => document.getElementById(id);
const patternSel = $("patternSel");
const problemSel = $("problemSel");
const problemMeta = $("problemMeta");
const host = $("canvasHost");
const narrate = $("narrate");
const progressBar = $("progressBar");

let frames = [];
let pos = 0;
let timer = null;
let current = null; // current problem def

function fillPatterns() {
  registry.forEach((p, i) => {
    const o = document.createElement("option");
    o.value = i; o.textContent = p.name;
    patternSel.appendChild(o);
  });
}

function fillProblems(patternIdx) {
  problemSel.innerHTML = "";
  registry[patternIdx].problems.forEach((pr, i) => {
    const o = document.createElement("option");
    o.value = i; o.textContent = pr.name;
    problemSel.appendChild(o);
  });
}

function buildMeta(pr) {
  // input + optional extra input + difficulty
  let html = `<span class="pm-tag">${pr.tags}</span>`;
  html += `<div style="margin-bottom:0.9rem"><strong>${pr.difficulty}</strong></div>`;
  html += `<label class="picker-label" for="mainInput">${pr.inputLabel}</label>`;
  html += `<input id="mainInput" class="meta-input" value="${pr.defaultInput}" />`;
  if (pr.extraInput) {
    html += `<label class="picker-label" for="extraInput" style="margin-top:0.7rem;display:block">${pr.extraInput.label}</label>`;
    html += `<input id="extraInput" class="meta-input" value="${pr.extraInput.default}" />`;
  }
  html += `<button id="btnRun" class="ctl ctl-primary" style="margin-top:1rem;width:100%">Visualize</button>`;
  problemMeta.innerHTML = html;

  // style inputs (inline since they're injected)
  problemMeta.querySelectorAll(".meta-input").forEach((el) => {
    el.style.cssText = "width:100%;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:var(--radius-sm);padding:0.5rem 0.7rem;font-family:var(--mono);font-size:0.88rem;margin-top:0.3rem";
  });

  $("btnRun").onclick = run;
}

function renderStatement(pr) {
  const el = $("statement");
  const s = pr.statement;
  if (!s) { el.innerHTML = ""; el.style.display = "none"; return; }
  el.style.display = "block";
  let h = `<div class="st-head">
      <span class="st-name">${pr.name}</span>
      <span class="st-diff st-${pr.difficulty.toLowerCase()}">${pr.difficulty}</span>
    </div>`;
  h += `<p class="st-desc">${s.description}</p>`;
  if (s.examples && s.examples.length) {
    h += `<div class="st-block"><span class="st-label">Example${s.examples.length > 1 ? "s" : ""}</span>`;
    s.examples.forEach((ex) => {
      h += `<div class="st-ex"><code><span class="st-io">Input:</span> ${ex.in}</code><code><span class="st-io">Output:</span> ${ex.out}</code></div>`;
    });
    h += `</div>`;
  }
  if (s.constraints && s.constraints.length) {
    h += `<div class="st-block"><span class="st-label">Constraints</span><ul class="st-con">`;
    s.constraints.forEach((c) => { h += `<li>${c}</li>`; });
    h += `</ul></div>`;
  }
  if (pr.link) {
    h += `<a class="st-link" href="${pr.link}" target="_blank" rel="noopener">Open on LeetCode &rarr;</a>`;
  }
  el.innerHTML = h;
}

function run() {
  const raw = $("mainInput").value;
  const arr = current.parseInput(raw);
  const extra = $("extraInput") ? $("extraInput").value : null;
  try {
    frames = current.buildFrames(arr, extra);
  } catch (e) {
    frames = [{ cells: [], tags: {}, note: "Check your input format.", swapPair: null }];
  }
  pos = 0;
  stop();
  draw();
}

function draw() {
  if (!frames.length) return;
  const f = frames[pos];
  renderFrame(host, f);
  renderNote(narrate, f.note);
  progressBar.style.width = ((pos + 1) / frames.length * 100) + "%";
  $("btnPrev").disabled = pos === 0;
  $("btnNext").disabled = pos === frames.length - 1;
}

function next() { if (pos < frames.length - 1) { pos++; draw(); } else stop(); }
function prev() { if (pos > 0) { pos--; draw(); } }
function reset() { pos = 0; stop(); draw(); }

function play() {
  if (timer) { stop(); return; }
  $("btnPlay").textContent = "Pause";
  timer = setInterval(() => {
    if (pos >= frames.length - 1) { stop(); return; }
    next();
  }, 900);
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
  $("btnPlay").textContent = "Play";
}

function loadProblem() {
  const pIdx = +patternSel.value;
  const prIdx = +problemSel.value;
  current = registry[pIdx].problems[prIdx];
  buildMeta(current);
  renderStatement(current);
  run();
}

// --- code modal ---
function highlight(code) {
  return code
    .replace(/#.*/g, (m) => `<span class="cm">${m}</span>`)
    .replace(/\b(def|while|for|if|elif|else|return|in|range|len|max|sum|set|True|False)\b/g,
      '<span class="kw">$1</span>');
}
$("btnCode").onclick = () => {
  $("codeTitle").textContent = current.name;
  $("codeBody").innerHTML = highlight(current.code);
  $("codeModal").hidden = false;
};
$("btnCloseCode").onclick = () => { $("codeModal").hidden = true; };
$("codeModal").addEventListener("click", (e) => {
  if (e.target === $("codeModal")) $("codeModal").hidden = true;
});

// --- events ---
patternSel.onchange = () => { fillProblems(+patternSel.value); problemSel.value = 0; loadProblem(); };
problemSel.onchange = loadProblem;
$("btnNext").onclick = next;
$("btnPrev").onclick = prev;
$("btnReset").onclick = reset;
$("btnPlay").onclick = play;

// --- init ---
fillPatterns();
fillProblems(0);
loadProblem();
