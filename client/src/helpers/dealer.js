import Card from './card';
import Controller from './controller';
export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            let endTurnSprite = 'testEndButton';
            if (scene.isPlayerA) {
                playerSprite = 'p1CardFront';
                opponentSprite = 'p2CardBack';
            } else {
                playerSprite = 'p2CardFront';
                opponentSprite = 'p1CardBack';
            };
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 670, playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 50, opponentSprite).disableInteractive());
            }
            let gameController = new Controller(scene);
            gameController.render(endTurnSprite);
        }
    }
}