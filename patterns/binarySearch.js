import { registerPattern } from "../js/registry.js";

function cells(arr, lo, hi, mid, found) {
  return arr.map((v, i) => {
    let state = "normal";
    if (found != null && i === found) state = "settled";
    else if (i === mid) state = "ptr";
    else if (i < lo || i > hi) state = "normal";
    return { value: v, state };
  });
}

function binarySearchFrames(arr, target) {
  const nums = arr.map(Number);
  const frames = [];
  let lo = 0, hi = nums.length - 1;

  frames.push({
    cells: cells(arr, lo, hi, -1, null),
    tags: { [lo]: "lo", [hi]: "hi" },
    note: `Sorted array. Looking for <span class="hl">${target}</span>. Check the middle each time.`,
    swapPair: null,
  });

  let found = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) {
      found = mid;
      frames.push({
        cells: cells(arr, lo, hi, mid, mid),
        tags: { [mid]: "mid", [lo]: "lo", [hi]: "hi" },
        note: `mid = <span class="hl">${nums[mid]}</span> = target ✓ Found at index ${mid}.`,
        swapPair: null,
      });
      break;
    } else if (nums[mid] < target) {
      frames.push({
        cells: cells(arr, lo, hi, mid, null),
        tags: { [mid]: "mid", [lo]: "lo", [hi]: "hi" },
        note: `mid = ${nums[mid]} &lt; ${target}. Answer is to the right → <span class="hl">drop left half</span>.`,
        swapPair: null,
      });
      lo = mid + 1;
    } else {
      frames.push({
        cells: cells(arr, lo, hi, mid, null),
        tags: { [mid]: "mid", [lo]: "lo", [hi]: "hi" },
        note: `mid = ${nums[mid]} &gt; ${target}. Answer is to the left → <span class="hl">drop right half</span>.`,
        swapPair: null,
      });
      hi = mid - 1;
    }
  }
  if (found === -1) {
    frames.push({ cells: cells(arr, 0, -1, -1, null), tags: {}, note: `${target} not in array.`, swapPair: null });
  }
  return frames;
}

registerPattern({
  id: "binary-search",
  name: "Binary Search",
  problems: [
    {
      id: "classic-bsearch",
      name: "704. Binary Search",
      difficulty: "Easy",
      tags: "Binary Search · Halving",
      link: "https://leetcode.com/problems/binary-search/",
      statement: {
        description: "Given a <strong>sorted</strong> array and a target, return its index, or -1 if not found. Check the middle each time and throw away the half that can't contain the answer.",
        examples: [
          { in: "nums = [1,3,5,7,9,11,13], target = 9", out: "4" },
          { in: "nums = [1,3,5], target = 2", out: "-1" },
        ],
        constraints: ["Array must be sorted", "Each step halves the search range → O(log n)"],
      },
      defaultInput: "1,3,5,7,9,11,13",
      inputLabel: "Sorted numbers (comma-sep)",
      extraInput: { label: "Target", default: "9" },
      parseInput: (s) => s.split(",").map((x) => x.trim()),
      buildFrames: (arr, extra) => binarySearchFrames(arr, Number(extra)),
      code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1     # go right
        else:
            hi = mid - 1     # go left
    return -1
    # Time O(log n) · Space O(1)`,
    },
  ],
});
