import { registerPattern } from "../js/registry.js";

function cells(arr, winSet, bestSet) {
  return arr.map((v, i) => ({
    value: v,
    state: bestSet && bestSet.has(i) ? "settled"
         : winSet && winSet.has(i) ? "ptr"
         : "normal",
  }));
}
function windowSet(l, r) {
  const s = new Set();
  for (let i = l; i <= r; i++) s.add(i);
  return s;
}

// ===== Max sum of subarray size k =====
function maxSubFrames(arr, k) {
  const nums = arr.map(Number);
  const frames = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum, bestL = 0;

  frames.push({
    cells: cells(arr, windowSet(0, k - 1), null),
    tags: { 0: "start", [k - 1]: "end" },
    note: `First window of size <span class="hl">${k}</span>. Sum = <span class="hl">${sum}</span>.`,
    swapPair: null,
  });

  for (let r = k; r < nums.length; r++) {
    const l = r - k + 1;
    sum += nums[r] - nums[l - 1];
    if (sum > best) { best = sum; bestL = l; }
    frames.push({
      cells: cells(arr, windowSet(l, r), null),
      tags: { [l]: "start", [r]: "end" },
      note: `Slide right: add <span class="hl">${nums[r]}</span>, drop <span class="hl">${nums[l - 1]}</span>. Sum = ${sum}. Best so far = ${best}.`,
      swapPair: null,
    });
  }
  frames.push({
    cells: cells(arr, null, windowSet(bestL, bestL + k - 1)),
    tags: {},
    note: `Max window sum = <span class="hl">${best}</span>. No re-adding — each element touched once, <span class="hl">O(n)</span>.`,
    swapPair: null,
  });
  return frames;
}

// ===== Longest substring without repeating chars =====
function longestUniqueFrames(arr) {
  const frames = [];
  const seen = new Set();
  let l = 0, bestLen = 0, bestL = 0;

  frames.push({
    cells: cells(arr, new Set([0]), null),
    tags: { 0: "L,R" },
    note: `Grow the window with R. Shrink from L when a repeat appears.`,
    swapPair: null,
  });

  for (let r = 0; r < arr.length; r++) {
    while (seen.has(arr[r])) {
      seen.delete(arr[l]);
      l++;
      frames.push({
        cells: cells(arr, windowSet(l, r), null),
        tags: { [l]: "L", [r]: "R" },
        note: `Repeat of <span class="hl">${arr[r]}</span> — shrink: move L to ${l}.`,
        swapPair: null,
      });
    }
    seen.add(arr[r]);
    const len = r - l + 1;
    if (len > bestLen) { bestLen = len; bestL = l; }
    frames.push({
      cells: cells(arr, windowSet(l, r), null),
      tags: { [l]: "L", [r]: "R" },
      note: `Add <span class="hl">${arr[r]}</span>. Window length = ${len}. Best = ${bestLen}.`,
      swapPair: null,
    });
  }
  frames.push({
    cells: cells(arr, null, windowSet(bestL, bestL + bestLen - 1)),
    tags: {},
    note: `Longest unique window = <span class="hl">${bestLen}</span>.`,
    swapPair: null,
  });
  return frames;
}

registerPattern({
  id: "sliding-window",
  name: "Sliding Window",
  problems: [
    {
      id: "max-sub-k",
      name: "Max sum subarray (size k)",
      difficulty: "Easy",
      tags: "Sliding Window · Fixed size",
      link: "https://leetcode.com/problems/maximum-average-subarray-i/",
      statement: {
        description: "Find the largest sum of any contiguous block of exactly <code>k</code> elements. Instead of re-summing every block, slide the window: add the new element, drop the one that left.",
        examples: [
          { in: "nums = [2,1,5,1,3,2], k = 3", out: "9  (5 + 1 + 3)" },
        ],
        constraints: ["Window size k is fixed", "Each element is added and removed once → O(n)"],
      },
      defaultInput: "2,1,5,1,3,2",
      inputLabel: "Numbers (comma-sep)",
      extraInput: { label: "Window size k", default: "3" },
      parseInput: (s) => s.split(",").map((x) => x.trim()),
      buildFrames: (arr, extra) => maxSubFrames(arr, Number(extra)),
      code: `def maxSum(nums, k):
    s = sum(nums[:k])
    best = s
    for r in range(k, len(nums)):
        s += nums[r] - nums[r - k]   # slide: add new, drop old
        best = max(best, s)
    return best
    # Time O(n) · Space O(1)`,
    },
    {
      id: "longest-unique",
      name: "3. Longest substring no repeat",
      difficulty: "Medium",
      tags: "Sliding Window · Variable size",
      link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      statement: {
        description: "Find the length of the longest substring with no repeating characters. Grow the window on the right; when a repeat appears, shrink from the left until it's gone.",
        examples: [
          { in: 's = "abcabcbb"', out: "3  (\"abc\")" },
          { in: 's = "bbbbb"', out: "1  (\"b\")" },
        ],
        constraints: ["Window grows and shrinks (variable size)", "Track characters currently in the window"],
      },
      defaultInput: "abcabcbb",
      inputLabel: "String",
      parseInput: (s) => s.split(""),
      buildFrames: (arr) => longestUniqueFrames(arr),
      code: `def lengthOfLongestSubstring(s):
    seen = set()
    l = best = 0
    for r in range(len(s)):
        while s[r] in seen:
            seen.remove(s[l]); l += 1   # shrink
        seen.add(s[r])
        best = max(best, r - l + 1)
    return best
    # Time O(n) · Space O(min(n, charset))`,
    },
  ],
});
