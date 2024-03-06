export default class Rankings extends Phaser.Scene {
    constructor() {
        super({
            key: 'Rankings'
        });
    }

    preload() {
        this.load.image('testEndButton', 'assets/TestEnd.png');
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('exit', 'assets/exitArrow.png');
        this.load.image('lbHeader', 'assets/leaderboard_assets/leaderboard.png');
        this.load.image('entryBg', 'assets/leaderboard_assets/entryBg.png');
        this.load.image('rankings', 'assets/leaderboard_assets/rankings.png');
        this.load.image('rightArrow', 'assets/leaderboard_assets/rightArrow.png');
        this.load.image('scrollBar1', 'assets/leaderboard_assets/scrollBar1.png');
        this.load.image('scrollBar2', 'assets/leaderboard_assets/scrollBar2.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg');
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        this.header = this.add.image(250, 390, 'rankings').setScale(0.75, 0.75);
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

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        //Scroll panel
        var scrollablePanel = this.rexUI.add.scrollablePanel({
            x: 1000, y: 400,
            width: 500,
            height: 500,

            scrollMode: 'y',

            background: this.rexUI.add.roundRectangle({
                radius: 10
            }),

            panel: {
                child: createPanel(this),

                mask: { padding: 1, },
            },

            slider: {
                track: this.add.sprite(0, 0, 'scrollBar1').setOrigin(0),
                thumb: this.add.sprite(0, 0, 'scrollBar2').setOrigin(0.5, 0),
            },
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },
          
            header: this.add.sprite(),

            footer: this.add.sprite(),

            space: { left: 20, right: 20, top: 20, bottom: 20, panel: 3, header: 5, footer: 5 }
        })
            .layout()

        this.achievements = [];
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

        const achieve = get('http://localhost:3001/uha/fetchUserAch/',userEmail)
        .then(response => {
            console.log(response)
            this.achievements = response.map(item => item.aid);
        });
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

        for (let i = 0; i < this.achievements.length; i++) {
            let texture = 'sampleAch' + this.achievements[i];
            //console.log(texture);
            this.achDisplay[i].setTexture(texture);
        }

        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
    }
}

var CreateContent = function (linesCount) {
    var numbers = [];
    for (var i = 0; i < linesCount; i++) {
        numbers.push(i.toString());
    }
    return numbers.join('\n');
}

var createPanel = function (scene) {
    console.log(scene);
    var entries = scene.add.sprite(250, 100, 'entryBg').setScale(0.75, 0.75);
    var text = scene.add.text(0, 0, 'test', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
    var cont = scene.add.container(0, 0, [entries, text]);
    var container = scene.add.container()
        .add(cont)
        .setSize(200, text.height);

    return container;
}