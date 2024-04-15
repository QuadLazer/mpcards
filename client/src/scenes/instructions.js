import io from 'socket.io-client';
import FirebasePlugin from '../plugins/FirebasePlugin';

export default class Instructions extends Phaser.Scene {
    constructor() {
        super('Instructions')
    }

    preload() {
        this.load.image('title','assets/menu_assets/title.png');
        this.load.image('playButton','assets/menu_assets/playButton.png');
        this.load.image('profileButton','assets/menu_assets/profileButton.png');
        this.load.image('rankingsButton','assets/menu_assets/rankingsButton.png');
        this.load.image('logOut', 'assets/menu_assets/logOut.png');
        this.load.image('bg', 'assets/bgtest.png');

        this.load.image('exitIcon', 'assets/instruct_assets/exitIcon.png');
        this.load.image('page1', 'assets/instruct_assets/page1.png');
        this.load.image('page2', 'assets/instruct_assets/page2.png');
        this.load.image('page3', 'assets/instruct_assets/page3.png');
        this.load.image('page4', 'assets/instruct_assets/page4.png');
        this.load.image('page5', 'assets/instruct_assets/page5.png');
        this.load.image('shadowBG', 'assets/instruct_assets/shadowTheHedgehog.png');

        this.load.image('rightArrow', 'assets/leaderboard_assets/rightArrow.png');
        this.load.image('leftArrow', 'assets/exitArrow.png');
    }
    

    create () {
        this.currentPage = 1;
        this.bg = this.add.image(0, 0, 'bg');
        this.shadowBG = this.add.image(0, 0, 'shadowBG').setDepth(100);
        this.playButton = this.add.image(460, 500, 'playButton').setScale(0.75, 0.75)
        this.profileButton = this.add.image(960, 570, 'profileButton').setScale(0.75, 0.75)
        this.rankingsButton = this.add.image(950, 393, 'rankingsButton').setScale(0.75, 0.75)
        this.title = this.add.image(650, 150, 'title').setScale(0.75, 0.75);
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        Phaser.Display.Align.In.Center(this.shadowBG, this.add.zone(640, 390, 1280, 780));

        this.page = this.add.sprite(640, 390, 'page1').setScale(0.80, 0.80).setDepth(101);
        this.exitIcon= this.add.image(1220, 60, 'exitIcon').setScale(0.75, 0.75).setInteractive().setDepth(101);
        this.rightArrow = this.add.image(1050, 615, 'rightArrow').setScale(0.75, 0.75).setInteractive().setDepth(101);
        this.leftArrow = this.add.image(950, 615, 'leftArrow').setScale(0.75, 0.75).setInteractive().setDepth(101);
        this.number = this.add.text(990, 590, '1', { color: 'white', fontFamily: 'Woodchuck-Bold', fontSize: '36px'}).setDepth(101);
        this.number.setStroke('#000000', 6);
        this.number.setShadow(4, 4, '#000000', 0);
        

        
        this.exitIcon.on('pointerdown', function (pointer) {
            this.exitIcon.setTint(0x878787);
        }, this);

        this.exitIcon.on('pointerup', function (pointer) {
            this.exitIcon.setTint();
            this.currentPage = 0;
            this.scene.start("MainMenu");
        }, this);

        this.rightArrow.on('pointerdown', function (pointer) {
            this.rightArrow.setTint(0x878787);
        }, this);

        this.rightArrow.on('pointerup', function (pointer) {
            this.rightArrow.setTint();
            if (this.currentPage < 5) {
                this.currentPage++;
                this.number.setText(this.currentPage);
                if (this.currentPage != 1 && this.currentPage - 1 == 1) {
                    this.number.x = this.number.x - 5;
                }
            }
            this.page.setTexture('page' + this.currentPage);
        }, this);
        
        this.leftArrow.on('pointerdown', function (pointer) {
            this.leftArrow.setTint(0x878787);
        }, this);

        this.leftArrow.on('pointerup', function (pointer) {
            this.leftArrow.setTint();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.number.setText(this.currentPage);
                if (this.currentPage == 1) {
                    this.number.x = 990;
                }
            }
            this.page.setTexture('page' + this.currentPage);
        }, this);
    }
}