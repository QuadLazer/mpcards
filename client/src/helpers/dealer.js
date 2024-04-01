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
                        //new Mascot(scene, 475 + (i * 100), 670, mascotSprite);
                        this.randomizeMascot(475 + (i * 100), 670, scene);
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

    draw(scene) {
        if(this.handzone.data.values.cards < 5) {

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

            let card = this.deck.drawCard(scene);
                console.log(card);
                let addHand;
                console.log(this.handzone.data.values.xpos);
                let arr = this.handzone.data.values.xpos;
                let insert;
                for(let i = 475; i < 975; i = i + 100 ) {
                    console.log(i);
                    let found = arr.find((element) => element == i);
                    if (found == undefined) {
                        insert = i;
                        break;
                    }
                    console.log(insert);
            }
                //let i = this.handzone.data.values.cards;
                switch (card) {
                    case 'Mascot':
                        //addHand = new Mascot(scene, insert, 670, mascotSprite);
                        addhand = this.randomizeMascot(insert, 670, scene);
                        break;
                    case 'Resource':
                        let resource = new Resource(scene, insert, 670, playerSprite);
                        resource.setTexture(resource.getResType());
                        break;
                    case 'Debuff':
                        addHand = new Effect('Debuff',scene, insert, 670, playerSprite);
                        break;
                    case 'Buff':
                        addHand = new Effect('Buff',scene, insert, 670, playerSprite);
                        break;
                    case 'Raze':
                        addHand = new Effect('Raze',scene, insert, 670, playerSprite);
                        break;
                }
                this.handzone.data.values.xpos.push(insert);

                

        }
    }

    //randomize mascot card 
    randomizeMascot(x, y, scene){
        let rv = Math.floor((Math.random() * 4) + 1);
        let mascotSprite = '';
        switch(rv) {
            case 1:
                mascotSprite = 'mascotCardFront';
                return new Mascot(scene, x, y, mascotSprite).setRegion('S');
                break;
            case 2:
                mascotSprite = 'seahawksCardFront';
                return new Mascot(scene, x, y, mascotSprite).setRegion('NE');
                break;
            case 3:
                mascotSprite = 'wolvesCardFront';
                return new Mascot(scene, x, y, mascotSprite).setRegion('W');
                break;
            case 4:
                mascotSprite = 'spartansCardFront';
                return new Mascot(scene, x, y, mascotSprite).setRegion('MW');
                break;
        }
    }
}