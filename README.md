# AlgoLens — Understand the question first

A simple visual tool for LeetCode problems. It doesn't give you the solution —
it shows you what the QUESTION is actually asking: the input, the output, and
the one key thing to notice. Use it when you read a problem and the wording
doesn't click yet.

## What it shows per problem
- **Input** — what they hand you, drawn as boxes
- **Output** — what they want back (revealed when you click)
- **Key thing to notice** — the easy-to-miss detail in the question

## Pattern: Two Pointers (5 problems)
Reverse String, Valid Palindrome, Two Sum II, Move Zeroes, Container With Most Water.

## Run locally
ES modules need http, not file://:
```
python3 -m http.server 8000
```

## Add a new problem
Open `patterns/problems.js` and add an object to the PROBLEMS array — input
cells, output cells, a one-line `asking`, and a `hint`. It appears in the
dropdown automatically. No other file to touch.
