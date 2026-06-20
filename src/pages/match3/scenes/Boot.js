import Phaser from 'phaser'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../match3Data'

export default class Boot extends Phaser.Scene {
  constructor() { super('Boot') }

  create() {
    this.scale.setGameSize(BOARD_WIDTH, BOARD_HEIGHT)
    this.scene.start('Preloader')
  }
}
