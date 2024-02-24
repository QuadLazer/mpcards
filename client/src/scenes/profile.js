export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Profile'
        });
    }

    preload() {
        this.load.image('testEndButton', 'assets/TestEnd.png');
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('profileHeader', 'assets/profile_assets/profile.png');
        this.load.image('username', 'assets/profile_assets/usernameHeader.png');
        this.load.image('email', 'assets/profile_assets/emailHeader.png');
        this.load.image('winCount', 'assets/profile_assets/winCountHeader.png');
        this.load.image('exit', 'assets/exitArrow.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg');
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        this.header = this.add.image(250, 390, 'profileHeader').setScale(0.75, 0.75);
        this.usernameHeader = this.add.image(1020, 100, 'username').setScale(0.75, 0.75);
        this.emailHeader = this.add.image(1020, 300, 'email').setScale(0.75, 0.75);
        this.winCountHeader = this.add.image(1020, 500, 'winCount').setScale(0.75, 0.75);

        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));

        this.exit.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('Game');
        }, this)
    }
    
    update() {
        
    }
}