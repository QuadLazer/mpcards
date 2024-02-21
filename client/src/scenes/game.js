import Zone from '../helpers/zone';
import Card from '../helpers/card';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';
import Controller from '../helpers/controller';

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
        this.load.image('testEndButton', 'assets/TestEnd.png');
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];
        
        this.controller = new Controller(this);
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        //this.handZone = this.zone.renderHandZone();
        this.outline = this.zone.renderOutline(this.dropZone);
        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.turnIndicator = this.add.text(30, 100, 'this is text!', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

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

        this.socket.on('cardDropped', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 200)), (self.dropZone.y - 200), sprite).disableInteractive();
            }
        })

        this.socket.on('cardReturned', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                console.log(sprite);
                //self.handZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.handZone.x - 350) + (self.handZone.data.values.cards * 200)), (self.handZone.y - 200), sprite).disableInteractive();
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
            if (!gameObject.inDropZone) {
                gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 250);
                gameObject.inDropZone = true;
                dropZone.data.values.cards++;
                //handZone.data.values.cards--;
                gameObject.y = dropZone.y;
                //gameObject.disableInteractive();
                self.socket.emit('cardDropped', gameObject, self.isPlayerA);
            }
        })

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            dropZone.setAlpha(0.5);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        })

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log(gameObject);
        })

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
}