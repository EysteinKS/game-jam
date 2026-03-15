import { useRef, useCallback } from 'react'
import type { GameProps } from '@/types'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useCanvas } from '@/hooks/useCanvas'

const BALL_RADIUS = 20
const BALL_SPEED = 200
const PLAYER_SPEED = 300
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 16

interface BallState {
	x: number
	y: number
	vx: number
	vy: number
}

interface PlayerState {
	x: number
}

export default function BouncingBall({ width, height }: GameProps) {
	const { canvasRef, getContext } = useCanvas(width, height)
	const { isKeyDown } = useKeyboard()

	const ballRef = useRef<BallState>({
		x: width / 2,
		y: height / 3,
		vx: BALL_SPEED,
		vy: BALL_SPEED,
	})

	const playerRef = useRef<PlayerState>({
		x: width / 2 - PLAYER_WIDTH / 2,
	})

	const update = useCallback(
		(dt: number) => {
			const ball = ballRef.current
			const player = playerRef.current
			const ctx = getContext()
			if (!ctx) return

			// Move player
			if (isKeyDown('ArrowLeft')) {
				player.x = Math.max(0, player.x - PLAYER_SPEED * dt)
			}
			if (isKeyDown('ArrowRight')) {
				player.x = Math.min(width - PLAYER_WIDTH, player.x + PLAYER_SPEED * dt)
			}

			// Move ball
			ball.x += ball.vx * dt
			ball.y += ball.vy * dt

			// Wall collisions
			if (ball.x - BALL_RADIUS < 0) {
				ball.x = BALL_RADIUS
				ball.vx = Math.abs(ball.vx)
			}
			if (ball.x + BALL_RADIUS > width) {
				ball.x = width - BALL_RADIUS
				ball.vx = -Math.abs(ball.vx)
			}
			if (ball.y - BALL_RADIUS < 0) {
				ball.y = BALL_RADIUS
				ball.vy = Math.abs(ball.vy)
			}

			// Paddle collision
			const paddleY = height - PLAYER_HEIGHT - 20
			if (
				ball.vy > 0 &&
				ball.y + BALL_RADIUS >= paddleY &&
				ball.y - BALL_RADIUS <= paddleY + PLAYER_HEIGHT &&
				ball.x >= player.x &&
				ball.x <= player.x + PLAYER_WIDTH
			) {
				ball.vy = -Math.abs(ball.vy)
				const hitPos = (ball.x - player.x) / PLAYER_WIDTH - 0.5
				ball.vx = hitPos * BALL_SPEED * 2
			}

			// Ball out of bounds — reset
			if (ball.y - BALL_RADIUS > height) {
				ball.x = width / 2
				ball.y = height / 3
				ball.vx = BALL_SPEED
				ball.vy = BALL_SPEED
			}

			// Render
			ctx.clearRect(0, 0, width, height)

			// Background
			ctx.fillStyle = '#1a1a2e'
			ctx.fillRect(0, 0, width, height)

			// Ball
			ctx.beginPath()
			ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2)
			ctx.fillStyle = '#e94560'
			ctx.fill()

			// Paddle
			ctx.fillStyle = '#0f3460'
			ctx.beginPath()
			ctx.roundRect(player.x, paddleY, PLAYER_WIDTH, PLAYER_HEIGHT, 4)
			ctx.fill()
			ctx.strokeStyle = '#16213e'
			ctx.lineWidth = 2
			ctx.stroke()
		},
		[getContext, isKeyDown, width, height],
	)

	useGameLoop({ onUpdate: update })

	return (
		<div className="flex flex-col items-center gap-4">
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="rounded-lg border border-border"
				style={{ display: 'block' }}
			/>
			<p className="text-sm text-muted-foreground">Use ← → arrow keys to move the paddle</p>
		</div>
	)
}
