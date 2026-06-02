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

// ===== Move Zeroes: slow/fast pointers =====
function moveZeroesFrames(arr) {
  const a = arr.map(Number);
  const frames = [];
  let slow = 0;
  const settled = new Set();

  frames.push({
    cells: cellsFrom(a, new Set([0]), settled),
    tags: { 0: "slow,fast" },
    note: `<span class="hl">slow</span> marks where the next non-zero goes. <span class="hl">fast</span> scans ahead.`,
    swapPair: null,
  });

  for (let fast = 0; fast < a.length; fast++) {
    if (a[fast] !== 0) {
      if (slow !== fast) {
        const t = a[slow]; a[slow] = a[fast]; a[fast] = t;
        frames.push({
          cells: cellsFrom(a, new Set([slow, fast]), settled),
          tags: { [slow]: "slow", [fast]: "fast" },
          note: `Non-zero <span class="hl">${a[slow]}</span> found — swap it into slot ${slow}.`,
          swapPair: [slow, fast],
        });
      } else {
        frames.push({
          cells: cellsFrom(a, new Set([slow, fast]), settled),
          tags: { [slow]: "slow=fast" },
          note: `<span class="hl">${a[fast]}</span> is already in place. Move on.`,
          swapPair: null,
        });
      }
      settled.add(slow);
      slow++;
    } else {
      frames.push({
        cells: cellsFrom(a, new Set([fast]), settled),
        tags: { [slow]: "slow", [fast]: "fast" },
        note: `<span class="hl">0</span> at index ${fast} — skip it, only fast moves.`,
        swapPair: null,
      });
    }
  }
  for (let i = 0; i < a.length; i++) settled.add(i);
  frames.push({
    cells: cellsFrom(a, new Set(), settled),
    tags: {},
    note: `All non-zeros moved left, zeros pushed to the end — in place. ✓`,
    swapPair: null,
  });
  return frames;
}

// ===== Container With Most Water =====
function containerFrames(arr) {
  const h = arr.map(Number);
  const frames = [];
  let L = 0, R = h.length - 1, best = 0;

  frames.push({
    cells: cellsFrom(h, new Set([L, R]), new Set()),
    tags: { [L]: "L", [R]: "R" },
    note: `Widest container first. Area = width × <span class="hl">shorter</span> height.`,
    swapPair: null,
  });

  while (L < R) {
    const area = (R - L) * Math.min(h[L], h[R]);
    if (area > best) best = area;
    frames.push({
      cells: cellsFrom(h, new Set([L, R]), new Set()),
      tags: { [L]: "L", [R]: "R" },
      note: `Width ${R - L} × min(${h[L]},${h[R]}) = <span class="hl">${area}</span>. Best = ${best}.`,
      swapPair: null,
    });
    if (h[L] < h[R]) {
      L++;
      frames.push({
        cells: cellsFrom(h, (L < R ? new Set([L, R]) : new Set()), new Set()),
        tags: L < R ? { [L]: "L", [R]: "R" } : {},
        note: `Left was shorter → move <span class="hl">L</span> in, hoping for a taller wall.`,
        swapPair: null,
      });
    } else {
      R--;
      frames.push({
        cells: cellsFrom(h, (L < R ? new Set([L, R]) : new Set()), new Set()),
        tags: L < R ? { [L]: "L", [R]: "R" } : {},
        note: `Right was shorter (or equal) → move <span class="hl">R</span> in.`,
        swapPair: null,
      });
    }
  }
  frames.push({
    cells: cellsFrom(h, new Set(), new Set()),
    tags: {},
    note: `Max water this container can hold = <span class="hl">${best}</span>.`,
    swapPair: null,
  });
  return frames;
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
      link: "https://leetcode.com/problems/reverse-string/",
      statement: {
        description: "Write a function that reverses a string. The input is given as an array of characters <code>s</code>. You must modify it in-place using O(1) extra memory.",
        examples: [
          { in: 's = ["h","e","l","l","o"]', out: '["o","l","l","e","h"]' },
          { in: 's = ["H","a","n","n","a","h"]', out: '["h","a","n","n","a","H"]' },
        ],
        constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ASCII character"],
      },
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
      link: "https://leetcode.com/problems/valid-palindrome/",
      statement: {
        description: "Check whether a string reads the same forwards and backwards. (Core idea shown here; the full LeetCode version also ignores case and non-alphanumeric characters.)",
        examples: [
          { in: 's = "racecar"', out: "true" },
          { in: 's = "hello"', out: "false" },
        ],
        constraints: ["Compare characters from both ends moving inward"],
      },
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
      link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      statement: {
        description: "Given a <strong>sorted</strong> array of numbers, find two numbers that add up to a target. Return their 1-based indices.",
        examples: [
          { in: "numbers = [2,7,11,15], target = 9", out: "[1,2]  (2 + 7 = 9)" },
        ],
        constraints: ["Array is sorted in non-decreasing order", "Exactly one solution exists", "Use only O(1) extra space"],
      },
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
    {
      id: "move-zeroes",
      name: "283. Move Zeroes",
      difficulty: "Easy",
      tags: "Two Pointers · Slow / Fast",
      link: "https://leetcode.com/problems/move-zeroes/",
      statement: {
        description: "Move all <code>0</code>s to the end while keeping the order of non-zero elements. Do it in-place. A <strong>slow</strong> pointer marks the next slot for a non-zero; a <strong>fast</strong> pointer scans the array.",
        examples: [
          { in: "nums = [0,1,0,3,12]", out: "[1,3,12,0,0]" },
          { in: "nums = [0]", out: "[0]" },
        ],
        constraints: ["Must be done in-place", "Keep relative order of non-zero values"],
      },
      defaultInput: "0,1,0,3,12",
      inputLabel: "Numbers (comma-sep)",
      parseInput: (s) => s.split(",").map((x) => x.trim()),
      buildFrames: (arr) => moveZeroesFrames(arr),
      code: `def moveZeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
    # Time O(n) · Space O(1)`,
    },
    {
      id: "container-water",
      name: "11. Container With Most Water",
      difficulty: "Medium",
      tags: "Two Pointers · Shrink width",
      link: "https://leetcode.com/problems/container-with-most-water/",
      statement: {
        description: "Each number is a vertical line's height. Pick two lines that, with the x-axis, hold the most water. Area = width × the <strong>shorter</strong> of the two heights. Start widest, then move the shorter wall inward.",
        examples: [
          { in: "height = [1,8,6,2,5,4,8,3,7]", out: "49" },
          { in: "height = [1,1]", out: "1" },
        ],
        constraints: ["Area is limited by the shorter wall", "Moving the taller wall can never help → move the shorter one"],
      },
      defaultInput: "1,8,6,2,5,4,8,3,7",
      inputLabel: "Heights (comma-sep)",
      parseInput: (s) => s.split(",").map((x) => x.trim()),
      buildFrames: (arr) => containerFrames(arr),
      code: `def maxArea(height):
    L, R = 0, len(height) - 1
    best = 0
    while L < R:
        area = (R - L) * min(height[L], height[R])
        best = max(best, area)
        if height[L] < height[R]:
            L += 1      # move the shorter wall
        else:
            R -= 1
    return best
    # Time O(n) · Space O(1)`,
    },
  ],
});
