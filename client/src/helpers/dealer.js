import Card from './card';
import Controller from './controller';
import Mascot from './mascot'
import Resource from './resource'
export default class Dealer {
    gatorAttributes = ['gator', 4000, 'S'];
    //mascostList = ['gator', ];
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            let endTurnSprite = 'testEndButton';
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
            for (let i = 0; i < 2; i++) {
                //render player cards
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 670, playerSprite);

                let playerMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                playerMascot.render(675 + (i * 100), 670, mascotSprite);

                let playerResource = new Resource(scene);
                console.log(playerResource.value);
                //playerResource.setData({'points': playerResource.value});
                if (playerResource.value === 1) {
                    playerSprite = 're1';
                } else if (playerResource.value === 2) {
                    playerSprite = 're2';
                }
                else {
                    playerSprite = 're3';
                }
                playerResource.render(875 + (i * 100), 670, playerSprite);

                if (scene.isPlayerA) {
                    playerSprite = 'p1CardFront';
                }
                else {
                    playerSprite = 'p2CardFront';
                }

                //render opponent cards
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 50, opponentSprite).disableInteractive());

                let opponentMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                scene.opponentCards.push(opponentMascot.render(675 + (i * 100), 50, opponentSprite).disableInteractive());

                let opponentRes = new Card(scene);
                scene.opponentCards.push(opponentRes.render(875 + (i * 100), 50, opponentSprite).disableInteractive());
            }
            let gameController = new Controller(scene);
            gameController.render(endTurnSprite);
        }
    }
}