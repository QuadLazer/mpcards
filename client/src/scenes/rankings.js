export default class Rankings extends Phaser.Scene {
    constructor() {
        super({
            key: 'Rankings'
        });
    }

    preload() {
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('exit', 'assets/exitArrow.png');
        this.load.image('lbHeader', 'assets/leaderboard_assets/leaderboard.png');
        this.load.image('entryBg', 'assets/leaderboard_assets/entryBg.png');
        this.load.image('rankings', 'assets/leaderboard_assets/rankings.png');
        this.load.image('rightArrow', 'assets/leaderboard_assets/rightArrow.png');
        this.load.image('scrollBar1', 'assets/leaderboard_assets/scrollBar1.png');
        this.load.image('scrollBar2', 'assets/leaderboard_assets/scrollBar2.png');
        this.load.image('leaderb', 'assets/leaderboard_assets/leaderboard.png');
    }

    async create() {
        this.bg = this.add.image(0, 0, 'bg');
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        this.header = this.add.image(250, 390, 'rankings').setScale(0.75, 0.75);
        this.title = this.add.image(900, 100, 'leaderb').setScale(0.75, 0.75);
        this.arrow = this.add.image(1100, 100, 'rightArrow').setScale(0.75, 0.75).setInteractive(); 

        // Debugging the pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        //Scroll panel
        var scrollablePanel = this.rexUI.add.scrollablePanel({
            x: 950, y: 490,
            width: 600,
            height: 650,

            scrollMode: 'y',

            background: this.rexUI.add.roundRectangle({
                radius: 10
            }),

            panel: {
                child: await createPanel(this),

                mask: { padding: 70, },
            },

            slider: {
                track: this.add.sprite(0, 0, 'scrollBar1').setOrigin(0),
                thumb: this.add.sprite(0, 0, 'scrollBar2').setOrigin(0.5, 0),
            }, 
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.3
            },
          
            header: this.add.sprite(),

            footer: this.add.sprite(),

            space: { left: 20, right: 20, top: 20, bottom: 20, panel: 10, header: 5, footer: 5 }
        })
            .layout()

        console.log(scrollablePanel.isOverflow);
        this.exit.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('MainMenu');
        }, this)

        this.arrow.on('pointerup', function (pointer) {
            this.scene.start('Achievements');
        }, this)
    }
    
    update() {
        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
    }
}

var GetRankedUsers = async function () {
    const request = ( url, method = 'GET' ) => {      
        return fetch( url ).then( response => response.json() );
    };
    const get = ( url) => request( url, 'GET' );

    return new Promise((resolve, reject) => {
        get('https://mpcards-dbserver.onrender.com/users/fetchUsers/')
        .then(response => {
            console.log(response);
            resolve(response);
        }, error => {
            console.log(error);
            reject(error);
        })
    })
}

var createPanel = async function (scene) {
    // Get all users sorted from CreateContent
    var entries = await GetRankedUsers();
    console.log(entries);
    // Create a container for each entry
    var container = scene.add.container();
    for (var i = 0; i < entries.length; i++) {
        var bg = scene.add.sprite(250, 100 * (i * 1.5) + 30, 'entryBg').setScale(0.75, 0.75);
        var uname = scene.add.text(60, 150 * i, (i + 1) + ". " + (entries[i].uname.length > 8 ? entries[i].uname.substring(0,8) + "..." : entries[i].uname), { color: 'white', fontFamily: 'Woodchuck', fontSize: '48px '});
        uname.setStroke('#000000', 6);
        uname.setShadow(4, 4, '#000000', 0);
        var wins = scene.add.text(350, 150 * i + 15, entries[i].win_count + " wins", { color: 'white', fontFamily: 'Woodchuck', fontSize: '36px '});
        wins.setStroke('#000000', 6);
        wins.setShadow(4, 4, '#000000', 0);
        var cont = scene.add.container(0, 0, [bg, uname, wins]); 
        container.add(cont);
    }
    container.setSize(200, 100 * entries.length * 1.5);
    

    return container;
}