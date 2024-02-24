import { GameObjects } from "phaser";

export default class Card extends Phaser.GameObjects.Sprite {
    //inDropZone = false;
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);
        //this.scene = scene;

        this.setScale(0.25, 0.25);
        this.setInteractive();
        scene.input.setDraggable(this);

        scene.add.existing(this);

        let inDropZone = false;

        // this.render = (x, y, sprite) => {
        //     //the card variable here is a sprite -> need to change to be a Card object
        //     let card = scene.add.sprite(x, y, sprite).setScale(0.25, 0.25).setInteractive();
        //     scene.input.setDraggable(card);
        //     return card;
        // }
    }
}