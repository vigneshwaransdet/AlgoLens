import { registerPattern } from "../js/registry.js";

// ---- helpers ----
function cellsFrom(arr, ptrSet, settledSet) {
  return arr.map((v, i) => ({
    value: v,
    state: settledSet && settledSet.has(i) ? "settled"
         : ptrSet && ptrSet.has(i) ? "ptr"
         : "normal",
  }));
}

// ===== Problem 1: Reverse String (in-place swap) =====
function reverseFrames(arr) {
  const frames = [];
  const a = arr.slice();
  let L = 0, R = a.length - 1;
  const settled = new Set();

  frames.push({
    cells: cellsFrom(a, new Set([L, R]), settled),
    tags: a.length > 1 ? { [L]: "L", [R]: "R" } : { 0: "L=R" },
    note: `Two pointers: <span class="hl">L</span> at the start, <span class="hl">R</span> at the end. We'll swap and move inward.`,
    swapPair: null,
  });

  while (L < R) {
    const t = a[L]; a[L] = a[R]; a[R] = t;
    frames.push({
      cells: cellsFrom(a, new Set([L, R]), settled),
      tags: { [L]: "L", [R]: "R" },
      note: `Swap index <span class="hl">${L}</span> and <span class="hl">${R}</span>. No extra array — we edit in place.`,
      swapPair: [L, R],
    });
    settled.add(L); settled.add(R);
    L++; R--;
    frames.push({
      cells: cellsFrom(a, (L < R ? new Set([L, R]) : new Set()), settled),
      tags: L < R ? { [L]: "L", [R]: "R" } : {},
      note: L < R ? `Move pointers inward → next pair.` : `Pointers met. Done.`,
      swapPair: null,
    });
  }
  for (let i = 0; i < a.length; i++) settled.add(i);
  frames.push({
    cells: cellsFrom(a, new Set(), settled),
    tags: {},
    note: `Reversed in place — <span class="hl">O(1)</span> extra memory. ✓`,
    swapPair: null,
  });
  return frames;
}

// ===== Problem 2: Valid Palindrome check =====
function palindromeFrames(arr) {
  const frames = [];
  const a = arr.slice();
  let L = 0, R = a.length - 1;
  let ok = true;

  frames.push({
    cells: cellsFrom(a, new Set([L, R]), new Set()),
    tags: { [L]: "L", [R]: "R" },
    note: `Compare from both ends. If every pair matches, it's a palindrome.`,
    swapPair: null,
  });

  while (L < R && ok) {
    const match = a[L] === a[R];
    frames.push({
      cells: cellsFrom(a, new Set([L, R]), new Set()),
      tags: { [L]: "L", [R]: "R" },
      note: match
        ? `<span class="hl">${a[L]}</span> = <span class="hl">${a[R]}</span> ✓ match — keep going.`
        : `<span class="hl">${a[L]}</span> ≠ <span class="hl">${a[R]}</span> ✗ mismatch — not a palindrome.`,
      swapPair: null,
    });
    if (!match) { ok = false; break; }
    L++; R--;
  }
  frames.push({
    cells: cellsFrom(a, new Set(), ok ? new Set(a.map((_, i) => i)) : new Set()),
    tags: {},
    note: ok ? `All pairs matched — it <span class="hl">is</span> a palindrome. ✓` : `Stopped early — <span class="hl">not</span> a palindrome.`,
    swapPair: null,
  });
  return frames;
}

// ===== Problem 3: Two Sum II (sorted) =====
function twoSumFrames(arr, target) {
  const nums = arr.map(Number);
  const frames = [];
  let L = 0, R = nums.length - 1;
  frames.push({
    cells: cellsFrom(arr, new Set([L, R]), new Set()),
    tags: { [L]: "L", [R]: "R" },
    note: `Array is sorted. Target = <span class="hl">${target}</span>. Sum the two ends.`,
    swapPair: null,
  });
  let found = false;
  while (L < R) {
    const sum = nums[L] + nums[R];
    if (sum === target) {
      found = true;
      frames.push({
        cells: cellsFrom(arr, new Set([L, R]), new Set([L, R])),
        tags: { [L]: "L", [R]: "R" },
        note: `${nums[L]} + ${nums[R]} = <span class="hl">${target}</span> ✓ Found at index ${L} & ${R}.`,
        swapPair: null,
      });
      break;
    } else if (sum < target) {
      frames.push({
        cells: cellsFrom(arr, new Set([L, R]), new Set()),
        tags: { [L]: "L", [R]: "R" },
        note: `${nums[L]} + ${nums[R]} = ${sum} &lt; ${target}. Too small → move <span class="hl">L</span> right.`,
        swapPair: null,
      });
      L++;
    } else {
      frames.push({
        cells: cellsFrom(arr, new Set([L, R]), new Set()),
        tags: { [L]: "L", [R]: "R" },
        note: `${nums[L]} + ${nums[R]} = ${sum} &gt; ${target}. Too big → move <span class="hl">R</span> left.`,
        swapPair: null,
      });
      R--;
    }
  }
  if (!found) {
    frames.push({ cells: cellsFrom(arr, new Set(), new Set()), tags: {}, note: `No pair sums to ${target}.`, swapPair: null });
  }
  return frames;
}

registerPattern({
  id: "two-pointers",
  name: "Two Pointers",
  problems: [
    {
      id: "reverse-string",
      name: "344. Reverse String",
      difficulty: "Easy",
      tags: "Two Pointers · In-place",
      defaultInput: "hello",
      inputLabel: "String",
      parseInput: (s) => s.split(""),
      buildFrames: (arr) => reverseFrames(arr),
      code: `def reverseString(s):
    L, R = 0, len(s) - 1
    while L < R:
        s[L], s[R] = s[R], s[L]   # swap in place
        L += 1
        R -= 1
    # Time O(n) · Space O(1)`,
    },
    {
      id: "valid-palindrome",
      name: "125. Valid Palindrome (core idea)",
      difficulty: "Easy",
      tags: "Two Pointers · Compare ends",
      defaultInput: "racecar",
      inputLabel: "String",
      parseInput: (s) => s.split(""),
      buildFrames: (arr) => palindromeFrames(arr),
      code: `def isPalindrome(s):
    L, R = 0, len(s) - 1
    while L < R:
        if s[L] != s[R]:
            return False
        L += 1
        R -= 1
    return True
    # Time O(n) · Space O(1)`,
    },
    {
      id: "two-sum-ii",
      name: "167. Two Sum II (sorted)",
      difficulty: "Medium",
      tags: "Two Pointers · Sorted array",
      defaultInput: "2,7,11,15",
      inputLabel: "Sorted numbers (comma-sep)",
      extraInput: { label: "Target", default: "9" },
      parseInput: (s) => s.split(",").map((x) => x.trim()),
      buildFrames: (arr, extra) => twoSumFrames(arr, Number(extra)),
      code: `def twoSum(numbers, target):
    L, R = 0, len(numbers) - 1
    while L < R:
        s = numbers[L] + numbers[R]
        if s == target:
            return [L + 1, R + 1]
        elif s < target:
            L += 1      # need a bigger sum
        else:
            R -= 1      # need a smaller sum
    # Time O(n) · Space O(1)`,
    },
  ],
});
