import { PROBLEMS, PATTERN_NAME } from "../patterns/problems.js";

const $ = (id) => document.getElementById(id);
const problemSel = $("problemSel");
let current = null;

function fillProblems() {
  PROBLEMS.forEach((p, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = p.name;
    problemSel.appendChild(o);
  });
}

function box(cell, kind) {
  const d = document.createElement("div");
  const wide = String(cell.v).length > 2;
  d.className = "cell cell-" + kind;
  if (wide) d.classList.add("cell-wide");
  d.textContent = cell.v;
  return d;
}

function renderRow(host, cells, kind) {
  host.innerHTML = "";
  cells.forEach((c) => host.appendChild(box(c, kind)));
}

function load() {
  current = PROBLEMS[+problemSel.value];
  const p = current;

  $("diff").textContent = p.difficulty;
  $("diff").className = "diff diff-" + p.difficulty.toLowerCase();
  $("asking").textContent = p.asking;

  $("inLabel").textContent = p.input.label;
  renderRow($("inRow"), p.input.cells, "in");
  $("inNote").textContent = p.input.note;

  $("outRow").innerHTML = "";
  $("outNote").textContent = "";
  $("outWrap").style.opacity = "0.25";
  $("hint").style.display = "none";
  $("revealBtn").style.display = "inline-flex";

  $("link").href = p.link;
}

function reveal() {
  const p = current;
  $("outLabel").textContent = p.output.label;
  $("outWrap").style.opacity = "1";
  $("revealBtn").style.display = "none";

  const host = $("outRow");
  host.innerHTML = "";
  p.output.cells.forEach((c, i) => {
    const b = box(c, "out");
    b.style.opacity = "0";
    b.style.transition = "opacity .3s";
    host.appendChild(b);
    setTimeout(() => { b.style.opacity = "1"; }, 110 * i);
  });
  setTimeout(() => {
    $("outNote").textContent = p.output.note;
    $("hintText").textContent = p.hint;
    $("hint").style.display = "block";
  }, 110 * p.output.cells.length + 150);
}

problemSel.onchange = load;
$("revealBtn").onclick = reveal;
$("patternName").textContent = PATTERN_NAME;

fillProblems();
load();
