import Card from './card';
export default class Effect extends Card {
    constructor(type, scene, x, y, textureKey) {

        super(scene, x, y, textureKey);

        this.setScale(0.25, 0.25);
        this.setInteractive();
        scene.input.setDraggable(this);

        scene.add.existing(this);

        let inDropZone = false;
        this.cost = Math.floor(Math.random()*3 + 2);

        if (type === 'Buff') {
            this.type = 'Buff';
            this.hitUp = this.healthUp = 0;
            this.value = Math.floor(Math.random()*2)+1;

            if (this.value == 1) {
                this.hitUp = Math.floor(Math.random()*5) + 1;
            }
            else {
                this.healthUp = Math.floor(Math.random()*5) + 1;
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
                this.hitDown = -1 * (Math.floor(Math.random()*5) + 1);
            }
            else {
                this.healthDown = -1 * (Math.floor(Math.random()*5) + 1);
            }

            this.getHitVal = () => {
                return this.hitDown;
            }

            this.getHealthVal = () => {
                return this.healthDown;
            }
        }


    }

}