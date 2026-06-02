# AlgoLens — See the algorithm before you code it

An interactive LeetCode **pattern** visualizer. Pick a pattern, pick a problem,
type your own input, and step through how the algorithm works — pointers,
windows, and search ranges move on screen — *before* you look at the code.

Built as a single static site (HTML + CSS + vanilla JS modules). No build step,
no dependencies, no backend. Drop it on any static host.

## Patterns included (v1)

- **Two Pointers** — Reverse String (344), Valid Palindrome (125), Two Sum II (167)
- **Sliding Window** — Max sum subarray (size k), Longest substring no repeat (3)
- **Binary Search** — Classic binary search (704)

## Run locally

ES modules need to be served over http (not opened as a file):

```bash
cd leetviz
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repo on GitHub and push these files to the `main` branch.
2. Repo → **Settings** → **Pages**.
3. Under "Build and deployment", Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)**. Save.
4. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/<repo-name>/`
5. Share that link on LinkedIn.

## Add a new pattern (the whole point of the structure)

Each pattern is one self-contained file in `patterns/`. To add one:

1. Create `patterns/myPattern.js`.
2. Build frames and call `registerPattern({...})` (copy the shape from
   `patterns/binarySearch.js` — it's the smallest example).
3. Add one import line in `js/app.js`:
   `import "../patterns/myPattern.js";`

That's it — it shows up in the dropdown automatically.

### What a "frame" looks like

The engine just plays a list of frames. One frame = one step on screen:

```js
{
  cells: [ { value: "h", state: "ptr" }, ... ],  // state: normal|ptr|settled
  tags:  { 0: "L", 4: "R" },                      // labels above cells
  note:  'Swap index <span class="hl">0</span> and 4.',
  swapPair: [0, 4] | null                          // bounce animation
}
```

Write a function that returns `[frame, frame, ...]` and you've visualized a new
algorithm.
