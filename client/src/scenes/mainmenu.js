import io from 'socket.io-client';
import FirebasePlugin from '../plugins/FirebasePlugin';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu')
    }

    preload() {
        this.load.image('title','assets/menu_assets/title.png');
        this.load.image('playButton','assets/menu_assets/playButton.png');
        this.load.image('profileButton','assets/menu_assets/profileButton.png');
        this.load.image('rankingsButton','assets/menu_assets/rankingsButton.png');
        this.load.image('logOut', 'assets/menu_assets/logOut.png');
        this.load.image('bg', 'assets/bgtest.png');
    }
    

    create (loginFlag) {

        var firebaseApp = this.plugins.get('FirebasePlugin');
        
        this.bg = this.add.image(0, 0, 'bg');
        this.playButton = this.add.image(460, 500, 'playButton').setScale(0.75, 0.75).setInteractive();
        this.profileButton = this.add.image(960, 570, 'profileButton').setScale(0.75, 0.75).setInteractive();
        this.rankingsButton = this.add.image(950, 393, 'rankingsButton').setScale(0.75, 0.75).setInteractive();
        this.title = this.add.image(650, 150, 'title').setScale(0.75, 0.75).setInteractive();
        this.logOut = this.add.image(60, 60, 'logOut').setScale(0.75, 0.75).setInteractive();
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        
        if (this.socket == null) {
            console.log("I was null!");
            this.socket = io('http://localhost:3000');
        } else {
            console.log("I'm already set!");
            this.socket.close();
            this.socket = io('http://localhost:3000');
        }

        this.playButton.on('pointerup', function (pointer) {
            this.scene.start('Loading', {socket: this.socket});
        }, this);

        this.logOut.on('pointerup', function (pointer) {
            this.socket.disconnect();
            firebaseApp.auth.signOut().then((firebaseApp) => {
                console.log('Signed out');
                this.scene.start('Login', loginFlag);
            }).catch((error) => {
                console.log(error);
            });
        }, this);

        this.profileButton.on('pointerup', function (pointer) {
            this.scene.start('Profile');
            this.socket.disconnect();
        }, this);

        this.rankingsButton.on('pointerup', function (pointer) {
            this.scene.start('Rankings');
            this.socket.disconnect();
        }, this)
    }
}