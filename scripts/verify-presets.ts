import { evaluatePreset } from "../lib/evaluate";
import { PRESETS } from "../lib/presets";

const asOf = new Date("2026-08-14T16:00:00Z");

const rows = PRESETS.map((preset) => {
  const evaluation = evaluatePreset(preset, asOf);
  return {
    id: preset.id,
    score: evaluation.quality.overall,
    label: evaluation.quality.label,
    agreement: evaluation.crossMarket.agreement,
    disagreement: evaluation.crossMarket.disagreementPp,
    failures: evaluation.quality.failureModes.map((mode) => mode.code).join(" "),
    coverage: evaluation.coverage.dataCoverage,
    provisional: evaluation.coverage.isProvisional,
  };
});

console.table(rows);

const scores = rows.map((row) => row.score);
const unique = new Set(scores);
if (unique.size !== scores.length) {
  throw new Error("Preset scores are not distinct.");
}

const high = rows.filter((row) => row.score >= 85);
if (high.length === rows.length) {
  throw new Error("Every preset scored as a strong signal.");
}

const weak = rows.filter((row) => row.score < 70);
if (weak.length === 0) {
  throw new Error("Expected at least one preset below Moderately Strong.");
}

if (rows.some((row) => row.coverage !== 100 || row.provisional)) {
  throw new Error("Synthetic presets must have complete evidence coverage.");
}

console.log("Preset checks passed.");
