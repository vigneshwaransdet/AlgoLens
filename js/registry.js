// Central registry. Each pattern module pushes its definition here.
// To add a new pattern: create patterns/yourPattern.js, register it, import in app.js.

export const registry = [];

export function registerPattern(def) {
  // def = { id, name, problems: [ { id, name, difficulty, tags, defaultInput,
  //          inputLabel, parseInput, buildFrames, code } ] }
  registry.push(def);
}
