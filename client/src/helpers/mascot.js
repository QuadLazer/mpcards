import Card from './card';

//mascot card 
//1. Will have a variable for their region attribute (NE, S, MW, W)
//2. Each player gets 4 mascot cards 

//TODO: will need to modify this class more to match changes made to Card and Resource
export default class Mascot extends Card {
    //class variables
    //name;
    //healthPoints;
    //region;


    //class methods
     constructor(scene, x, y, textureKey) {
        //this super() constructor is for the Sprite class
        super(scene, x, y, textureKey);
        //this.scene = scene;

        

        this.setScale(0.25, 0.25);
        this.setInteractive();
        scene.input.setDraggable(this);

        this.name = "Test";
        this.healthPoints = 15;
        this.region = "S";

        scene.add.existing(this);
        let inDropZone = false;

        

        this.getHealthPoints = () => {
            return this.healthPoints;
        }

        this.getRegion = ()=> {
            return this.region;
        }
    
        this.getName  = () => {
            return this.name;
        }
    
        this.decreaseHP = (amount) =>{
            this.healthPoints = this.healthPoints - amount;
        }
    
        this.increaseHP = (amount) => {
            this.healthPoints = this.healthPoints + amount;
        }
    

    }



 
}