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
        this.playButton = this.add.image(40, 40, 'playButton').setScale(0.75, 0.75).setInteractive();
        this.profileButton = this.add.image(80, 80, 'profileButton').setScale(0.75, 0.75).setInteractive();
        this.rankingsButton = this.add.image(100, 100, 'rankingsButton').setScale(0.75, 0.75).setInteractive();
        this.title = this.add.image(600, 100, 'title').setScale(0.75, 0.75).setInteractive();
    }
}