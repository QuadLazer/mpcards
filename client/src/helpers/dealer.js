import Card from './card';
import Mascot from './mascot'

export default class Dealer {
    gatorAttributes = ['gator', 4000, 'S'];
    //mascostList = ['gator', ];
    constructor(scene) {
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
            for (let i = 0; i < 3; i++) {
                //render player cards
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 670, playerSprite);

                let playerMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                playerMascot.render(775 + (i * 100), 670, mascotSprite);

                //render opponent cards
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 50, opponentSprite).disableInteractive());

                let opponentMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                scene.opponentCards.push(opponentMascot.render(775 + (i * 100), 50, opponentSprite).disableInteractive());
            }
        }
    }
}