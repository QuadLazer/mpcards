import Zone from '../helpers/zone';
import Card from '../helpers/card';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';
import Resource from '../helpers/resource';
import Effect from '../helpers/effect';
import Deck from '../helpers/deck';

import FirebasePlugin from '../plugins/FirebasePlugin';

import Mascot from '../helpers/mascot';
import { GameObjects } from 'phaser';
import { Time } from 'phaser';



export default class Game extends Phaser.Scene {

    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('p1CardFront', 'assets/p1CardFront.png');
        this.load.image('p1CardBack', 'assets/p1CardBack.png');
        this.load.image('p2CardFront', 'assets/p2CardFront.png');
        this.load.image('p2CardBack', 'assets/p2CardBack.png');
        this.load.image('resourceCardFront', 'assets/resourceCardFront.png');
        this.load.image('re1', 'assets/resourceCardFront1.png');
        this.load.image('re2', 'assets/resourceCardFront2.png');
        this.load.image('re3', 'assets/resourceCardFront3.png');
        this.load.image('quit', 'assets/quit.png');
        this.load.image('bg', 'assets/bgtest.png');

        this.load.image('opponentBack', 'assets/game_assets/opponentBack.png');
        this.load.image('buffHealth', 'assets/game_assets/buffHealth.png');
        this.load.image('buffHit', 'assets/game_assets/buffHit.png');
        this.load.image('debuffHealth', 'assets/game_assets/debuffHealth.png');
        this.load.image('debuffHit', 'assets/game_assets/debuffHit.png');
        this.load.image('razeCard', 'assets/game_assets/razeCard.png');
        this.load.image('resourceCard', 'assets/game_assets/resourceCard.png');
        this.load.image('gatorMascot', 'assets/game_assets/gatorMascot.png');
        this.load.image('seahawkMascot', 'assets/game_assets/seahawkMascot.png');
        this.load.image('spartanMascot', 'assets/game_assets/spartanMascot.png');
        this.load.image('wolfMascot', 'assets/game_assets/wolfMascot.png');
        this.load.image('drawBack', 'assets/game_assets/drawBack.png');
        this.load.image('hoverTooltip', 'assets/game_assets/hoverTooltip.png');

        this.load.image('attackIcon', 'assets/game_assets/attackIcon.png');
        this.load.image('emptyHealthBar', 'assets/game_assets/emptyHealthBar.png');
        this.load.image('endTurnIcon', 'assets/game_assets/endTurnIcon.png');
        this.load.image('fullHealthBar', 'assets/game_assets/fullHealthBar.png');
        this.load.image('halfHealthBar', 'assets/game_assets/halfHealthBar.png');
        this.load.image('miniAttack', 'assets/game_assets/miniAttack.png');
        this.load.image('miniHealth', 'assets/game_assets/miniHealth.png');
        this.load.image('quitIcon', 'assets/menu_assets/logOut.png');

        this.load.plugin('FirebasePlugin', FirebasePlugin, true);

        this.load.image('mascotCardFront', 'assets/gator_logo.png');
        //NE
        this.load.image('seahawksCardFront', 'assets/seahawks_logo.png');
        //W
        this.load.image('wolvesCardFront', 'assets/wolves_logo.png');
        //MW
        this.load.image('spartansCardFront', 'assets/spartans_logo.png');


    }

    create() {
        var firebaseApp = this.plugins.get('FirebasePlugin');
        this.bg = this.add.image(0, 0, 'bg');
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        this.opponentCards = [];
        this.mascotCardPlace = false;
        this.currentTurn = false;
        this.hasDrawn = false;
        let initTurn = true;
        let attackCount = 1;
        let attackCap = attackCount;

        //mascot destroyed counts
        let yourDestroyedMascots = 0;
        let enemyDestroyedMascots = 0;

        //achievement flags
        let gatorAidFlag = false;
        let scalebreakerFlag = false;
        let allinFlag = false;

        //static items
        this.deck = new Deck(this, 1050, 390,'drawBack');
   

        this.attackIcon = this.add.image(1196, 580, 'attackIcon').setInteractive();
        this.endTurnIcon = this.add.image(1200, 710, 'endTurnIcon').setInteractive();
        this.atkText = this.add.text(970, 550, 'Attack!', { fontSize:'48px', fontFamily: 'Woodchuck'});
        this.atkText.setStroke('#000000', 6);
        this.atkText.setShadow(4, 4, '#000000', 0);
        this.endText = this.add.text(970, 680, 'End Turn', { fontSize:'48px', fontFamily: 'Woodchuck'});
        this.endText.setStroke('#000000', 6);
        this.endText.setShadow(4, 4, '#000000', 0);

        this.yourhealthBar = this.add.image(200, 680, 'fullHealthBar');
        this.yourUsername = this.add.text(50, 720, 'Loading...',  { fontSize:'36px', fontFamily: 'Woodchuck'});
        this.yourUsername.setStroke('#000000', 6);
        this.yourUsername.setShadow(4, 4, '#000000', 0);
        this.enemyhealthBar = this.add.image(1120, 100, 'fullHealthBar').setScale(0.75, 0.75);
        this.enemyUsername = this.add.text(1100, 15, 'Loading...',  { fontSize:'36px', fontFamily: 'Woodchuck'});
        this.enemyUsername.setStroke('#000000', 6);
        this.enemyUsername.setShadow(4, 4, '#000000', 0);

        this.quitIcon = this.add.image(60, 60, 'quitIcon').setScale(0.75, 0.75).setInteractive();

        this.enemyRec = this.add.graphics();
        this.enemyRec.lineStyle(4, 0xffffff, 1);
        this.enemyRec.strokeRect(599, 160, 150, 200);

        this.enemyMiniHealth = this.add.image(785, 250, 'miniHealth').setScale(0.75, 0.75);
        this.enemyMiniHit = this.add.image(785, 300, 'miniAttack').setScale(0.75, 0.75);
        this.yourMiniHealth = this.add.image(785, 450, 'miniHealth').setScale(0.75, 0.75);
        this.yourMiniHit = this.add.image(785, 500, 'miniAttack').setScale(0.75, 0.75);

        this.textEnemyHealth = this.add.text(815, 230, '0', { fontSize:'28px', fontFamily: 'Woodchuck'});
        this.textEnemyHealth.setStroke('#000000', 6);
        this.textEnemyHealth.setShadow(4, 4, '#000000', 0);
        this.textEnemyHit = this.add.text(815, 280, '0', { fontSize:'28px', fontFamily: 'Woodchuck'});
        this.textEnemyHit.setStroke('#000000', 6);
        this.textEnemyHit.setShadow(4, 4, '#000000', 0);
        this.textYourHealth = this.add.text(815, 430, '0', { fontSize:'28px', fontFamily: 'Woodchuck'});
        this.textYourHealth.setStroke('#000000', 6);
        this.textYourHealth.setShadow(4, 4, '#000000', 0);
        this.textYourHit = this.add.text(815, 480, '0', { fontSize:'28px', fontFamily: 'Woodchuck'});
        this.textYourHit.setStroke('#000000', 6);
        this.textYourHit.setShadow(4, 4, '#000000', 0);
        
        this.textSuperEffective = this.add.text(405, 450, 'Super Effective!',  {fill:'#00f35b', fontSize:'24px', fontFamily: 'Woodchuck'}).setVisible(0);
        this.textSuperEffective.setStroke('#000000', 6);
        this.textSuperEffective.setShadow(4, 4, '#000000', 0);
        this.textNotEffective = this.add.text(405, 450, 'Not Effective...',  {fill:'#ff5733', fontSize:'24px', fontFamily: 'Woodchuck'}).setVisible(0);
        this.textNotEffective.setStroke('#000000', 6);
        this.textNotEffective.setShadow(4, 4, '#000000', 0);
        this.textAttacked = this.add.text(405, 450, 'Attacked!',  {fill:'#fe8c20', fontSize:'24px', fontFamily: 'Woodchuck'}).setVisible(0);
        this.textAttacked.setStroke('#000000', 6);
        this.textAttacked.setShadow(4, 4, '#000000', 0);


        //win and lose text 
        this.losePopUpText = this.add.text(670, 370, 'YOU LOSE', {fill:'#ff5733', fontSize:'100px', fontFamily: 'Woodchuck'}).setOrigin(0.5).setVisible(false);
        this.winPopUpText = this.add.text(671, 371, 'YOU WIN', {fill:'#ff5733', fontSize:'100px', fontFamily: 'Woodchuck'}).setOrigin(0.5).setVisible(false);

        //zone variables
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.handZone = this.zone.renderHandZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.resDropZone = this.zone.renderResourceZone();
        this.resOutline = this.zone.renderResOutline(this.resDropZone);
   
        this.turnIndicator = this.add.text(90, 200, 'this is text!', { fontSize: '48px', fontFamily: 'Woodchuck'});
        this.turnIndicator.setStroke('#000000', 6);
        this.turnIndicator.setShadow(4, 4, '#000000', 0);
        this.pointer = this.input.activePointer;

        //update the database with achievements when necessary
        function dbcalls(gatorAidFlag,scalebreakerFlag,allinFlag) {
            if(gatorAidFlag | scalebreakerFlag | allinFlag ) {
                let userAchData; 
                let optionsAchieve; 
                

                if(gatorAidFlag) {
                    userAchData = JSON.stringify({
                        email: firebaseApp.getUser().email,
                        achievementName: 1
                    });

                    optionsAchieve =  {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: userAchData,
                    }

                    fetch("http://localhost:3001/uha/addUserAch",optionsAchieve).then(response =>{
                    console.log(JSON.stringify(response));
                });
                }

                if(scalebreakerFlag) {
                    userAchData = JSON.stringify({
                        email: firebaseApp.getUser().email,
                        achievementName: 2
                    });

                    optionsAchieve =  {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: userAchData,
                    }

                    fetch("http://localhost:3001/uha/addUserAch",optionsAchieve).then(response =>{
                    console.log(JSON.stringify(response));
                });
                }

                if(allinFlag) {
                    userAchData = JSON.stringify({
                        email: firebaseApp.getUser().email,
                        achievementName: 3
                    });

                    optionsAchieve =  {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: userAchData,
                    }

                    fetch("http://localhost:3001/uha/addUserAch",optionsAchieve).then(response =>{
                    console.log(JSON.stringify(response));
                });
                }

                
            }
        }

        
        this.quitIcon.on('pointerdown', () => {
            this.quitIcon.setTint(0x878787);
        });

        this.quitIcon.on('pointerup', () => {
            this.quitIcon.setTint();
            this.socket.disconnect();
            this.scene.start('MainMenu');
        });

        //For interacting with the deck
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if(gameObject instanceof Deck && this.currentTurn && this.handZone.data.values.cards < 5 && this.hasDrawn === false) {
                this.dealer.draw(self);
                this.handZone.data.values.cards++;
                this.hasDrawn = true;
                this.socket.emit('draw',this.isPlayerA);
                
            }
        })

        //Button toggles control between players active turn
        this.endTurnIcon.on('pointerdown', () => {
            this.endTurnIcon.setTint(0x878787);
            if(this.currentTurn) {
                this.switchTurn();
                this.socket.emit('switchTurn',this.currentTurn, this.isPlayerA);
                self.resDropZone.data.values.pointSum = self.resDropZone.data.values.maxCapacity;
                attackCount = attackCap;
                this.hasDrawn = false;
            }
        });

        this.endTurnIcon.on('pointerup', () => {
            this.endTurnIcon.setTint();
        })
      
        //hover mascot variables
        this.cardPopUp = this.add.image(0, 0, 'hoverTooltip').setScale(0.7, 0.7).setOrigin(0.1, 0.95);
        this.cardPopUpText = this.add.text( 0, 0, '', { fontFamily: 'Woodchuck', color: '#0xff0000' }).setDepth(100);
        this.cardPopUp.alpha = 0;


        //mascot display 
        let mascotHealth = 0;

        //this.mascotHealthText = this.add.text(400, 445, 'Mascot Health: ' + mascotHealth , {color: '#46ff8c', fontFamily: 'Woodchuck'});
        let enemyMascot;
        let yourMascot;
        let droppedCard;
        let yourDroppedCard;
        let enemyRegion;
        
        //resource variables
        let resourceTotal = 0;
        this.resourceTotalText = this.add.text(50, 330, 'Resource Pool: ' + resourceTotal, {fontSize: '28px', fontFamily: 'Woodchuck' });
        this.resourceTotalText.setStroke('#000000', 6);
        this.resourceTotalText.setShadow(4, 4, '#000000', 0);

        this.dealer = new Dealer(this);


        let self = this;

        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });
        self.isPlayerA = false;
        self.dealt = false;

        //Action to set first connected player to playerA
        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        self.socket.emit('dealCards');
        //Deal hand to user
        this.socket.on('dealCards', function () {
            if(!self.dealt) {
                self.dealer.dealCards();
                self.dealt = true;
            }
        });
        
        //function to retrieve username and display in game 
        this.socket.on('usersPlaying', function (email) {
            if (email != firebaseApp.getUser().email) {
                const userEmail = email;

                const request = ( url, param, method = 'GET' ) => {

                url +=  ( param).toString();        
                return fetch( url ).then( response => response.json() );
                };
                const get = ( url, param ) => request( url, param, 'GET' );

                get('http://localhost:3001/users/findUser/', userEmail)
                .then(response => {
                    self.enemyUsername.setText(response.uname.length > 8 ? response.uname.substring(0,8) + "..." : response.uname);
                })
            }
        });


        //Change control from one user to another. Happens after end turn button is pressed
        this.socket.on('switchTurn', function(turn, isPlayerA) {
            if(isPlayerA !== self.isPlayerA) {
                self.currentTurn = !self.currentTurn;
            }

        });

        //Display enemy cards when they draw to their hand
        this.socket.on('draw', function(isPlayerA) {
            if(isPlayerA != self.isPlayerA) {
                let cardBack;
                cardBack = 'opponentBack';
                let opponentCard = new Card(self, 875 - (self.opponentCards.length * 100), 50, cardBack);
                self.opponentCards.unshift((opponentCard).disableInteractive());
      
            }
        });
        //Responsible for updating the enemy mascot health and hit text
        this.socket.on('updateEnemy', function(isPlayerA, health, hit) {
            if(isPlayerA !== self.isPlayerA) {
                self.textEnemyHealth.setText(health);
                self.textEnemyHit.setText(hit);
            }
        })

        //setPollOnMove - means that the interaction won't happen unless the user moves the mouse pointer themselves
        this.input.setPollOnMove();

            setTimeout(() => {
                const request = ( url, param, method = 'GET' ) => {

                    url +=  ( param).toString();        
                    return fetch( url ).then( response => response.json() );
                    };
                    const get = ( url, param ) => request( url, param, 'GET' );
        
                    get('http://localhost:3001/users/findUser/', firebaseApp.getUser().email)
                    .then(response => {
                        self.yourUsername.setText(response.uname.length > 8 ? response.uname.substring(0,8) + "..." : response.uname);
                    })
                self.socket.emit('usersPlaying', firebaseApp.getUser().email);
            }, 1000);

        //this animates the pop up
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject instanceof GameObjects.Sprite){
                if(gameObject instanceof Mascot){
                    //this.cardPopUpText = this.add.text( 0, 0, 'HP: ' + gameObject.getHealthPoints(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    let display = 'HP: ' + gameObject.getHealthPoints() + '\n';
                    display += 'Attack power: ' + gameObject.getAttackPoints() + '\n';
                    display += 'Region: ' + gameObject.getRegion();
                    this.cardPopUpText.setText(display).setOrigin(0, 1.9).setFontSize('18px');
                }
                else if(gameObject instanceof Resource){
                    //this.cardPopUpText = this.add.text( 0, 0, 'Value: ' + gameObject.getResVal(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('This is a Resource Card' + '\n' + 'Value: ' + gameObject.getResVal()).setOrigin(0, 2.6).setFontSize('18px');
                }
                else if (gameObject instanceof Effect) {
                    let display = '';
                    if (gameObject.type == 'Buff') {
                        let hpText = 'Health +' + gameObject.getHealthVal() + '\n';
                        let hitText = 'Hit +' + gameObject.getHitVal() + '\n';
                        display = 'This is a buff type card\n';
                        if (gameObject.getHealthVal() == 0) {
                            display = display + hitText;
                        }
                        else {
                            display = display + hpText;
                        }
                        
                    } else if (gameObject.type == 'Debuff') {
                        let hpText = 'Enemy Health -' + gameObject.getHealthVal() + '\n';
                        let hitText = 'Enemy Hit -' + gameObject.getHitVal() + '\n';
                        display = 'This is a debuff type card\n';
                        if (gameObject.getHealthVal() == 0) {
                            display = display + hitText;
                        }
                        else {
                            display = display + hpText;
                        }
                    } else if (gameObject.type == 'Raze') {
                        let destroyText = 'Enemy Resources -' + gameObject.getVal() + '\n'
                        display = 'This is a raze type card\n';
                        display += destroyText;
                    }
                    let aFee = "Activate with: " + gameObject.cost + " resources";
                    display = display + '\n' + aFee;

                    this.cardPopUpText.setText(display).setOrigin(0, 1.8).setFontSize('14px');
                }
                else if(gameObject instanceof Deck){
                    //this.cardPopUpText = this.add.text( 0, 0, 'This is a card.', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('This is your draw deck!').setOrigin(0, 4.8).setFontSize('18px');
                }
                this.tweens.add({
                    targets: [this.cardPopUp, this.cardPopUpText],
                    alpha: {from:0, to:1},
                    repeat: 0,
                    duration: 5
                }); 
            }
                
        }, this);

        //when taking the mouse off the game object, the pop up will disappear
        this.input.on('gameobjectout', function (pointer, gameObject) {
            if(gameObject instanceof GameObjects.Sprite) {
                self.cardPopUp.alpha = 0;
                self.cardPopUpText.alpha = 0;
            }
            //self.cardPopUpText.destroy();
        });

        //this moves the pop up while over an object
        this.input.on('pointermove', function (pointer, gameObject) {
            self.cardPopUp.x = pointer.x;
            self.cardPopUp.y = pointer.y;
            self.cardPopUpText.x = pointer.x + 5;
            self.cardPopUpText.y = pointer.y + 5;
            self.cardPopUp.setDepth(1); 
        });
    

        this.socket.on('cardDropped', (gameObject, isPlayerA) => {
            let mascotDropped = Boolean(false);
            
            //for player B
            if (isPlayerA !== self.isPlayerA) {

                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                self.dropZone.data.values.playerB_mascots++;


                //if card is a mascot 
                if(gameObject instanceof Mascot){
                    let card = new Mascot('gator', 4000, 'S',self);
                    mascotDropped = Boolean(true);
                    self.dropZone.data.values.playerB_mascots++;
                    self.hpText = self.add.text(((self.dropZone.x - 250) + (self.dropZone.data.values.cards * 150)), (self.dropZone.y - 100), card.getHealthPoints(), {fill:'#ff5733'});
                } 
                
                //this is Player B rendering the Mascot Card that Player A dropped
                self.droppedCard = new Mascot(self, (self.dropZone.x), (self.dropZone.y - 210), sprite).disableInteractive();
            }
 
        })

        this.socket.on('resDropped', function (isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                self.opponentCards.shift().destroy();

            }

        })

        //for resource drop zone
        this.input.on('drop', function (pointer, gameObject, resDropZone) {
            if (!gameObject.inresDropZone && resDropZone.name == 'resourceArea' && gameObject instanceof Resource
                && gameObject.insResDropZone != true && self.currentTurn) {
                let xval = gameObject.input.dragStartX
                gameObject.x = (resDropZone.x);
                gameObject.insResDropZone = true;
                let arr = self.handZone.data.values.xpos;
                arr = arr.filter(item => item !== xval)
                console.log(arr);
                self.handZone.setData({xpos:arr})
                self.socket.emit('resDropped',self.isPlayerA);

                if(gameObject instanceof Resource){
                    resDropZone.data.values.pointSum += gameObject.getResVal();
                    resDropZone.data.values.maxCapacity += gameObject.getResVal();

                    //Removing a card from handZone for draw card logic.
                    self.handZone.data.values.cards--;
                    if (self.handZone.data.values.cards == 0) {
                        console.log("You earned the 'All In!' achievement!");
                        allinFlag = true;
                    }
                    
                }
                else{
                    console.log('Game object is not being recognized as a Resource object')
                }
                
                resDropZone.data.values.resources++;
                
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        } )

        
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        //for mascot drop zone
        
        this.input.on('drop', function (pointer,gameObject, dropZone) {
            if (!gameObject.inDropZone && dropZone.data.values.playerA_mascots == 0 && dropZone.name == 'mascotArea' && gameObject instanceof Mascot
            && self.currentTurn) {

                gameObject.x = (dropZone.x);
                gameObject.inDropZone = true;
                dropZone.data.values.cards++;
                dropZone.data.values.playerA_mascots++;
                let xval = gameObject.input.dragStartX
                let arr = self.handZone.data.values.xpos;
                arr = arr.filter(item => item !== xval)
                self.handZone.setData({xpos:arr})
                //Removing a card from handZone for draw card logic.
                self.handZone.data.values.cards--;
                yourMascot = gameObject.getHealthPoints();
                
                gameObject.y = dropZone.y;
                self.textYourHealth.setText(gameObject.getHealthPoints());
                self.textYourHit.setText(gameObject.getAttackPoints());
                self.socket.emit('updateEnemy', self.isPlayerA, gameObject.getHealthPoints(), gameObject.getAttackPoints());
                self.socket.emit('cardDropped', gameObject, self.isPlayerA);
                self.socket.emit('mascotDropped', gameObject.getHealthPoints(), gameObject.getRegion(), self.isPlayerA);

                yourDroppedCard = gameObject;
                //All in achievement triggering event
                if (self.handZone.data.values.cards == 0) {
                    allinFlag = true;
                }
            }
           
        
        })
        

        this.socket.on('mascotDropped', function(hp, region, isPlayerA){

            //player b now knows their opponent's mascot health and region
            if(isPlayerA !== self.isPlayerA){
                self.enemyMascot = hp;
                self.enemyRegion = region;
            }
            
        })
    

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            dropZone.setAlpha(0.5);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        })

        this.socket.on('mascotDestroyed', function(isPlayerA){
            if(isPlayerA !== self.isPlayerA){
                self.dropZone.data.values.cards--;
                self.dropZone.data.values.playerA_mascots = 0;
                yourDroppedCard.destroy();
                yourMascot = 0;
                self.textYourHealth.setText(0);
                self.textYourHit.setText(0);
                self.socket.emit('updateEnemy', self.isPlayerA, 0, 0);

                yourDestroyedMascots++;
                self.yourhealthBar.setTexture('halfHealthBar');

                //End game condition
                if(yourDestroyedMascots == 2){
                    
                    self.yourhealthBar.setTexture('emptyHealthBar');
                    self.losePopUpText.setVisible(true).setDepth(100);
                    
                    //Update Achievements
                    dbcalls(gatorAidFlag,scalebreakerFlag,allinFlag);
                    
                }
            }
            else{
                self.droppedCard.destroy();
                self.dropZone.data.values.playerB_mascots--;
                self.enemyMascot = 0;
                self.textEnemyHealth.setText(0);
                self.textEnemyHit.setText(0);
                
                enemyDestroyedMascots++;
                self.enemyhealthBar.setTexture('halfHealthBar');

                if(enemyDestroyedMascots == 2){ // Player won the game
                    //gator aid achievement triggering condition
                    if (yourDroppedCard.region == 'S') {
                        gatorAidFlag = true;
                    }
                    self.enemyhealthBar.setTexture('emptyHealthBar');
                    self.winPopUpText.setVisible(true).setDepth(100);

                    //Update win count for victor
                    const userData = JSON.stringify({
                        username: firebaseApp.getUser().email
                    });
                    const options = {
                        method: 'PUT',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: userData,
                    }
                    fetch("http://localhost:3001/users/updateWinCount",options).then(response =>{
                        console.log(JSON.stringify(response));
                    });
                    
                    //Update Achievements
                    dbcalls(gatorAidFlag,scalebreakerFlag,allinFlag)

                }
            }
                
        })

        this.socket.on('debuffed', function(modifier, type, isPlayerA)  {
            if(isPlayerA !== self.isPlayerA) {
                self.opponentCards.shift().destroy();
                if (type == 'health') {
                    yourDroppedCard.decreaseHP(modifier);
                    self.textYourHealth.setText(yourDroppedCard.getHealthPoints());
                }
                else {
                    yourDroppedCard.decreaseAttack(modifier);
                    self.textYourHit.setText(yourDroppedCard.getAttackPoints());
                }
                self.socket.emit('updateEnemy', self.isPlayerA, yourDroppedCard.getHealthPoints(), yourDroppedCard.getAttackPoints());

            }
        })

        this.socket.on('buffed', function(isPlayerA) {
            if(isPlayerA !== self.isPlayerA) {
                self.opponentCards.shift().destroy();
            }
        })

        this.socket.on('razed', function(modifier, isPlayerA) {
            //if(isPlayerA !== self.isPlayerA && self.isPlayerA != undefined) {
            if(self.currentTurn != true) {
                self.opponentCards.shift().destroy();
                if (self.resDropZone.data.values.pointSum > self.resDropZone.data.values.maxCapacity - modifier) {
                    self.resDropZone.data.values.pointSum = self.resDropZone.data.values.maxCapacity - modifier;
                }
                self.resDropZone.data.values.maxCapacity -= modifier;
                self.resDropZone.data.values.pointSum = self.resDropZone.data.values.pointSum < 0 ? 0 : self.resDropZone.data.values.pointSum;
                self.resDropZone.data.values.maxCapacity = self.resDropZone.data.values.maxCapacity < 0 ? 0 : self.resDropZone.data.values.maxCapacity;
            }
        })

        this.socket.on('effectiveTextPopUp', function(isPlayerA, effective){
            if(effective == 0){
                if(isPlayerA !== self.isPlayerA){
                    self.textSuperEffective.setVisible(1);
                    setTimeout(function(){
                        self.textSuperEffective.setVisible(0);
                    }, 5000);
                }
            }
            else if(effective == 1){
                if(isPlayerA !== self.isPlayerA){
                    self.textNotEffective.setVisible(1);
                    setTimeout(function(){
                        self.textNotEffective.setVisible(0);
                    }, 5000);
                }
            }
        });

        this.socket.on('mascotAttacked', function (attackPoints, isPlayerA) {

            if(isPlayerA !== self.isPlayerA){
                let newAtttackPoints = self.calculatePower(self.enemyRegion,yourDroppedCard.getRegion(),  attackPoints);
                yourDroppedCard.decreaseHP(newAtttackPoints);
                self.textYourHealth.setText(yourDroppedCard.getHealthPoints());
                if(yourDroppedCard.getHealthPoints() == 0) {
                    self.socket.emit('mascotDestroyed',isPlayerA);              
                }
                self.socket.emit('updateEnemy', self.isPlayerA, yourDroppedCard.getHealthPoints(), yourDroppedCard.getAttackPoints());

                let result = self.calculateResult(self.enemyRegion, yourDroppedCard.getRegion());
                self.socket.emit('effectiveTextPopUp', self.isPlayerA, result);
                setTimeout(function(){
                    self.textSuperEffective.setVisible(0);
                }, 3000);
                setTimeout(function(){
                    self.textNotEffective.setVisible(0);
                }, 3000);
                setTimeout(function(){
                    self.textAttacked.setVisible(0);
                }, 3000);
            }
            
        })
            

        let lastTime = 0;
        this.input.on('gameobjectdown', (pointer,gameObject)=>{
            
            let clickDelay = this.time.now - lastTime;
            lastTime = this.time.now;
            //double-click event
            if(clickDelay < 350) {
                let xval = gameObject.x
                let arr = self.handZone.data.values.xpos;
                if (gameObject instanceof Effect && this.resDropZone.data.values.pointSum >= gameObject.cost
                    && this.currentTurn) {
  
                    if (gameObject.type == 'Buff' && this.dropZone.data.values.playerA_mascots > 0) {
                        this.resDropZone.data.values.pointSum -= gameObject.cost;
                        self.socket.emit('buffed', self.isPlayerA);
                        if (gameObject.getHealthVal() > 0) {
                            yourDroppedCard.increaseHP(gameObject.getHealthVal());
                            self.textYourHealth.setText(yourDroppedCard.getHealthPoints());
                            self.socket.emit('updateEnemy', self.isPlayerA, yourDroppedCard.getHealthPoints(), yourDroppedCard.getAttackPoints());
                        }
                        else {
                            yourDroppedCard.increaseAttack(gameObject.getHitVal());
                            self.textYourHit.setText(yourDroppedCard.getAttackPoints());

                            //Scalebreaker achievement triggering event
                            if (yourDroppedCard.getAttackPoints() >= 20) {
                                scalebreakerFlag = true;
                            }
                            self.socket.emit('updateEnemy', self.isPlayerA, yourDroppedCard.getHealthPoints(), yourDroppedCard.getAttackPoints());
                        }
                        //Removing a card from handZone for draw card logic.
                        self.handZone.data.values.cards--;
                        arr = arr.filter(item => item !== xval)
                        self.handZone.setData({xpos:arr})
                        gameObject.destroy();
                        
                        
                        self.cardPopUp.alpha = 0;
                        self.cardPopUpText.alpha = 0;
                        
                    } else if (gameObject.type == 'Debuff') {
                        
                        if(this.dropZone.data.values.playerB_mascots > 0) {
                            this.resDropZone.data.values.pointSum -= gameObject.cost;
                            if (gameObject.getHealthVal() > 0) {                               
                                self.socket.emit('debuffed', gameObject.getHealthVal(), 'health', self.isPlayerA);
                            }
                            else {
                                self.socket.emit('debuffed', gameObject.getHitVal(), 'hit', self.isPlayerA )
                            }
                            arr = arr.filter(item => item !== xval)
                            self.handZone.setData({xpos:arr})
                            gameObject.destroy();
                            //Removing a card from handZone for draw card logic.
                            self.handZone.data.values.cards--;
                            self.cardPopUp.alpha = 0;
                            self.cardPopUpText.alpha = 0;
                        }
                    } else if (gameObject.type == 'Raze') {
                        this.resDropZone.data.values.pointSum -= gameObject.cost;
                        arr = arr.filter(item => item !== xval)
                        self.handZone.setData({xpos:arr})
                        gameObject.destroy();
                        //Removing a card from handZone for draw card logic.
                        self.handZone.data.values.cards--;
                        self.socket.emit('razed',gameObject.getVal(), self.isPlayerA);
                        self.cardPopUp.alpha = 0;
                        self.cardPopUpText.alpha = 0;
                    }
                }
                //All in achievement triggering event
                if (self.handZone.data.values.cards == 0) {
                    allinFlag = true;
                }
            }
        });

        
        this.attackIcon.on('pointerdown', () => {
            this.attackIcon.setTint(0x878787);
            
            if(this.currentTurn && yourDroppedCard != undefined && self.enemyRegion != undefined && attackCount > 0){
                if (yourDroppedCard.getHealthPoints() == 0) {
                    yourDroppedCard = undefined;
                    return;
                }
                let attack = yourDroppedCard.getAttackPoints();
                self.socket.emit('mascotAttacked', attack, self.isPlayerA);
                attackCount -= 1;
            } 
        });

        this.attackIcon.on('pointerup', () => {
            this.attackIcon.setTint();
        })

        this.resDropZone.data.values.maxCapacity = this.resDropZone.data.values.pointSum;
      
        
        
        this.events.on('update', () => {
        if (yourDroppedCard !== undefined) {
            //this.updateMascotHealthText(yourDroppedCard.getHealthPoints());
         }
         this.updateResourceTotalText(this.resDropZone.data.values.pointSum);
         console.log(this.isPlayerA, initTurn)
         if(this.isPlayerA && initTurn) {
            this.currentTurn = true;
            initTurn = false;
         }
         else if(!this.isPlayerA && !initTurn) {
            this.currentTurn = false;
            initTurn = true;
         }
    
        });
        
        
    }
    
    
    update() {
      
        if (this.currentTurn == true) {
            this.turnIndicator.setText('Your turn!');
        } else {
            this.turnIndicator.setText('Opponent\'s turn!');
        }
    }

    checkInitTurn() {
        this.currentTurn = this.isPlayerA;
    }

    switchTurn() {
        this.currentTurn = !this.currentTurn;
    }

    
        
    


    updateClickCountText(clickCount) {
        this.clickCountText.setText(`Attacked ${clickCount} times.`);
    }

    updateMascotHealthText(mascotHealth) {
        this.mascotHealthText.setText(`Mascot Health: ${mascotHealth}`);
    }

    updateResourceTotalText(resourceTotal) {
        this.resourceTotalText.setText(`Resource pool: ${resourceTotal}`);
    }

    updateCardPopUpText(gameObject) {
        //different text for each type of card
        if(gameObject instanceof Card){
            //mascot card
            if(gameObject instanceof Mascot){
                this.cardPopUpText.setText('gameObject.getHealthPoints()');
            }

        }
    }


    calculatePower(yourRegion, enemyRegion, yourPower){
        //NE beats S, S beats MW, MW beats W, W beats NE
        let south = "S";
        let northEast = "NE";
        let midWest = "MW";
        let west = "W";

        if(yourRegion == south){
            //beats MW
            if(enemyRegion == midWest){
                this.textSuperEffective.setVisible(1);
                return (yourPower * 2);
            }
            //loses to NE
            else if(enemyRegion == northEast){
                this.textNotEffective.setVisible(1);
                return (yourPower / 2)
            }
            else{
                this.textAttacked.setVisible(1);
                return yourPower;
                
            }
        }
        else if(yourRegion == northEast){
            //beats S
            if(enemyRegion == south){
                this.textSuperEffective.setVisible(1);
                return (yourPower * 2);
            }
            //loses to W
            else if(enemyRegion == west){
                this.textNotEffective.setVisible(1);
                return (yourPower / 2)
            }
            else{
                this.textAttacked.setVisible(1);
                return yourPower;
            }
        }
        else if(yourRegion == midWest){
            //beats W
            if(enemyRegion == west){
                this.textSuperEffective.setVisible(1);
                return (yourPower * 2);
            }
            //loses to S
            else if(enemyRegion == south){
                this.textNotEffective.setVisible(1);
                return (yourPower / 2)
            }
            else{
                this.textAttacked.setVisible(1);
                return yourPower;
            }
        }
        else if(yourRegion == west){
            //beats NE
            if(enemyRegion == northEast){
                this.textSuperEffective.setVisible(1);
                return (yourPower * 2);
            }
            //loses to MW
            else if(enemyRegion == midWest){
                this.textNotEffective.setVisible(1);
                return (yourPower / 2)
            }
            else{
                this.textAttacked.setVisible(1);
                return yourPower;
            }
        }
    }

    calculateResult(yourRegion, enemyRegion){
        //NE beats S, S beats MW, MW beats W, W beats NE
        let south = "S";
        let northEast = "NE";
        let midWest = "MW";
        let west = "W";

        if(yourRegion == south){
            //beats MW
            if(enemyRegion == midWest){
                return 0;
            }
            //loses to NE
            else if(enemyRegion == northEast){
                return 1;
            }
            else{
                return 2;
            }
        }
        else if(yourRegion == northEast){
            //beats S
            if(enemyRegion == south){
                return 0;
            }
            //loses to W
            else if(enemyRegion == west){
                return 1;
            }
            else{
                return 2;
            }
        }
        else if(yourRegion == midWest){
            //beats W
            if(enemyRegion == west){
                return 0;
            }
            //loses to S
            else if(enemyRegion == south){
                return 1;
            }
            else{
                return 2;
            }
        }
        else if(yourRegion == west){
            //beats NE
            if(enemyRegion == northEast){
                return 0;
            }
            //loses to MW
            else if(enemyRegion == midWest){
                return 1;
            }
            else{
                return 2;
            }
        }
    }
}