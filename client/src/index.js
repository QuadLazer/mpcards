import Phaser from "phaser";
import Game from "./scenes/game";
import Login from "./scenes/login";
import FirebasePlugin from "./plugins/FirebasePlugin";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,
    dom: {
        createContainer: true
    },
    scene: [
        Login,
        Game
    ],
    plugins: {
        global: [
            {
                key: 'FirebasePlugin',
                plugin: FirebasePlugin,
                start: true,
                mapping: 'firebase'
            }
        ]
    }
};

const game = new Phaser.Game(config);