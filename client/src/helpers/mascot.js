import Card from './card';

//mascot card 
//1. Will have a variable for their region attribute (NE, S, MW, W)
//2. Each player gets 4 mascot cards 

//TODO: will need to modify this class more to match changes made to Card and Resource
export default class Mascot extends Card {
    //class variables
    inDropZone = false;
    name;
    healthPoints;
    region;

    //class methods
    constructor(name, healthPoints, region, scene){
        super(scene);

        this.name = name;
        this.healthPoints = healthPoints;
        this.region = region;

        this.render = (x, y, sprite) => {
            let card = scene.add.sprite(x, y, sprite).setScale(0.25, 0.25).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }

        this.getHealthPoints = () => {
            return this.healthPoints;
        }
    

    }



    //Get and Set Methods
    
    getRegion(){
        return this.region;
    }

    getName(){
        return this.name;
    }

    decreaseHP(amount){
        this.healthPoints = this.healthPoints - amount;
    }

    increaseHP(amount){
        this.healthPoints = this.healthPoints + amount;
    }
}