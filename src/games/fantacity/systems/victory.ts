import type { GameState, VictoryCondition } from '../types'
import {
	FAITH_VICTORY_THRESHOLD,
	DIPLOMACY_QUESTS_REQUIRED,
	DIPLOMACY_TRADES_REQUIRED,
} from '../constants'

/**
 * Check whether any victory condition has been met.
 * Returns the first matched condition or `null`.
 */
export function checkVictory(state: GameState): VictoryCondition | null {
	// Domination — enemy capital destroyed (cleared)
	const capital = state.overworld.find((t) => t.type === 'capital')
	if (capital?.cleared) return 'domination'

	// Religion — accumulated enough faith
	if (state.faithTotal >= FAITH_VICTORY_THRESHOLD) return 'religion'

	// Diplomacy — completed required quests and trades
	if (
		state.diplomacy.questsCompleted >= DIPLOMACY_QUESTS_REQUIRED &&
		state.diplomacy.tradeDeals >= DIPLOMACY_TRADES_REQUIRED
	)
		return 'diplomacy'

	// Science — ultimate spell researched
	const ultimateSpell = state.research.find((r) => r.id === 'ultimate_spell' && r.complete)
	if (ultimateSpell) return 'science'

	return null
}
