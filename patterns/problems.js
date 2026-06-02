// Each problem describes ONLY what the question is asking — not how to solve it.
// Visual = input row + output row + a one-line hint. No solution, no animation logic.
//
// Field shapes:
//   asking:  one-line plain summary of what the question wants
//   input:   { label, cells: [{v, tag?}], note }   — what they give you
//   output:  { label, cells: [{v, tag?}], note }   — what they want back
//   hint:    the "aha" about reading the question (e.g. in-place, sorted, etc.)
//   link:    LeetCode url
//
// cells render as boxes. tag (optional) shows a small label under a box.

export const PROBLEMS = [
  {
    id: "reverse-string",
    name: "344. Reverse String",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/reverse-string/",
    asking: "Take a row of letters and flip the order — last becomes first.",
    input: {
      label: "they give you these letters, in a list",
      cells: [{v:"h"},{v:"e"},{v:"l"},{v:"l"},{v:"o"}],
      note: "Positions 0,1,2,3,4 — like seats in a row.",
    },
    output: {
      label: "they want the same letters, reversed",
      cells: [{v:"o"},{v:"l"},{v:"l"},{v:"e"},{v:"h"}],
      note: "Same letters, opposite order.",
    },
    hint: "The same row is reused — they don't ask for a brand-new list, just the letters rearranged in place.",
  },
  {
    id: "valid-palindrome",
    name: "125. Valid Palindrome",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-palindrome/",
    asking: "Check if a word reads the same forwards and backwards.",
    input: {
      label: "they give you a word",
      cells: [{v:"r"},{v:"a"},{v:"c"},{v:"e"},{v:"c"},{v:"a"},{v:"r"}],
      note: "Read it left-to-right, then right-to-left.",
    },
    output: {
      label: "they want a yes / no answer",
      cells: [{v:"true"}],
      note: "true if it mirrors, false if not. \"racecar\" mirrors → true.",
    },
    hint: "Output is just true or false — not a new word. You're answering a question, not building something.",
  },
  {
    id: "two-sum-ii",
    name: "167. Two Sum II",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    asking: "Find the two numbers that add up to a target.",
    input: {
      label: "a sorted list of numbers + a target",
      cells: [{v:"2"},{v:"7"},{v:"11"},{v:"15"}],
      note: "Target = 9. The list is already sorted small → big.",
    },
    output: {
      label: "they want the positions of the two numbers",
      cells: [{v:"1"},{v:"2"}],
      note: "2 (position 1) + 7 (position 2) = 9. Return the positions, not the numbers.",
    },
    hint: "Output is positions (indices), not the numbers themselves. And note the input is already sorted — that's a clue they're handing you.",
  },
  {
    id: "move-zeroes",
    name: "283. Move Zeroes",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/move-zeroes/",
    asking: "Push all the zeros to the end, keep the rest in order.",
    input: {
      label: "a list with some zeros mixed in",
      cells: [{v:"0"},{v:"1"},{v:"0"},{v:"3"},{v:"12"}],
      note: "Zeros are scattered around.",
    },
    output: {
      label: "zeros at the end, others keep their order",
      cells: [{v:"1"},{v:"3"},{v:"12"},{v:"0"},{v:"0"}],
      note: "1, 3, 12 stay in the same order — only the zeros move to the back.",
    },
    hint: "The non-zero numbers must keep their original order — you're not sorting, just moving zeros aside.",
  },
  {
    id: "container-water",
    name: "11. Container With Most Water",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/container-with-most-water/",
    asking: "Pick two walls that hold the most water between them.",
    input: {
      label: "each number is the height of a wall",
      cells: [{v:"1"},{v:"8"},{v:"6"},{v:"2"},{v:"5"},{v:"4"},{v:"8"},{v:"3"},{v:"7"}],
      note: "Imagine vertical walls of these heights, side by side.",
    },
    output: {
      label: "they want the most water any two walls can hold",
      cells: [{v:"49"}],
      note: "Water = distance between walls × the shorter wall's height. Best here = 49.",
    },
    hint: "Water is capped by the SHORTER wall, and wider gaps hold more. The answer is a single number — the max area.",
  },
];

export const PATTERN_NAME = "Two Pointers";
