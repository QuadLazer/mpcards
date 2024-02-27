import Card from './card';
export default class Resource extends Card {
    
    constructor(scene, x, y, textureKey) {
        //this super() constructor is for the Sprite class
        super(scene, x, y, textureKey);
        //this.scene = scene;

        this.setScale(0.25, 0.25);
        this.setInteractive();
        scene.input.setDraggable(this);
        this.value = Math.floor(Math.random()*3)+1;

        scene.add.existing(this);

        let inDropZone = false;
        //this.value = Math.floor(Math.random()*3)+1;

        this.getResVal = () => {
            return this.value;
        }
        
        this.setResVal = (value) => {
            this.value = value;
        }

        this.getResType = () => {
            let playerSprite = 're1';
            if (this.value === 1) {
                playerSprite = 're1';
            } else if (this.value === 2) {
                playerSprite = 're2';
            }
            else {
                playerSprite = 're3';
            }
            return playerSprite;
        }

    }
}