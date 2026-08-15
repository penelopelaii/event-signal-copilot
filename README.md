# Event Signal Copilot

**A research workbench for evaluating whether a market-produced probability deserves to be trusted.**

Markets can compress dispersed information into probabilities, but a probability is not automatically a reliable signal.

Event Signal Copilot evaluates liquidity, spread, depth, freshness, stability, resolution clarity, cross-market confirmation, and participation before turning event-driven market signals into structured research briefs.

The deterministic signal-quality model is the product core. AI-style synthesis is downstream of the scoring logic, not the source of truth.

## Core question

When is an event-driven market signal actually decision-useful?

The workbench is built to answer a research sequence:

1. What is the event?
2. What is currently priced in?
3. How reliable is the signal?
4. What market-quality factors support or weaken it?
5. Do other markets or data sources confirm the same view?
6. What exposures may be affected?
7. What would change or invalidate the current interpretation?

## Signal Quality Engine

Signal Quality is a deterministic TypeScript engine. It is not a probability forecasting model and it does not attempt to predict whether the event will occur. It evaluates whether a market-implied signal appears structurally informative.

| Dimension | Question |
| --- | --- |
| Liquidity | How much real two-way activity exists? |
| Spread | How tight is the market relative to the quote? |
| Depth | Can meaningful size trade without moving probability too far? |
| Freshness | How recently has the market incorporated information? |
| Stability | Is the path orderly, or chaotically repriced? |
| Resolution clarity | Is the event objectively resolvable? |
| Cross-market confirmation | Do other sources broadly agree? |
| Participation | How broad vs. concentrated is the book? (synthetic proxy) |

**Outcome probability ≠ signal quality.** A market can show 80% while still being a weak signal if liquidity is poor, the spread is wide, or resolution criteria are ambiguous.

Labels (synthetic thresholds, not empirically calibrated):

| Score | Label |
| --- | --- |
| 85–100 | Strong Signal |
| 70–84 | Moderately Strong |
| 50–69 | Mixed Signal |
| 30–49 | Weak Signal |
| 0–29 | Not Decision-Useful |

## Cross-market confirmation

The Cross-Market View compares the event-implied probability with other synthetic sources such as rates-implied paths, economist consensus, options-implied scenarios, polling, and credit.

Agreement and disagreement are reported. The model does not choose a winner. The research object is the gap.

## Synthetic v1 data

v1 uses synthetic event profiles. Scores below are produced by the Signal Quality Engine from those presets:

| Preset | Score | Label |
|---|---:|---|
| Fed rate decision | 82 | Moderately Strong |
| CPI surprise | 85 | Strong Signal |
| ETF approval | 63 | Mixed Signal |
| House majority | 78 | Moderately Strong |
| Regulatory ruling | 46 | Weak Signal |
| Recession | 65 | Mixed Signal |

v1 uses synthetic inputs. The data layer is structured for future read-only integrations with event markets, macro data, rates, yields, and options-derived signals.

## Relationship to PrivatePerp and Listing Readiness Simulator

| Project | Question | Focus |
| --- | --- | --- |
| PrivatePerp Risk Engine | When should a perp stop being a perp? | Continuous margining, mark reliability, liquidation, mechanism switching |
| Listing Readiness Simulator | What market structure can an asset support before listing? | Observability, liquidity, hedgeability, settlement, mechanism choice |
| Event Signal Copilot | When is an event-driven market signal actually worth trusting? | Price discovery, information quality, liquidity, cross-market confirmation |

## Disclaimer

This is a research prototype. Signal Quality scores are synthetic. Thresholds are not empirically calibrated. Event probabilities in v1 come from synthetic data.

This product does not predict outcomes. It does not execute trades. Nothing here is investment advice.

Market signals may be noisy, illiquid, manipulated, stale, or structurally unreliable.
