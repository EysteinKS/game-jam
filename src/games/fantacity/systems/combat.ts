import type { ArmyComposition, BattleResult, BattleRound, OverworldTile } from '../types'
import { UNIT_DEFS } from '../constants'

/** Compute total attack and HP pool for an army. */
function armyStats(army: ArmyComposition): { totalAttack: number; totalHp: number } {
	let totalAttack = 0
	let totalHp = 0
	for (const def of UNIT_DEFS) {
		const count = army[def.type]
		totalAttack += def.attack * count
		totalHp += def.hp * count
	}
	return { totalAttack, totalHp }
}

/** Encounter defender strength scales with tile difficulty (1–5). */
function defenderStats(difficulty: number): { attack: number; hp: number } {
	return {
		attack: difficulty * 15,
		hp: difficulty * 80,
	}
}

/**
 * Deterministic autobattle: each round the attacker and defender exchange
 * damage simultaneously until one side reaches 0 HP.
 */
export function resolveBattle(army: ArmyComposition, tile: OverworldTile): BattleResult {
	const { totalAttack: playerAttack, totalHp: playerMaxHp } = armyStats(army)
	const { attack: enemyAttack, hp: enemyMaxHp } = defenderStats(tile.difficulty)

	if (playerAttack === 0) {
		return {
			victory: false,
			rounds: [
				{
					round: 1,
					attackerLosses: { ...army },
					defenderHpRemaining: enemyMaxHp,
					narrative: 'Your army has no units and was routed immediately.',
				},
			],
			survivingArmy: { soldier: 0, archer: 0, knight: 0, mage: 0 },
			lootGained: {},
			faithGained: 0,
		}
	}

	let playerHp = playerMaxHp
	let enemyHp = enemyMaxHp
	const rounds: BattleRound[] = []
	let roundNum = 1

	while (playerHp > 0 && enemyHp > 0 && roundNum <= 20) {
		playerHp -= enemyAttack
		enemyHp -= playerAttack

		const narrative =
			enemyHp <= 0
				? `Round ${roundNum}: Your forces overwhelm the enemy!`
				: playerHp <= 0
					? `Round ${roundNum}: The enemy breaks your lines!`
					: `Round ${roundNum}: Fierce fighting continues. Enemy HP: ${Math.max(0, Math.round(enemyHp))}`

		rounds.push({
			round: roundNum,
			attackerLosses: {},
			defenderHpRemaining: Math.max(0, enemyHp),
			narrative,
		})

		roundNum++
	}

	const victory = enemyHp <= 0

	// Surviving army fraction proportional to remaining HP
	const survivorRatio = victory ? Math.max(0, playerHp / playerMaxHp) : 0
	const survivingArmy: ArmyComposition = {
		soldier: Math.floor(army.soldier * survivorRatio),
		archer: Math.floor(army.archer * survivorRatio),
		knight: Math.floor(army.knight * survivorRatio),
		mage: Math.floor(army.mage * survivorRatio),
	}

	return {
		victory,
		rounds,
		survivingArmy,
		lootGained: victory ? { ...tile.loot } : {},
		faithGained: victory ? tile.difficulty * 5 : 0,
	}
}
