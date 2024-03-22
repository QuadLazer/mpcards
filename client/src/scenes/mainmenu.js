import io from 'socket.io-client';
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu')
    }

    preload() {
        this.load.image('title','assets/menu_assets/title.png');
        this.load.image('playButton','assets/menu_assets/playButton.png');
        this.load.image('profileButton','assets/menu_assets/profileButton.png');
        this.load.image('rankingsButton','assets/menu_assets/rankingsButton.png');
        this.load.image('bg', 'assets/bgtest.png');
    }

    create () {
        this.bg = this.add.image(0, 0, 'bg');
        this.playButton = this.add.image(460, 500, 'playButton').setScale(0.75, 0.75).setInteractive();
        this.profileButton = this.add.image(960, 570, 'profileButton').setScale(0.75, 0.75).setInteractive();
        this.rankingsButton = this.add.image(950, 393, 'rankingsButton').setScale(0.75, 0.75).setInteractive();
        this.title = this.add.image(650, 150, 'title').setScale(0.75, 0.75).setInteractive();
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        
        this.socket = io('http://localhost:3000');

        this.playButton.on('pointerup', function (pointer) {
            this.scene.start('Loading', {socket: this.socket});
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