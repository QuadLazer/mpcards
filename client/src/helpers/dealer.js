import Card from './card';
import Controller from './controller';
import Mascot from './mascot'
import Resource from './resource'
import Effect from './effect'
// import Deck from './deck'
export default class Dealer {
    gatorAttributes = ['gator', 4000, 'S'];
    //mascostList = ['gator', ];
    constructor(scene) {
        this.deck = scene.deck;
        this.handzone = scene.handZone;
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            let mascotSprite;

            if (scene.isPlayerA) {
                playerSprite = 'p1CardFront';
                opponentSprite = 'p2CardBack';
                mascotSprite = 'mascotCardFront';
            } else {
                playerSprite = 'p2CardFront';
                opponentSprite = 'p1CardBack';
                mascotSprite = 'mascotCardFront';
            };


            for(let i = 0; i < 5; i++) {
                let card = this.deck.drawCard(scene);
                console.log(card);
                switch (card) {
                    case 'Mascot':
                        new Mascot(scene, 475 + (i * 100), 670, mascotSprite);
                        break;
                    case 'Resource':
                        let resource = new Resource(scene, 475 + (i * 100), 670, playerSprite);
                        resource.setTexture(resource.getResType());
                        break;
                    case 'Debuff':
                        new Effect('Debuff',scene, 475 + (i * 100), 670, playerSprite);
                        break;
                    case 'Buff':
                        new Effect('Buff',scene, 475 + (i * 100), 670, playerSprite);
                        break;
                    case 'Raze':
                        new Effect('Raze',scene, 475 + (i * 100), 670, playerSprite);
                        break;


                }

                let opponentCard = new Card(scene, 475 + (i * 100), 50, opponentSprite);
                scene.opponentCards.push((opponentCard).disableInteractive());
            }
            this.handzone.data.values.cards = 5;
            
        }
    }

    draw() {
        if(this.handzone.data.values.cards < 5) {
            let card = this.deck.drawCard(scene);
                console.log(card);
                switch (card) {
                    case 'Mascot':
                        new Mascot(scene, 475 + (i * 100), 670, mascotSprite);
                        break;
                    case 'Resource':
                        let resource = new Resource(scene, 475 + (i * 100), 670, playerSprite);
                        resource.setTexture(resource.getResType());
                        break;
                    case 'Debuff':
                        new Effect('Debuff',scene, 475 + (i * 100), 670, playerSprite);
                        break;
                    case 'Buff':
                        new Effect('Buff',scene, 475 + (i * 100), 670, playerSprite);
                        break;
                    case 'Raze':
                        new Effect('Raze',scene, 475 + (i * 100), 670, playerSprite);
                        break;
                }

        }
    }
}