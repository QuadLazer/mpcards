import Phaser from "phaser";
import Game from "./scenes/game";
import Load from "./scenes/load";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,
    scene: [
        Load,
        Game
    ]
};

const game = new Phaser.Game(config);