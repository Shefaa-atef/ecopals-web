import { useEffect } from 'react'
import Phaser from 'phaser'
import { BOARD_WIDTH, BOARD_HEIGHT } from './match3Data'
import Boot     from './scenes/Boot'
import Preloader from './scenes/Preloader'
import Game     from './scenes/Game'
import UI       from './scenes/UI'
import GameOver from './scenes/GameOver'

export default function useMatch3(containerRef) {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      backgroundColor: '#eef7ec',
      parent: containerRef.current,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [Boot, Preloader, Game, UI, GameOver],
    })

    return () => game.destroy(true)
  }, [])
}
