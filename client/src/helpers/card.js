import { GameObjects } from "phaser";

export default class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);

        this.setScale(0.55, 0.50);
        this.setInteractive();
        scene.input.setDraggable(this);

        scene.add.existing(this);

        let inDropZone = false;

    }
}