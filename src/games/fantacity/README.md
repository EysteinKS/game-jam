# Fantacity

A medieval-fantasy RTS prototype focused on **base management** and **autobattle combat** — no point-and-click unit micro required.

## Controls

| Action              | How                                                                          |
| ------------------- | ---------------------------------------------------------------------------- |
| Assign workers      | Workers tab → `+` / `−` buttons                                              |
| Queue a building    | Build tab → click **Build**                                                  |
| Research technology | Research tab → click **Research**                                            |
| Recruit units       | Army tab → click **Recruit**                                                 |
| Open Overworld      | Click **🗺️ Overworld** in the header (or Army tab → **Send to Overworld →**) |
| Attack a tile       | Overworld → click an uncleared tile                                          |
| Restart (`R`)       | Press `R` on victory / defeat screens                                        |

## Resources

| Icon | Resource  | Source                            |
| ---- | --------- | --------------------------------- |
| 🪙   | Gold      | Mine workers                      |
| 🌾   | Food      | Farm workers                      |
| 🪨   | Stone     | Quarry workers                    |
| 🪵   | Wood      | Lumber workers                    |
| ✨   | Faith     | Chapel workers + battle victories |
| 📜   | Knowledge | Library workers                   |

## Buildings

Build structures from the **Build** tab to unlock new units, increase population and enable research.

| Building      | Unlocks                         |
| ------------- | ------------------------------- |
| Barracks      | Soldiers, Archery Range, Stable |
| Archery Range | Archers                         |
| Stable        | Knights                         |
| Library       | Research, Mage Tower            |
| Mage Tower    | Mages, arcane research          |
| Temple        | Boosts faith generation         |
| Market        | Trade route research            |
| Walls         | Capital defence                 |

## Units

| Unit    | Requires      | Role                         |
| ------- | ------------- | ---------------------------- |
| Soldier | Barracks      | Balanced melee               |
| Archer  | Archery Range | High attack, fragile         |
| Knight  | Stable        | Heavy frontline              |
| Mage    | Mage Tower    | Extreme attack, glass cannon |

## Victory Conditions

| Condition         | How to win                                                |
| ----------------- | --------------------------------------------------------- |
| ⚔️ **Domination** | Defeat the Enemy Capital on the Overworld                 |
| ✨ **Religion**   | Accumulate 400 total Faith                                |
| 🤝 **Diplomacy**  | Complete 3 quests + 5 trade deals (Market + Trade Routes) |
| 📜 **Science**    | Research the **Ultimate Spell** (requires Arcane Arts)    |

## Overworld

The overworld is a 4×5 grid of encounter tiles:

- 🌲 **Forest** — Low difficulty, wood & gold loot
- 🏚️ **Ruins** — Medium difficulty, gold & knowledge
- 🏘️ **Village** — Medium difficulty, food & gold
- 🏯 **Enemy Base** — High difficulty, large resource loot
- 🏰 **Capital** — Boss encounter — winning triggers Domination victory

Cleared tiles (✓) cannot be attacked again. Winning a battle returns surviving units and grants loot + faith.
