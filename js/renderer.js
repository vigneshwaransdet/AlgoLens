// Renders a single "frame" into the canvas host.
// A frame describes the visual state at one step:
// {
//   cells: [ { value, state } ],   state: 'normal' | 'ptr' | 'settled' | 'highlight'
//   tags:  { index: 'L', ... }     labels above cells
//   note:  'narration text, <hl>highlighted</hl> parts allowed'
//   swapPair: [i, j] | null        cells to bounce-animate this step
// }

export function renderFrame(host, frame) {
  host.innerHTML = "";
  frame.cells.forEach((c, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (c.state === "ptr") cell.classList.add("ptr");
    else if (c.state === "settled") cell.classList.add("settled");
    cell.textContent = c.value;

    if (frame.tags && frame.tags[i]) {
      const t = document.createElement("span");
      t.className = "cell-tag";
      t.textContent = frame.tags[i];
      cell.appendChild(t);
    }
    const idx = document.createElement("span");
    idx.className = "cell-idx";
    idx.textContent = i;
    cell.appendChild(idx);

    if (frame.swapPair && (frame.swapPair[0] === i || frame.swapPair[1] === i)) {
      cell.classList.add("swap");
    }
    host.appendChild(cell);
  });
}

export function renderNote(el, html) {
  el.innerHTML = html || "";
}
