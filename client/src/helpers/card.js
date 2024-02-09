export default class Card {
    inDropZone = false;
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(0.25, 0.25).setInteractive();
            //card.add(text);
            // let text = scene.add.text(x, y, 'Hello!', {
            //     font: '24px Arial',
            //     fill: '#ff2d00'
            // });
            // text.setOrigin(0.5).card;
            scene.input.setDraggable(card);
            return card;
        }
    }
}