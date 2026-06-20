import Phaser from 'phaser'
import { BOARD_WIDTH, UI_HEIGHT, TARGET_SCORE, MAX_MOVES } from '../match3Data'

const FONT  = '"Boogie Boys", system-ui, sans-serif'
const GREEN = '#2f6f3e'
const WHITE = '#ffffff'
const GOLD  = '#f6c85f'

export default class UI extends Phaser.Scene {
  constructor() { super('UI') }

  create() {
    const cx = BOARD_WIDTH / 2
    const cy = UI_HEIGHT / 2

    // Panel background
    this.add.rectangle(cx, cy, BOARD_WIDTH, UI_HEIGHT, 0x2f6f3e, 0.95)
      .setOrigin(0.5).setScrollFactor(0)

    // Score (left-center)
    this.add.text(16, cy, 'SCORE', {
      fontFamily: FONT, fontSize: '11px', color: 'rgba(255,255,255,0.6)',
    }).setOrigin(0, 0.5).setScrollFactor(0)

    this.scoreText = this.add.text(16, cy + 12, '0', {
      fontFamily: FONT, fontSize: '22px', color: WHITE,
      stroke: '#163a21', strokeThickness: 2,
    }).setOrigin(0, 0.5).setScrollFactor(0)

    // Target (center)
    this.add.text(cx, cy - 10, 'TARGET', {
      fontFamily: FONT, fontSize: '11px', color: 'rgba(255,255,255,0.6)',
    }).setOrigin(0.5, 0.5).setScrollFactor(0)

    this.add.text(cx, cy + 10, `${TARGET_SCORE}`, {
      fontFamily: FONT, fontSize: '18px', color: GOLD,
      stroke: '#3d3327', strokeThickness: 2,
    }).setOrigin(0.5, 0.5).setScrollFactor(0)

    // Moves (right-center)
    this.add.text(BOARD_WIDTH - 16, cy - 10, 'MOVES', {
      fontFamily: FONT, fontSize: '11px', color: 'rgba(255,255,255,0.6)',
    }).setOrigin(1, 0.5).setScrollFactor(0)

    this.movesText = this.add.text(BOARD_WIDTH - 16, cy + 10, `${MAX_MOVES}`, {
      fontFamily: FONT, fontSize: '22px', color: WHITE,
      stroke: '#163a21', strokeThickness: 2,
    }).setOrigin(1, 0.5).setScrollFactor(0)

    // Combo flash (center, hidden)
    this.comboText = this.add.text(cx, cy, '', {
      fontFamily: FONT, fontSize: '20px', color: GOLD,
      stroke: '#3d3327', strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0).setScrollFactor(0)

    // Listen to Game scene events; remove on shutdown to prevent duplicates
    // when UI is re-launched after a GameOver restart.
    const game = this.scene.get('Game')
    game.events.on('state-update', this.onStateUpdate, this)
    this.events.once('shutdown', () => {
      game.events.off('state-update', this.onStateUpdate, this)
    })
  }

  onStateUpdate(score, movesLeft, combo = 0) {
    this.scoreText.setText(`${score}`)
    this.movesText.setText(`${movesLeft}`)

    // Turn moves red when low
    this.movesText.setColor(movesLeft <= 5 ? '#ff6b6b' : WHITE)

    if (combo > 1) {
      this.comboText.setText(`×${combo} Combo!`)
      this.tweens.killTweensOf(this.comboText)
      this.tweens.add({
        targets: this.comboText,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 1.4, to: 1 },
        scaleY: { from: 1.4, to: 1 },
        duration: 160,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.time.delayedCall(700, () => {
            this.tweens.add({ targets: this.comboText, alpha: 0, duration: 250 })
          })
        },
      })
    }
  }
}
