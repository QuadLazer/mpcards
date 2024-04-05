import Card from './card';
import Controller from './controller';
import Mascot from './mascot'
import Resource from './resource'
import Effect from './effect'
// import Deck from './deck'
export default class Dealer {
    constructor(scene) {
        
        this.deck = scene.deck;
        this.handzone = scene.handZone;
        this.dealCards = () => {
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


            for(let i = 0; i < 5; i++) {
                let card = this.deck.drawCard(scene);
                console.log(card);
                switch (card) {
                    case 'Mascot':
                        //new Mascot(scene, 475 + (i * 100), 670, mascotSprite);
                        this.randomizeMascot(475 + (i * 100), 700, scene);
                        break;
                    case 'Resource':
                        let resource = new Resource(scene, 475 + (i * 100), 700, playerSprite);
                        resource.setTexture(resource.getResType());
                        break;
                    case 'Debuff':
                        new Effect('Debuff',scene, 475 + (i * 100), 700, playerSprite);
                        break;
                    case 'Buff':
                        new Effect('Buff',scene, 475 + (i * 100), 700, playerSprite);
                        break;
                    case 'Raze':
                        new Effect('Raze',scene, 475 + (i * 100), 700, playerSprite);
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
                opponentSprite = 'opponentBack';
                mascotSprite = 'mascotCardFront';
            } else {
                playerSprite = 'p2CardFront';
                opponentSprite = 'opponentBack';
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
                        addHand = this.randomizeMascot(insert, 700, scene);
                        break;
                    case 'Resource':
                        let resource = new Resource(scene, insert, 700, playerSprite);
                        resource.setTexture(resource.getResType());
                        break;
                    case 'Debuff':
                        addHand = new Effect('Debuff',scene, insert, 700, playerSprite);
                        break;
                    case 'Buff':
                        addHand = new Effect('Buff',scene, insert, 700, playerSprite);
                        break;
                    case 'Raze':
                        addHand = new Effect('Raze',scene, insert, 700, playerSprite);
                        break;
                }
                this.handzone.data.values.xpos.push(insert);

                

        }
    }

    //randomize mascot card 
    randomizeMascot(x, y, scene){
        let rv = Math.floor((Math.random() * 4) + 1);
        let sprite = '';
        switch(rv) {
            case 1:
                sprite = 'gatorMascot';
                return new Mascot(scene, x, y, sprite).setRegion('S');
                break;
            case 2:
                sprite = 'seahawkMascot';
                return new Mascot(scene, x, y, sprite).setRegion('NE');
                break;
            case 3:
                sprite = 'wolfMascot';
                return new Mascot(scene, x, y, sprite).setRegion('W');
                break;
            case 4:
                sprite = 'spartanMascot';
                return new Mascot(scene, x, y, sprite).setRegion('MW');
                break;
        }
    }
}