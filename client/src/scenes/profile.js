import FirebasePlugin from '../plugins/FirebasePlugin.js'

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
        this.userName = this.add.text(1230, 150, 'Loading...', 
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0);
        this.userName.setStroke('#000000', 6);
        this.userName.setShadow(4, 4, '#000000', 0);
        this.userEmail = this.add.text(1230, 350, 'Loading...', 
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0);
        this.userEmail.setStroke('#000000', 6);
        this.userEmail.setShadow(4, 4, '#000000', 0);
        this.userWinCount = this.add.text(1230, 550, 'Loading...', 
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0);
        this.userWinCount.setStroke('#000000', 6);
        this.userWinCount.setShadow(4, 4, '#000000', 0);

        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));

        this.exit.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('Game');
        }, this)

        let firebaseApp = this.plugins.get('FirebasePlugin');
        console.log(firebaseApp.getUser())
        const userEmail = firebaseApp.getUser().email;

        this.uname = '';
        this.email = '';
        this.winCount = 0;

        const request = ( url, param, method = 'GET' ) => {

            url +=  ( param).toString();        
            return fetch( url ).then( response => response.json() );
        };
        const get = ( url, param ) => request( url, param, 'GET' );

        get('http://localhost:3001/users/findUser/', userEmail)
        .then(response => {
            console.log(response);
            this.uname = response.uname;
            this.email = response.email;
            this.winCount = response.win_count;
        })
        
    }
    
    update() {
        if (this.uname == '' || this.email == '') {
            this.userName.setText('Loading...');
            this.userEmail.setText('Loading...');
            this.userWinCount.setText('Loading...');
        } else {
            this.userName.setText(this.uname);
            this.userEmail.setText(this.email);
            this.userWinCount.setText(this.winCount);
        }
    }
}