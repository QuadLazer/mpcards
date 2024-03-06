import Phaser from "phaser";
import Game from "./scenes/game";
import Load from "./scenes/load";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import FirebasePlugin from "./plugins/FirebasePlugin";
import Profile from "./scenes/profile";
import Rankings from "./scenes/rankings";

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
        Load,
        Game,
        Profile,
        Signup,
        Rankings
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
        },
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