import Card from './card';
import Mascot from './mascot'
import Resource from './resource'
import Effect from './effect'
export default class Deck extends Card {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.handzone = scene.handZone;
        this.dealer = scene.dealer;
        this.cards = [];
        this.createDeck();
        this.setScale(0.50, 0.50);
        this.setInteractive();
        scene.input.setDraggable(this);
    }


        createDeck() {
            for (let i = 0; i < 4; i++) {
                this.cards.push('Mascot');
            }
            for (let i = 0; i < 10; i++) {
                this.cards.push('Resource');
            }
            for (let i = 0; i < 4; i ++) {
                this.cards.push('Buff');
            }
            for (let i = 0; i < 4; i ++) {
                this.cards.push('Debuff');
            }
            for (let i = 0; i < 7; i ++) {
                this.cards.push('Raze');
            }

            this.shuffleDeck();

        }

        shuffleDeck() {
            //Bypass two mascots in shuffling
            for (let i = 0; i < this.cards.length; i++ ) {
                const j = Math.floor(Math.random() *(i + 1) + 2);
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }
        }

        drawCard(scene) {

            let playerSprite;
            let opponentSprite;
            let mascotSprite;

            if (scene.isPlayerA) {
                playerSprite = 'p1CardFront';
                opponentSprite = 'opponentBack';
                mascotSprite = 'mascotCardFront';
            } else {
                playerSprite = 'p2CardFront';
                opponentSprite = 'opponentBack';
                mascotSprite = 'mascotCardFront';
            };

            console.log(this.cards.length);
            let next;

            if (this.cards.length > 0) {
                next = this.cards.shift();
            }
            console.log(next);

            switch (next) {
                case 'Mascot':
                    console.log('a mascot was summoned from the deck');
                    break;
                case 'Resource':
                    console.log('a resource was summoned from the deck');
                    break;
                case 'Buff':
                    console.log('a buff effect was summoned from the deck');
                    break;
                case 'Debuff':
                    console.log('a debuff effect was summoned from the deck');
                    break;
                case 'Raze':
                    console.log('a raze effect was summoned from the deck');
                    break;

                
            }
            return next;
        }
        
    
}