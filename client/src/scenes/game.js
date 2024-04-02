import Zone from '../helpers/zone';
import Card from '../helpers/card';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';
import Resource from '../helpers/resource';
import Effect from '../helpers/effect';
import Deck from '../helpers/deck';

import FirebasePlugin from '../plugins/FirebasePlugin';

import Controller from '../helpers/controller';
import Mascot from '../helpers/mascot';
import { GameObjects } from 'phaser';



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

        this.load.plugin('FirebasePlugin', FirebasePlugin, true);

        this.load.image('testEndButton', 'assets/TestEnd.png');
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
        //this.isPlayerA;
        this.opponentCards = [];
        this.mascotCardPlace = false;
        this.currentTurn = false;
        let initTurn = true;
        let attackCount = 1;
        let attackCap = attackCount;

        //mascot destroyed counts
        let yourDestroyedMascots = 0;
        let enemyDestroyedMascots = 0;


        this.deck = new Deck(this,250,250,'drawBack');
        console.log(this.deck.cards);

        

        //win and lose text 
        this.losePopUpText = this.add.text(670, 370, 'YOU LOSE', {fill:'#ff5733', fontSize:'100px', fontFamily: 'Woodchuck'}).setOrigin(0.5).setVisible(false);
        this.winPopUpText = this.add.text(671, 371, 'YOU WIN', {fill:'#ff5733', fontSize:'100px', fontFamily: 'Woodchuck'}).setOrigin(0.5).setVisible(false);

        //zone variables
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.handZone = this.zone.renderHandZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.resDropZone = this.zone.renderResourceZone();
        console.log(this.resDropZone);
        this.resOutline = this.zone.renderResOutline(this.resDropZone);

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.turnIndicator = this.add.text(30, 100, 'this is text!', { fontFamily: 'Woodchuck'});
        this.pointer = this.input.activePointer;


        //button variables
        let btnQuit = this.add.text(1130,200, 'QUIT', { fill: '#CCAAFF', fontFamily: 'Woodchuck'});
        btnQuit.setInteractive();
        
        btnQuit.on('pointerdown', () => {
            this.socket.disconnect();
            this.scene.start('MainMenu');
        });

        

        //For interacting with the deck
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            console.log(this.handZone.data.values.xpos);
            if(gameObject instanceof Deck && this.currentTurn && this.handZone.data.values.cards < 5) {
                this.dealer.draw(self);
                this.handZone.data.values.cards++;
                this.socket.emit('draw',this.isPlayerA);
                
            }
        })
        
        //End turn button, switch play capability
        let btnEnd = this.add.text(1130,400, 'END TURN', { fill: '#BAFA11', fontFamily: 'Woodchuck'});
        btnEnd.setInteractive();
        btnEnd.on('pointerdown', () => {
            if(this.currentTurn) {
                this.switchTurn();
                this.socket.emit('switchTurn',this.currentTurn, this.isPlayerA);
                self.resDropZone.data.values.pointSum = self.resDropZone.data.values.maxCapacity;
                attackCount = attackCap;
            }
        });
      
        //hover mascot variables
        this.cardPopUp =  this.add.rectangle( 0, 0, 250, 90, 0xff0000).setOrigin(0).setDepth(100);
        this.cardPopUpText = this.add.text( 0, 0, '', { fontFamily: 'Woodchuck', color: '#0xff0000' }).setOrigin(0).setDepth(100);
        this.cardPopUp.alpha = 0;

        //attack button
        let clickCount = 0;
        this.clickCountText = this.add.text(44, 650, '');
        this.attackButton = this.add.text(100, 600, 'Attack', {fill:'#ff5733', fontFamily: 'Woodchuck'}).setInteractive();
        this.updateClickCountText(clickCount);

        //mascot display 
        let mascotHealth = 0;
        this.mascotHealthText = this.add.text(400, 445, 'Mascot Health: ' + mascotHealth , {color: '#46ff8c', fontFamily: 'Woodchuck'});
        let enemyMascot;
        let yourMascot;
        let droppedCard;
        let yourDroppedCard;
        


        //resource variables
        let resourceTotal = 0;
        this.resourceTotalText = this.add.text(50, 350, 'Resource Pool: ' + resourceTotal, {color: '#ffaa', fontFamily: 'Woodchuck' });

        this.dealer = new Dealer(this);
        this.controller = new Controller(this);
        this.controlButton = this.controller.render();

        let self = this;

        this.socket = io('http://localhost:3000');

        //self.socket.emit('inGame');

        //self.socket.emit('dealCards');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });
        self.isPlayerA = false;
        self.dealt = false;

        this.socket.on('isPlayerA', function () {
            console.log("I've set someone to true!");
            self.isPlayerA = true;
        })

        self.socket.emit('dealCards');
        
        

        this.socket.on('dealCards', function () {
            if(!self.dealt) {
                self.dealer.dealCards();
                self.dealt = true;
            }
            //self.dealer.dealCards();
        });

        this.socket.on('switchTurn', function(turn, isPlayerA) {
            if(isPlayerA !== self.isPlayerA) {
                //this.currentTurn = turn;
                console.log("before change ", self.currentTurn);
                self.currentTurn = !self.currentTurn;
                console.log(self.currentTurn);
            }

        });

        this.socket.on('draw', function(isPlayerA) {
            if(isPlayerA != self.isPlayerA) {
                let cardBack;
                //cardBack = self.isPlayerA ? 'p2CardBack':'p1CardBack';
                cardBack = 'opponentBack';
                let opponentCard = new Card(self, 875 - (self.opponentCards.length * 100), 50, cardBack);
                self.opponentCards.push((opponentCard).disableInteractive());
      
            }
        });

        //setPollOnMove - means that the interaction won't happen unless the user moves the mouse pointer themselves
        this.input.setPollOnMove();

        //this animates the pop up
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject instanceof GameObjects.Sprite){
                if(gameObject instanceof Mascot){
                    //this.cardPopUpText = this.add.text( 0, 0, 'HP: ' + gameObject.getHealthPoints(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    let display = 'HP: ' + gameObject.getHealthPoints() + '\n';
                    display += 'Attack power: ' + gameObject.getAttackPoints() + '\n';
                    display += 'Region: ' + gameObject.getRegion();
                    this.cardPopUpText.setText(display);
                }
                else if(gameObject instanceof Resource){
                    //this.cardPopUpText = this.add.text( 0, 0, 'Value: ' + gameObject.getResVal(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('This is a Resource Card' + '\n' + 'Value: ' + gameObject.getResVal());
                }
                else if (gameObject instanceof Effect) {
                    let display = '';
                    if (gameObject.type == 'Buff') {
                        let hpText = 'Health + ' + gameObject.getHealthVal() + '\n';
                        let hitText = 'Hit + ' + gameObject.getHitVal() + '\n';
                        display = 'This is a buff type card\n';
                        if (gameObject.getHealthVal() == 0) {
                            display = display + hitText;
                        }
                        else {
                            display = display + hpText;
                        }
                        
                    } else if (gameObject.type == 'Debuff') {
                        let hpText = 'Health down ' + gameObject.getHealthVal() + '\n';
                        let hitText = 'Hit down ' + gameObject.getHitVal() + '\n';
                        display = 'This is a debuff type card\n';
                        if (gameObject.getHealthVal() == 0) {
                            display = display + hitText;
                        }
                        else {
                            display = display + hpText;
                        }
                    } else if (gameObject.type == 'Raze') {
                        let destroyText = 'Resources down ' + gameObject.getVal() + '\n'
                        display = 'This is a raze type card\n';
                        display += destroyText;
                    }
                    let aFee = "activate with: " + gameObject.cost + " resources";
                    display = display + '\n' + aFee;

                    this.cardPopUpText.setText(display);
                }
                else if(gameObject instanceof Deck){
                    //this.cardPopUpText = this.add.text( 0, 0, 'This is a card.', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('this is your draw deck');
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
            //debugging why gameObject is not a Mascot object 
            if(gameObject instanceof Mascot){
                console.log("Drop Zone Game Object is a MASCOT");
            }
            else{
                console.log("Drop Zone Game Object is NOT a MASCOT");
            }
            if(gameObject instanceof Card){
                console.log("Drop Zone Game Object is a CARD ");
            }
            if(gameObject instanceof GameObjects.Sprite){
                console.log("Drop Zone Game Object is a SPRITE ");
            }
            console.log("The (cardDropped Function) game object variables:");
            console.log(gameObject);


            //for player B
            if (isPlayerA !== self.isPlayerA) {
                //this.enemyMascot = gameObject;
                console.log("Opponent mascot variables:");
                //console.log(enemyMascot);
                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                self.dropZone.data.values.playerB_mascots++;
                console.log("Player A mascots: " + self.dropZone.data.values.playerA_mascots);
                console.log("Player B mascots: " + self.dropZone.data.values.playerB_mascots);
                console.log("Opponent Mascot Dropped.");
                console.log("Mascots now in zone: " + (self.dropZone.data.values.playerA_mascots + self.dropZone.data.values.playerB_mascots));

                //if card is a mascot 
                if(gameObject instanceof Mascot){
                    //TODO: need to access mascot attributes from class object
                    let card = new Mascot('gator', 4000, 'S',self);
                    mascotDropped = Boolean(true);
                    self.dropZone.data.values.playerB_mascots++;
                    console.log("Opponent Mascot Dropped.")
                    self.hpText = self.add.text(((self.dropZone.x - 250) + (self.dropZone.data.values.cards * 150)), (self.dropZone.y - 100), card.getHealthPoints(), {fill:'#ff5733'});
                } 
                
                //this is Player B rendering the Mascot Card that Player A dropped
                self.droppedCard = new Mascot(self, (self.dropZone.x), (self.dropZone.y - 210), sprite).disableInteractive();
                console.log("dropped Card -------");
                console.log(self.droppedCard);
            }
            //yourDroppedCard = gameObject;
            //console.log(yourDroppedCard);
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
                console.log(gameObject.input.dragStartX);
                let xval = gameObject.input.dragStartX
                gameObject.x = (resDropZone.x);
                gameObject.insResDropZone = true;
                let arr = self.handZone.data.values.xpos;
                arr = arr.filter(item => item !== xval)
                console.log(arr);
                self.handZone.setData({xpos:arr})
                self.socket.emit('resDropped',self.isPlayerA);
                // self.handZone.data.xpos = self.handZone.data.xpos.filter(function(item) {
                //     return item !== 5;
                // })

                console.log('Game Obj Vars:')
                console.log(gameObject);
                if(gameObject instanceof Resource){
                    console.log('Game object is being recognized as a Resource object')
                    console.log('Resource Card Value Dropped: ' + gameObject.getResVal());
                    resDropZone.data.values.pointSum += gameObject.getResVal();
                    resDropZone.data.values.maxCapacity = resDropZone.data.values.pointSum;
                    console.log("pool val: " + resDropZone.data.values.pointSum );
                    console.log("max capacity: " + resDropZone.data.values.maxCapacity);
                    //Removing a card from handZone for draw card logic.
                    self.handZone.data.values.cards--;
                    
                }
                else{
                    console.log('Game object is not being recognized as a Resource object')
                }
                
                resDropZone.data.values.resources++;
                
                console.log('Resources In Zone:' + resDropZone.data.values.resources);
                console.log('Resource total value:' + resDropZone.data.values.pointSum);
                console.log(resDropZone);
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        } )


        this.socket.on('cardReturned', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                console.log(sprite);
                //self.handZone.data.values.cards++;
                let card = new Card(self,((self.handZone.x - 350) + (self.handZone.data.values.cards * 200)), (self.handZone.y - 200), sprite).disableInteractive();
                //card.render(((self.handZone.x - 350) + (self.handZone.data.values.cards * 200)), (self.handZone.y - 200), sprite).disableInteractive();
            }
        })
        
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
                console.log(gameObject);
                gameObject.inDropZone = true;
                dropZone.data.values.cards++;
                dropZone.data.values.playerA_mascots++;
                let xval = gameObject.input.dragStartX
                let arr = self.handZone.data.values.xpos;
                arr = arr.filter(item => item !== xval)
                console.log(arr);
                self.handZone.setData({xpos:arr})
                //Removing a card from handZone for draw card logic.
                self.handZone.data.values.cards--;
                console.log("Player A mascots: " + self.dropZone.data.values.playerA_mascots);
                console.log("Player B mascots: " + self.dropZone.data.values.playerB_mascots);

                //print out how many mascots there are in drop zone (for debug purposes)
                console.log("Player A Mascot Dropped");
                console.log('Mascots In Zone:' + (dropZone.data.values.playerA_mascots + dropZone.data.values.playerB_mascots));
                console.log("Player A Mascot Health: " + gameObject.getHealthPoints());
                yourMascot = gameObject.getHealthPoints();
                

                //handZone.data.values.cards--;
                gameObject.y = dropZone.y;
                //gameObject.disableInteractive();
                self.updateMascotHealthText(gameObject.getHealthPoints());
                self.socket.emit('cardDropped', gameObject, self.isPlayerA);
                self.socket.emit('mascotDropped', gameObject.getHealthPoints(), self.isPlayerA);

                yourDroppedCard = gameObject;
                console.log("your dropped card");
                console.log(yourDroppedCard);
            }
           
        
        })
        

        this.socket.on('mascotDropped', function(hp, isPlayerA){
            console.log("transmitted HP: " + hp);

            //player b now knows their opponent's mascot health
            if(isPlayerA !== self.isPlayerA){
                self.enemyMascot = hp;
            }
            
        })
    

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            dropZone.setAlpha(0.5);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        })

        this.socket.on('mascotDestroyed', function(isPlayerA){
            if(isPlayerA !== self.isPlayerA){
                console.log("You lost this battle. Your Mascot will be destroyed.");
                self.dropZone.data.values.cards--;
                self.dropZone.data.values.playerA_mascots = 0;
                yourDroppedCard.destroy();
                yourMascot = 0;
                self.updateMascotHealthText(0);

                yourDestroyedMascots++;
                console.log("mascots destroyed: " + yourDestroyedMascots);

                if(yourDestroyedMascots == 2){
                    self.losePopUpText.setVisible(true).setDepth(100);
                }
            }
            else{
                self.droppedCard.destroy();
                self.dropZone.data.values.playerB_mascots--;
                self.enemyMascot = 0;
                
                enemyDestroyedMascots++;

                if(enemyDestroyedMascots == 2){ // Player won the game
                    self.winPopUpText.setVisible(true).setDepth(100);
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
                    })

                }
            }
                
        })

        this.socket.on('debuffed', function(modifier, type, isPlayerA)  {
            if(isPlayerA !== self.isPlayerA) {
                self.opponentCards.shift().destroy();
                console.log("You've been debuffed");
                console.log("amount " + modifier);
                if (type == 'health') {
                    yourDroppedCard.decreaseHP(modifier);
                }
                else {
                    yourDroppedCard.decreaseAttack(modifier);
                }
                

            }
            else {
                console.log("Debuffing opponent mascot");
                
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
                console.log("myplayerA: " + isPlayerA);
                console.log("comparator " + self.isPlayerA);
                console.log("Your land has been destroyed");
                if (self.resDropZone.data.values.pointSum > self.resDropZone.data.values.maxCapacity - modifier) {
                    self.resDropZone.data.values.pointSum = self.resDropZone.data.values.maxCapacity - modifier;
                }
                self.resDropZone.data.values.maxCapacity -= modifier;
                self.resDropZone.data.values.pointSum < 0 ? 0 : self.resDropZone.data.values.pointSum;
                self.resDropZone.data.values.maxCapacity < 0 ? 0 : self.resDropZone.data.values.maxCapacity;
                console.log("Max Capacity: " + self.resDropZone.data.values.maxCapacity);
                console.log("resources available: " + self.resDropZone.data.values.pointSum);
            }
            else {
                console.log("You are destroying your opponent's lands");
            }
        })

        this.socket.on('mascotAttacked', function (attackPoints, isPlayerA) {
            //this is emitted to all clients (player A and B), so this function goes thru both
            console.log("Mascot Attacked!!!!");
            console.log(yourDroppedCard);
            console.log("Dropped Card HP: " + yourDroppedCard.getHealthPoints());

            if(isPlayerA !== self.isPlayerA){
                console.log("attack " + self.calculatePower(yourDroppedCard.getRegion(), self.droppedCard.getRegion(), attackPoints));
                yourDroppedCard.decreaseHP(attackPoints);
                if(yourDroppedCard.getHealthPoints() == 0) {
                    self.socket.emit('mascotDestroyed',isPlayerA);
                }
            }
            
        })
            

        this.logoutButton = this.add.text(1134, 0, 'Logout', { fontFamily: '"Monospace"'});
        this.logoutButton.setInteractive();
        this.logoutButton.on('pointerdown', function () {
            firebaseApp.auth.signOut().then(() => {
                console.log('Signed out');
                this.socket.disconnect();
                self.scene.start('Login');
            }).catch((error) => {
                console.log(error);
            });
        });

        this.leaderboardButton = this.add.text(1134, 100, 'Rankings', { fontFamily: '"Monospace"'});
        this.leaderboardButton.setInteractive();
        this.leaderboardButton.on('pointerdown', function () {
            self.scene.start('Rankings');
        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log(gameObject);
        });

        let lastTime = 0;
        this.input.on('gameobjectdown', (pointer,gameObject)=>{
            
            let clickDelay = this.time.now - lastTime;
            lastTime = this.time.now;
            //double-click event
            if(clickDelay < 350) {
                console.log(gameObject.cost);
                let xval = gameObject.x
                let arr = self.handZone.data.values.xpos;
                if (gameObject instanceof Effect && this.resDropZone.data.values.pointSum >= gameObject.cost
                    && this.currentTurn) {
                    console.log("Effects lie here");
                    console.log(this.dropZone.data);
                    if (gameObject.type == 'Buff' && this.dropZone.data.values.playerA_mascots > 0) {
                        this.resDropZone.data.values.pointSum -= gameObject.cost;
                        console.log(yourDroppedCard);
                        console.log(this.dropZone.data.values.playerA_mascots)
                        console.log(gameObject.getHitVal(), gameObject.getHealthVal());
                        self.socket.emit('buffed', self.isPlayerA);
                        if (gameObject.getHealthVal() > 0) {
                            yourDroppedCard.increaseHP(gameObject.getHealthVal());
                            this.updateMascotHealthText(yourDroppedCard.getHealthPoints());
                        }
                        else {
                            yourDroppedCard.increaseAttack(gameObject.getHitVal());
                        }
                        self.handZone.data.values.cards--;
                        arr = arr.filter(item => item !== xval)
                        console.log(arr);
                        self.handZone.setData({xpos:arr})
                        gameObject.destroy();
                        //Removing a card from handZone for draw card logic.
                        
                        self.cardPopUp.alpha = 0;
                        self.cardPopUpText.alpha = 0;
                        
                    } else if (gameObject.type == 'Debuff') {
                        
                        if(this.dropZone.data.values.playerB_mascots > 0) {
                            this.resDropZone.data.values.pointSum -= gameObject.cost;
                            console.log("effect card played");
                            if (gameObject.getHealthVal() > 0) {                               
                                self.socket.emit('debuffed', gameObject.getHealthVal(), 'health', self.isPlayerA);
                            }
                            else {
                                self.socket.emit('debuffed', gameObject.getHitVal(), 'hit', self.isPlayerA )
                            }
                            arr = arr.filter(item => item !== xval)
                            console.log(arr);
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
                        console.log(arr);
                        self.handZone.setData({xpos:arr})
                        gameObject.destroy();
                        //Removing a card from handZone for draw card logic.
                        self.handZone.data.values.cards--;
                        self.socket.emit('razed',gameObject.getVal(), self.isPlayerA);
                        self.cardPopUp.alpha = 0;
                        self.cardPopUpText.alpha = 0;
                    }
                }
            console.log("pool val: " + this.resDropZone.data.values.pointSum );
            console.log("max capacity: " + this.resDropZone.data.values.maxCapacity);
            }
        });

        this.controlButton.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.socket.disconnect();
            this.scene.start('Profile');
        }, this)

        this.attackButton.on('pointerdown', () => {
            if(this.currentTurn && yourDroppedCard != undefined && attackCount > 0){
                this.updateClickCountText(++clickCount);
                let attack = yourDroppedCard.getAttackPoints();
                self.socket.emit('mascotAttacked', attack, self.isPlayerA);
                attackCount -= 1;
            } 
            // this.updateClickCountText(++clickCount);
            // let attack = yourDroppedCard.getAttackPoints();
            // self.socket.emit('mascotAttacked', attack, self.isPlayerA);
        });

        this.resDropZone.data.values.maxCapacity = this.resDropZone.data.values.pointSum;
      
        
        
        this.events.on('update', () => {
        if (yourDroppedCard !== undefined) {
            this.updateMascotHealthText(yourDroppedCard.getHealthPoints());
         }
         this.updateResourceTotalText(this.resDropZone.data.values.pointSum);
         //console.log("before set " + this.isPlayerA);
         if(this.isPlayerA && initTurn) {
            this.currentTurn = true;
            initTurn = false;
         }
         else if(!this.isPlayerA && !initTurn) {
            this.currentTurn = false;
            initTurn = false;
         }

         this.update();
    
        });
        
        
    }
    
    
    update() {

        
        
        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
        if (this.currentTurn == true) {
            //console.log("Cond 1!");
            this.turnIndicator.setText('Your turn!');
        } else {
            //console.log("Cond 2!");
            this.turnIndicator.setText('Opponent\'s turn!');
        }
        // } else if (!this.controller.turnCheck() && !this.isPlayerA) {
        //     //console.log("Cond 3!");
        //     this.turnIndicator.setText('Your turn!');
        // } else if (!this.controller.turnCheck() && this.isPlayerA) {
        //     //console.log("Cond 4!");
        //     this.turnIndicator.setText('Opponent\'s turn!');
        // } 
    }

    checkInitTurn() {
        //this.currentTurn = this.isPlayerA;
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

            //TODO: resource card
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
                return (yourPower * 2);
            }
            //loses to NE
            else if(enemyRegion == northEast){
                return (yourPower / 2)
            }
        }
        else if(yourRegion == northEast){
            //beats S
            if(enemyRegion == south){
                return (yourPower * 2);
            }
            //loses to W
            else if(enemyRegion == northEast){
                return (yourPower / 2)
            }
        }
        else if(yourRegion == midWest){
            //beats W
            if(enemyRegion == west){
                return (yourPower * 2);
            }
            //loses to S
            else if(enemyRegion == south){
                return (yourPower / 2)
            }
        }
        else if(yourRegion == west){
            //beats NE
            if(enemyRegion == northEast){
                return (yourPower * 2);
            }
            //loses to MW
            else if(enemyRegion == midWest){
                return (yourPower / 2)
            }
        }
    }
}