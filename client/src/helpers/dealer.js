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
            let value = Math.floor(Math.random()*3)+1;

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
                let playerCard = new Card(scene, 475 + (i * 100), 670, playerSprite);
                //playerCard.render(475 + (i * 100), 670, playerSprite);

                let playerMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                playerMascot.render(675 + (i * 100), 670, mascotSprite);

                value = Math.floor(Math.random()*3)+1;
                let playerResource = new Resource(scene, 875 + (i * 100), 670, playerSprite, value);
                let resourceTextureKey = playerResource.getResType();
                playerResource.setTexture(resourceTextureKey);
                console.log("generated val: " + value);
                console.log("Class obj val: " + playerResource.getResVal());

                //playerResource.setData({'points': playerResource.value});
                // if (playerResource.value === 1) {
                //     playerSprite = 're1';
                // } else if (playerResource.value === 2) {
                //     playerSprite = 're2';
                // }
                // else {
                //     playerSprite = 're3';
                // }
                //playerResource.render(875 + (i * 100), 670, playerSprite);

                if (scene.isPlayerA) {
                    playerSprite = 'p1CardFront';
                }
                else {
                    playerSprite = 'p2CardFront';
                }

                //render opponent cards
                let opponentCard = new Card(scene, 475 + (i * 100), 50, opponentSprite);
                //scene.opponentCards.push(opponentCard.render(475 + (i * 100), 50, opponentSprite).disableInteractive());
                scene.opponentCards.push((opponentCard).disableInteractive());

                let opponentMascot = new Mascot(this.gatorAttributes.at(0), this.gatorAttributes.at(1), this.gatorAttributes.at(2), scene);
                scene.opponentCards.push(opponentMascot.render(675 + (i * 100), 50, opponentSprite).disableInteractive());

                //let opponentRes = new Card(scene, (875 + (i * 100), 50, opponentSprite)); 
                //scene.opponentCards.push(opponentRes.render(875 + (i * 100), 50, opponentSprite).disableInteractive());
                //scene.opponentCards.push((opponentRes).disableInteractive());

                let opponentResource = new Card(scene, 875 + (i * 100), 50, opponentSprite);
                scene.opponentCards.push((opponentResource).disableInteractive());
            }
            let gameController = new Controller(scene);
            gameController.render(endTurnSprite);
        }
    }
}