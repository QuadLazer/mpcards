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
        this.controller = new Controller(this);
        this.mascotCardPlace = false;


        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        //this.handZone = this.zone.renderHandZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.resDropZone = this.zone.renderResourceZone();
        this.resOutline = this.zone.renderResOutline(this.resDropZone);
        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.turnIndicator = this.add.text(30, 100, 'this is text!', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        let btnQuit = this.add.text(1130,200, 'QUIT', { fill: '#CCAAFF'});
        btnQuit.setInteractive();
        btnQuit.on('pointerdown', () => {
            this.socket.disconnect();
            this.scene.start('Load');
        });
      
        //hover mascot variables
        //this.objectWithToolTip = this.add.rectangle( 100, 100, 100, 100, 0xffffff).setInteractive();
        this.cardPopUp =  this.add.rectangle( 0, 0, 250, 50, 0xff0000).setOrigin(0);
        this.cardPopUpText = this.add.text( 0, 0, 'This is a pop up', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
        this.cardPopUp.alpha = 0;

        //attack button 
        let clickCount = 0;
        this.clickCountText = this.add.text(44, 650, '');
        this.attackButton = this.add.text(100, 600, 'Attack', {fill:'#ff5733'}).setInteractive();
        this.attackButton.on('pointerdown', () => this.updateClickCountText(++clickCount));
        this.updateClickCountText(clickCount);

        //mascot display 
        let mascotHealth = 0;
        this.mascotHealthText = this.add.text(400, 445, 'Mascot Health: ' + mascotHealth , {color: '#46ff8c'});
        //this.updateMascotHealthText(mascotHealth);

        this.dealer = new Dealer(this);

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
            //TODO: this triggers on any Sprite object, might need modifying in future to work for different card types?
            if(gameObject instanceof GameObjects.Sprite && self.isPlayerA == true){
                this.cardPopUpText = this.add.text( 0, 0, 'working', { fontFamily: 'Arial', color: '#0xff0000' }).setOrigin(0);
                this.tweens.add({
                targets: [this.cardPopUp, this.cardPopUpText],
                alpha: {from:0, to:1},
                repeat: 0,
                duration: 500
            });
            }
                
        }, this);

        //when taking the mouse off the game object, the pop up will disappear
        this.input.on('gameobjectout', function (pointer, gameObject) {
            self.cardPopUp.alpha = 0;
            self.cardPopUpText.alpha = 0;
            self.cardPopUpText.destroy();
        });

        //this moves the pop up while over an object
        this.input.on('pointermove', function (pointer, gameObject) {
            self.cardPopUp.x = pointer.x;
            self.cardPopUp.y = pointer.y;
            self.cardPopUpText.x = pointer.x + 5;
            self.cardPopUpText.y = pointer.y + 5;  
        });
    

        this.socket.on('cardDropped', function (gameObject, isPlayerA) {
            let mascotDropped = Boolean(false);
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;

                //let card = new Card(self);
                //if card is a mascot 
                if(gameObject instanceof Mascot){
                    //TODO: need to access mascot attributes from class object
                    let card = new Mascot('gator', 4000, 'S',self);
                    mascotDropped = Boolean(true);
                    self.dropZone.data.values.mascots++;
                    self.hpText = self.add.text(((self.dropZone.x - 250) + (self.dropZone.data.values.cards * 150)), (self.dropZone.y - 100), card.getHealthPoints(), {fill:'#ff5733'});
                }
                
                //let card = new Card(self);
                //card.render(((self.dropZone.x- 350) + (self.dropZone.data.values.cards * 200)), (self.dropZone.y - 200), sprite).disableInteractive();
                //card.render((self.dropZone.x), (self.dropZone.y -210), sprite).disableInteractive();
                let card = new Card(self, (self.dropZone.x), (self.dropZone.y -210), sprite).disableInteractive();
            }

            //showing hp for P1 mascot
            if(mascotDropped){
                //TODO: Fix this to display health when mascot card is placed into drop zone
                self.hpText = self.add.text(((self.dropZone.x - 250) + (self.dropZone.data.values.cards * 150)), (self.dropZone.y - 100), 'card.getHealthPoints()', {fill:'#ff5733'});
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

        this.input.on('drop', function (pointer, gameObject, resDropZone) {
            if (!gameObject.inDropZone) {
                gameObject.x = (resDropZone.x);

                console.log('Game Obj Vars:')
                console.log(gameObject);
                if(gameObject instanceof Resource){
                    console.log('Game object is being recognized as a Resource object')
                    console.log('Resource Card Value Dropped: ' + gameObject.getResVal());
                    resDropZone.data.values.pointSum += gameObject.getResVal();
                }
                else{
                    console.log('Game object is not being recognized as a Resource object')
                }
                
                resDropZone.data.values.resources++;
                
                console.log('Resources In Zone:' + resDropZone.data.values.resources);
                console.log('Resource total value:' + resDropZone.data.values.pointSum);
                console.log(resDropZone);
            }
        })


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

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            //TODO: mascot limit implemented, may need modification to include resource card limit(s) later
            if (!gameObject.inDropZone && dropZone.data.values.mascots == 0) {
                gameObject.x = (dropZone.x);
                gameObject.inDropZone = true;
                dropZone.data.values.cards++;
                dropZone.data.values.mascots++;

                //print out how many mascots there are in drop zone (for debug purposes)
                console.log('Mascots In Zone:' + dropZone.data.values.mascots);
                

                //TODO: edit this line to fit any mascot health class variable
                //self.mascotHealth += 4000;
                console.log(gameObject.getHealthPoints());
                //console.log('Mascot HEALTH' + Mascot.getHealthPoints());

                //handZone.data.values.cards--;
                gameObject.y = dropZone.y;
                //gameObject.disableInteractive();
                self.updateMascotHealthText(gameObject.getHealthPoints());
                self.socket.emit('cardDropped', gameObject, self.isPlayerA);
            }
        })

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            dropZone.setAlpha(0.5);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
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
}