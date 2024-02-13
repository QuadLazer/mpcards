export default class Card {
    inDropZone = false;
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.sprite(x, y, sprite).setScale(0.25, 0.25).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}