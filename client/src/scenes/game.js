import Zone from '../helpers/zone';
import Card from '../helpers/card';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';
import Resource from '../helpers/resource';

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

        this.load.plugin('FirebasePlugin', FirebasePlugin, true);

        this.load.image('testEndButton', 'assets/TestEnd.png');
        this.load.image('mascotCardFront', 'assets/gator_logo.png');

    }

    create() {
        var firebaseApp = this.plugins.get('FirebasePlugin');
        this.isPlayerA = false;
        this.opponentCards = [];
        this.mascotCardPlace = false;

        //zone variables
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        //this.handZone = this.zone.renderHandZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.resDropZone = this.zone.renderResourceZone();
        console.log(this.resDropZone);
        this.resOutline = this.zone.renderResOutline(this.resDropZone);

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.turnIndicator = this.add.text(30, 100, 'this is text!', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        //button variables
        let btnQuit = this.add.text(1130,200, 'QUIT', { fill: '#CCAAFF'});
        btnQuit.setInteractive();
        btnQuit.on('pointerdown', () => {
            this.socket.disconnect();
            this.scene.start('Load');
        });
      
        //hover mascot variables
        this.cardPopUp =  this.add.rectangle( 0, 0, 250, 90, 0xff0000).setOrigin(0).setDepth(100);
        this.cardPopUpText = this.add.text( 0, 0, '', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0).setDepth(100);
        this.cardPopUp.alpha = 0;

        //attack button
        let clickCount = 0;
        this.clickCountText = this.add.text(44, 650, '');
        this.attackButton = this.add.text(100, 600, 'Attack', {fill:'#ff5733'}).setInteractive();
        this.updateClickCountText(clickCount);

        //mascot display 
        let mascotHealth = 0;
        this.mascotHealthText = this.add.text(400, 445, 'Mascot Health: ' + mascotHealth , {color: '#46ff8c'});
        let enemyMascot;
        let yourMascot;
        let droppedCard;

        //resource variables
        let resourceTotal = 0;
        this.resourceTotalText = this.add.text(50, 350, 'Resource pool: ' + resourceTotal, {color: '#ffaa' });

        this.dealer = new Dealer(this);
        this.controller = new Controller(this);
        this.controlButton = this.controller.render();

        let self = this;

        this.socket = io('http://localhost:3000');

        self.socket.emit('dealCards');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            console.log("I've set someone to true!");
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
        })

        //setPollOnMove - means that the interaction won't happen unless the user moves the mouse pointer themselves
        this.input.setPollOnMove();

        //this animates the pop up
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject instanceof GameObjects.Sprite){
                if(gameObject instanceof Mascot){
                    //this.cardPopUpText = this.add.text( 0, 0, 'HP: ' + gameObject.getHealthPoints(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('HP: ' + gameObject.getHealthPoints());
                    this.tweens.add({
                        targets: [this.cardPopUp, this.cardPopUpText],
                        alpha: {from:0, to:1},
                        repeat: 0,
                        duration: 5
                    }); 
                }
                else if(gameObject instanceof Resource){
                    //this.cardPopUpText = this.add.text( 0, 0, 'Value: ' + gameObject.getResVal(), { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('Value: ' + gameObject.getResVal());
                    this.tweens.add({
                        targets: [this.cardPopUp, this.cardPopUpText],
                        alpha: {from:0, to:1},
                        repeat: 0,
                        duration: 5
                    }); 
                }
                else if(gameObject instanceof Card){
                    //this.cardPopUpText = this.add.text( 0, 0, 'This is a card.', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                    this.cardPopUpText.setText('this is a card');
                    this.tweens.add({
                        targets: [this.cardPopUp, this.cardPopUpText],
                        alpha: {from:0, to:1},
                        repeat: 0,
                        duration: 5
                    }); 
                }
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
    

        this.socket.on('cardDropped', function (gameObject, isPlayerA) {
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
                this.enemyMascot = gameObject;
                console.log("Opponent mascot variables:");
                console.log(enemyMascot);
                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                self.dropZone.data.values.playerB_mascots++;
                console.log("Player A mascots: " + self.dropZone.data.values.playerA_mascots);
                console.log("Player A mascots: " + self.dropZone.data.values.playerA_mascots);
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
                
                self.droppedCard = new Card(self, (self.dropZone.x), (self.dropZone.y - 210), sprite).disableInteractive();
            }
        })

        this.socket.on('resDropped', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.resDropZone.data.values.resources++;
                console.log(self.resDropZone.getData('resources'));
                //card.render((self.dropZone.x), (self.dropZone.y -100), sprite).disableInteractive();
            }

        })

        //for resource drop zone
        this.input.on('drop', function (pointer, gameObject, resDropZone) {
            if (!gameObject.inresDropZone && resDropZone.name == 'resourceArea' && gameObject instanceof Resource
                && gameObject.insResDropZone != true ) {
                gameObject.x = (resDropZone.x);
                gameObject.insResDropZone = true;

                console.log('Game Obj Vars:')
                console.log(gameObject);
                if(gameObject instanceof Resource){
                    console.log('Game object is being recognized as a Resource object')
                    console.log('Resource Card Value Dropped: ' + gameObject.getResVal());
                    resDropZone.data.values.pointSum += gameObject.getResVal();
                    self.updateResourceTotalText(resDropZone.data.values.pointSum);
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
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if (!gameObject.inDropZone && dropZone.data.values.playerA_mascots == 0 && dropZone.name == 'mascotArea' && gameObject instanceof Mascot) {
                gameObject.x = (dropZone.x);
                gameObject.inDropZone = true;
                dropZone.data.values.cards++;
                dropZone.data.values.playerA_mascots++;
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
                console.log("Your Mascot will be destroyed.");
                self.dropZone.data.cards--;
                self.dropZone.data.playerA_mascots--;
                self.droppedCard.destroy();
            }
        })

        this.socket.on('mascotAttacked', function (gameObject, isPlayerA) {
            //this is emitted to all clients (player A and B), so this function goes thru both
            console.log("Mascot Attacked!!!!");
            let win = false;
            if(isPlayerA !== self.isPlayerA){
                if(self.enemyMascot > self.yourMascot){
                    console.log("You Lose this battle. Your Mascot dies.");
                    win = true;
                    
                }
                else{
                    console.log("You Win this battle. Your Mascot lives.");
                    self.socket.emit('mascotDestroyed', self.isPlayerA);
                }
            }
            else{
                if(self.enemyMascot > self.yourMascot){
                    console.log("You Win this battle. Your Mascot lives.");
                    self.socket.emit('mascotDestroyed', self.isPlayerA);
                }
                else{
                    console.log("You Lose this battle. Your Mascot dies.");
                }
            }
            win = false;
        })
            

        this.logoutButton = this.add.text(1134, 0, 'Logout', { fontFamily: '"Monospace"'});
        this.logoutButton.setInteractive();
        this.logoutButton.on('pointerdown', function () {
            firebaseApp.auth.signOut().then(() => {
                console.log('Signed out');
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
        })

        this.controlButton.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('Profile');
        }, this)

        this.attackButton.on('pointerdown', (isPlayerA, gameObject) => { 
            this.updateClickCountText(++clickCount);
            self.socket.emit('mascotAttacked', gameObject, self.isPlayerA);
        });

    }
    
    update() {
        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
        if (this.controller.turnCheck() && this.isPlayerA) {
            //console.log("Cond 1!");
            this.turnIndicator.setText('Your turn!');
        } else if (this.controller.turnCheck() && !this.isPlayerA) {
            //console.log("Cond 2!");
            this.turnIndicator.setText('Opponent\'s turn!');
        } else if (!this.controller.turnCheck() && !this.isPlayerA) {
            //console.log("Cond 3!");
            this.turnIndicator.setText('Your turn!');
        } else if (!this.controller.turnCheck() && this.isPlayerA) {
            //console.log("Cond 4!");
            this.turnIndicator.setText('Opponent\'s turn!');
        } 
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

    updateMascotHealth(mascotA_Health, mascotB_Health){
        if(mascotA_Health > mascotB_Health){
            //something
        }
    }
}