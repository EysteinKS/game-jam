# Hub Station

**Time and Space Anomaly Hub Station** — an incremental roguelite strategy prototype.

You are the sentient AI of the Hub, awakening after a catastrophic event. Guide your fleet through uncharted regions of space: collect resources, battle threats, conduct research, and expand your capabilities — all while protecting the Hub from destruction.

---

## Core Loop

1. **Hub Phase** — Manage resources, conduct research, repair the shield
2. **Warp** — Send your fleet into a new region (costs energy)
3. **Region Phase** — Explore a 5×5 grid of space tiles for resources
4. **Return to Hub** — Bring back resources and upgrade for the next run

---

## Controls

All interactions are click/tap based — fully mobile-friendly.

### Hub View

| Tab         | Description                                   |
| ----------- | --------------------------------------------- |
| 🛸 Overview | Fleet status, shield repair, mineral refinery |
| 🔬 Research | Unlock upgrades using science and minerals    |
| 🌀 Warp     | Engage warp drive to enter a new region       |

### Region View

| Tab      | Description                            |
| -------- | -------------------------------------- |
| 🗺️ Map   | Click unexplored tiles to explore them |
| ⚓ Fleet | View vessel hull and status            |
| 📋 Log   | Full event history                     |

---

## Tile Types

| Tile | Name           | Reward                      |
| ---- | -------------- | --------------------------- |
| 🪨   | Asteroid Field | Minerals                    |
| 🌍   | Planet         | Minerals                    |
| 🌌   | Nebula         | Science                     |
| 💎   | Ancient Relic  | Large science bonus         |
| ☠️   | Threat Zone    | Combat — damages fleet hull |
| ❓   | Anomaly        | Science + flavour event     |
| ⬜   | Void           | Nothing                     |

---

## Resources

| Resource | Icon | Use                                    |
| -------- | ---- | -------------------------------------- |
| Energy   | ⚡   | Warp drive, exploration, shield repair |
| Minerals | 🪨   | Research costs, refinery input         |
| Science  | 🔬   | Research costs                         |
| Crew     | 👤   | Required for exploration               |

---

## Game Over Conditions

- All fleet vessels destroyed (hull = 0)
- Hub shield reaches 0%

Stay in a region too long and the spatial anomaly will damage the Hub shield!

---

## Research Categories

- 🚀 **Fleet** — Hull upgrades, combat tactics, new vessel types
- 🧬 **Biological** — Crew capacity, Bio-Vats
- 🔧 **Construction** — Energy capacity, mineral refinery, shield restoration
- 📡 **Communication** — Deep space scanner, quantum previews
