import Card from './card';
export default class Effect extends Card {
    constructor(type, scene, x, y, textureKey) {
                
        super(scene, x, y, textureKey);

        let inDropZone = false;
        this.cost = Math.floor(Math.random()*3 + 2);

        if (type === 'Buff') {
            this.type = 'Buff';
            this.hitUp = this.healthUp = 0;
            this.value = Math.floor(Math.random()*2)+1;

            if (this.value == 1) {
                this.hitUp = Math.floor(Math.random()*5) + 1;
                this.setTexture('buffHit');
            }
            else {
                this.healthUp = Math.floor(Math.random()*5) + 1;
                this.setTexture('buffHealth');
            }

            this.getHitVal = () => {
                return this.hitUp;
            }

            this.getHealthVal = () => {
                return this.healthUp;
            }
        }
        else if (type === 'Debuff') {
            this.type = 'Debuff';
            this.hitDown = this.healthDown = 0;
            this.value = Math.floor(Math.random()*2)+1;

            if (this.value == 1) {
                this.hitDown = (Math.floor(Math.random()*5) + 1);
                this.setTexture('debuffHit');
            }
            else {
                this.healthDown = (Math.floor(Math.random()*5) + 1);
                this.setTexture('debuffHealth');
            }

            this.getHitVal = () => {
                return this.hitDown;
            }

            this.getHealthVal = () => {
                return this.healthDown;
            }
        }
        else if (type === 'Raze') {
            this.type = 'Raze';
            this.value = Math.floor(Math.random()*3) + 1;
            this.setTexture('razeCard');

            this.getVal = () => {
                return this.value;
            }
        }

        if (textureKey) {
            this.textureKey = textureKey;
        }

        this.setScale(0.55, 0.50);
        this.setInteractive();
        scene.input.setDraggable(this);

        scene.add.existing(this);

        


    }

}