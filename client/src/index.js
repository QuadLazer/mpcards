import Phaser from "phaser";
import Game from "./scenes/game";
import Load from "./scenes/load";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import MainMenu from "./scenes/mainmenu";
import FirebasePlugin from "./plugins/FirebasePlugin";
import Profile from "./scenes/profile";
import Rankings from "./scenes/rankings";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

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
        MainMenu,
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
        ],
        scene: [
            {
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
            }
        ]
    }
};

const game = new Phaser.Game(config);