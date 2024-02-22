import Phaser from "phaser";
import Game from "./scenes/game";
import Profile from "./scenes/profile";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,
    scene: [
        Game,
        Profile
    ]
};

const game = new Phaser.Game(config);