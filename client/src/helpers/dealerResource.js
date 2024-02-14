import Card from './card';
import Resource from './resource';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'resourceCardFront';
                opponentSprite = 'p2CardBack';
            } else {
                playerSprite = 'resourceCardFront';
                opponentSprite = 'p1CardBack';
            };
            for (let i = 0; i < 5; i++) {
                //let playerCard = new Card(scene);
                //playerSprite = 'resourceCardFront';
                let playerCard = new Resource(scene);
                if (playerCard.value === 1) {
                    playerSprite = 're1';
                } else if (playerCard.value === 2) {
                    playerSprite = 're2';
                }
                else {
                    playerSprite = 're3';
                }
                playerCard.render(475 + (i * 100), 670, playerSprite);

                let opponentCard = new Resource(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 50, opponentSprite).disableInteractive());
            }
        }
    }
}