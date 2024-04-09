import FirebasePlugin from '../plugins/FirebasePlugin.js'


export default class Achievements extends Phaser.Scene {
    constructor() {
        super({
            key: 'Achievements'
        });
        this.descriptions = [];
    }

    preload() {
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('exit', 'assets/exitArrow.png');
        this.load.image('hoverTooltip', 'assets/game_assets/hoverTooltip.png');
        this.load.image('lockAch', 'assets/achievements_assets/lockedAchievement.png');
        this.load.image('earnedAch', 'assets/achievements_assets/earnedAchievement.png');
        this.load.image('lockAchIcon', 'assets/achievements_assets/lockedAchIcon.png');
        this.load.image('sampleAch1', 'assets/achievements_assets/sampleAch1.png');
        this.load.image('sampleAch2', 'assets/achievements_assets/sampleAch2.png');
        this.load.image('sampleAch3', 'assets/achievements_assets/sampleAch3.png');
        this.load.image('rankings', 'assets/leaderboard_assets/rankings.png');
        this.load.image('scrollBar1', 'assets/leaderboard_assets/scrollBar1.png');
        this.load.image('scrollBar2', 'assets/leaderboard_assets/scrollBar2.png');
        this.load.image('ach', 'assets/achievements_assets/achievements.png');
    }

    async create() {
        this.bg = this.add.image(0, 0, 'bg');
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        this.header = this.add.image(250, 390, 'rankings').setScale(0.75, 0.75);
        this.title = this.add.image(950, 100, 'ach').setScale(0.75, 0.75);
        this.arrow = this.add.image(750, 100, 'exit').setScale(0.75, 0.75).setInteractive(); 

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        this.cardPopUp = this.add.image(0, 0, 'hoverTooltip').setScale(0.7, 0.7).setOrigin(0.1, 0.95);
        this.cardPopUpText ='';
        this.cardPopUp.alpha = 0;

  
        

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
            this.scene.start('Rankings');
        }, this)


        

        

        
    }
    
    update() {
        // Debugging pixel coords
        
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');

        //this.cardPopUp = this.add.image(0, 0, 'hoverTooltip').setScale(0.7, 0.7).setOrigin(0.1, 0.95);
        this.cardPopUp =  this.add.rectangle( 0, 0, 250, 90, 0xff0000).setOrigin(0, 1).setDepth(100);
        this.cardPopUpText = this.add.text( 0, 0, '', { fontFamily: 'Woodchuck', color: '#0xff0000' }).setDepth(100);
        this.cardPopUp.alpha = 0;
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject.type == 'rexScrollableBlock') {
                console.log(gameObject.children[0].list[0].list[3]._text);
            let compare = new String(gameObject.children[0].list[0].list[3]._text);
            if( compare.substring(0,40) == this.descriptions[0].substring(0,40)){
                console.log(true);
                this.cardPopUpText.setText('Test' ).setOrigin(0, 2.6).setFontSize('18px');
            }
            console.log(this.descriptions[0]);
            this.cardPopUpText.setText('Test' ).setOrigin(0, 2.6).setFontSize('18px');

            }
            console.log(gameObject.type);
 
            this.cardPopUpText.setText('Test' ).setOrigin(0, 2.6).setFontSize('18px');

            console.log(this.descriptions[0]);
            
            this.tweens.add({
                targets: [this.cardPopUp, this.cardPopUpText],
                alpha: {from:0, to:1},
                repeat: 0,
                duration: 5
            });
        },this);

        
    }
}

var getPercentData = async function () {
    const request = ( url,method = 'GET' ) => {

        //url +=  (param).toString();        
        return fetch(url).then( response => response.json() );
    };
    const get = ( url) => request( url, 'GET' );
    return new Promise((resolve, reject) => {
        get('http://localhost:3001/ach/fetchPercentAchieved')
            .then(response => {
                console.log(response)
                resolve(response);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
}

var GetAch = async function (userEmail) {
    const request = ( url, param, method = 'GET' ) => {

        url +=  (param).toString();        
        return fetch(url).then( response => response.json() );
    };
    const get = ( url, param ) => request( url, param, 'GET' );
    return new Promise((resolve, reject) => {
        get('http://localhost:3001/uha/fetchUserAch/', userEmail)
            .then(response => {
                console.log(response)
                resolve(response);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}

var createPanel = async function (scene) {
    let firebaseApp = scene.plugins.get('FirebasePlugin');
    console.log(firebaseApp.getUser())
    const userEmail = firebaseApp.getUser().email;
    var entries = await GetAch(userEmail);
    var allAchievements = await getPercentData();
    
    
    // Get all users sorted from CreateContent
    console.log(entries);
    console.log(allAchievements);
    let aName = allAchievements.map(item =>item.aname);
    let aDesc = allAchievements.map(item =>item.description);
    let aPct = allAchievements.map(item =>item.pct);
    let aid = allAchievements.map(item =>item.id);

    scene.descriptions = [...aDesc];

    
    

    let achievements = entries.map(item => item.aid);
    console.log(achievements);
    // Create a container for each entry

    let titles = [
        "Gator-Aid",
        "Scalebreaker",
        "All In!",
    ]

    let flavorTexts = [
        "Land a finishing blow with the Southern Mascot!",
        "Break 20 attack points with one mascot!",
        "Empty your hand in one round!",
    ]
    
    var container = scene.add.container();
    for (var i = 0; i < 3; i++) {
   

        if (achievements.includes(aid[i])) {
            var bg = scene.add.sprite(250, 100 * (i * 2.5) + 60, 'earnedAch').setScale(0.75, 0.75);
            var Icon = scene.add.sprite(120, 100 * (i * 2.5) + 55, 'sampleAch' + aid[i]).setScale(0.75, 0.75);
        } else {
            var bg = scene.add.sprite(250, 100 * (i * 2.5) + 60, 'lockAch').setScale(0.75, 0.75);
            var Icon = scene.add.sprite(120, 100 * (i * 2.5) + 55, 'lockAchIcon').setScale(0.75, 0.75);
        }
        var title = scene.add.text(180, 100 * (i * 2.5) - 5, aName[i], { color: 'white', 
        fontFamily: 'Woodchuck', fontSize: '36px'})
        title.setStroke('#000000', 6);
        title.setShadow(6, 5, '#000000', 0);
        var flavorText = scene.add.text(180, 100 * (i * 2.5) + 45, aDesc[i].length > 40 ? aDesc[i].substring(0,40) + "..." : aDesc[i], { color: 'white', fontFamily: 'Woodchuck', 
        fontSize: '28px', wordWrap: { width: 270, useAdvancedWrap: true }})
        flavorText.setStroke('#000000', 6);
        flavorText.setShadow(4, 4, '#000000', 0);
        var percentage = scene.add.text(380, 100 * (i * 2.5) - 15, aPct[i] + '%\nEarned', { color: 'white', fontFamily: 'Woodchuck', 
        fontSize: '20px', align: 'right'})
        percentage.setStroke('#000000', 6);
        percentage.setShadow(4, 4, '#000000', 0);
        var cont = scene.add.container(0, 0, [bg, Icon, title, flavorText, percentage]); 
        container.add(cont);
    }
    container.setSize(200, 700); 
    return container;
}