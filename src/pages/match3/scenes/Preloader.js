import Phaser from 'phaser'
import { TILE_TYPES, BOARD_WIDTH, BOARD_HEIGHT } from '../match3Data'

const BAR_W = Math.round(BOARD_WIDTH * 0.55)
const BAR_H = 16

export default class Preloader extends Phaser.Scene {
  constructor() { super('Preloader') }

  init() {
    const cx = BOARD_WIDTH / 2
    const cy = BOARD_HEIGHT / 2

    this.add.rectangle(cx, cy, BOARD_WIDTH, BOARD_HEIGHT, 0xeef7ec).setOrigin(0.5)

    this.add.text(cx, cy - 36, 'Loading…', {
      fontFamily: '"Boogie Boys", system-ui, sans-serif',
      fontSize: '22px',
      color: '#2f6f3e',
    }).setOrigin(0.5)

    // Progress track + bar
    const barX = cx - BAR_W / 2
    const barY = cy

    this.add.rectangle(cx, barY + BAR_H / 2, BAR_W, BAR_H, 0xc8e6c0).setOrigin(0.5)
    const bar = this.add.rectangle(barX, barY, 0, BAR_H, 0x2f6f3e).setOrigin(0, 0)

    this.load.on('progress', p => { bar.width = Math.round(BAR_W * p) })
  }

  preload() {
    for (const tile of TILE_TYPES) {
      this.load.image(tile.key, tile.url)
    }
  }

  create() {
    // Start Game first so UI can get a reference to it via scene.get('Game')
    this.scene.start('Game')
    this.scene.launch('UI')
  }
}
