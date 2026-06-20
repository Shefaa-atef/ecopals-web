import Phaser from 'phaser'
import { BOARD_WIDTH, BOARD_HEIGHT, TARGET_SCORE } from '../match3Data'

const FONT  = '"Boogie Boys", system-ui, sans-serif'
const cx    = BOARD_WIDTH / 2
const cy    = BOARD_HEIGHT / 2

export default class GameOver extends Phaser.Scene {
  constructor() { super('GameOver') }

  init(data) {
    this.won   = data.won   ?? false
    this.score = data.score ?? 0
  }

  create() {
    // Dim overlay
    this.add.rectangle(cx, cy, BOARD_WIDTH, BOARD_HEIGHT, 0x000000, 0.55)
      .setOrigin(0.5)

    // Card
    const cardW = BOARD_WIDTH * 0.72
    const cardH = 240
    this.add.rectangle(cx, cy, cardW, cardH, 0xfafff7, 0.97)
      .setOrigin(0.5)
      .setStrokeStyle(3, 0x2f6f3e, 1)

    // Headline
    const headline = this.won ? '🎉 You Win!' : 'Game Over'
    const headColor = this.won ? '#2f6f3e' : '#c0392b'
    this.add.text(cx, cy - 76, headline, {
      fontFamily: FONT, fontSize: '32px', color: headColor,
    }).setOrigin(0.5)

    // Score
    this.add.text(cx, cy - 28, `Score: ${this.score}`, {
      fontFamily: FONT, fontSize: '22px', color: '#333',
    }).setOrigin(0.5)

    if (!this.won) {
      this.add.text(cx, cy + 8, `Target was: ${TARGET_SCORE}`, {
        fontFamily: FONT, fontSize: '15px', color: '#888',
      }).setOrigin(0.5)
    }

    // Restart button
    const btn = this.add.rectangle(cx, cy + 70, 160, 44, 0x2f6f3e)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    this.add.text(cx, cy + 70, 'Play Again', {
      fontFamily: FONT, fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5)

    btn.on('pointerover',  () => btn.setFillStyle(0x3d8f52))
    btn.on('pointerout',   () => btn.setFillStyle(0x2f6f3e))
    btn.on('pointerdown',  () => btn.setFillStyle(0x245c31))
    btn.on('pointerup',    () => {
      // Game.create() always calls scene.launch('UI'), so starting Game is
      // all that's needed — no manual UI stop/restart required.
      this.scene.start('Game')
    })
  }
}
