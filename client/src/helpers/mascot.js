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
        this.healthPoints = Math.floor(Math.random()*15)+1;
        this.attackPoints = Math.floor(Math.random()*15)+1;
        this.region = "S";

        scene.add.existing(this);
        let inDropZone = false;

        //get methods
        this.getHealthPoints = () => {
            return this.healthPoints;
        }

        this.getAttackPoints = () => {
            return this.attackPoints;
        }

        this.getRegion = ()=> {
            return this.region;
        }
    
        this.getName  = () => {
            return this.name;
        }
    
        //set methods
        this.setName = (name) => {
            this.name = name;
        }
        
        this.setRegion = (region) => {
            this.region = region;
        }

        this.setHP = (HP) => {
            this.healthPoints = HP;
        }

        this.decreaseHP = (amount) =>{
            this.healthPoints = this.healthPoints - amount;
            if(this.healthPoints < 0){
                this.healthPoints = 0;
            }
        }
    
        this.increaseHP = (amount) => {
            this.healthPoints = this.healthPoints + amount;
        }

        this.decreaseAttack = (amount) => {
            this.attackPoints = this.attackPoints - amount > 0 ? this.attackPoints - amount : 0; 
        }

        this.increaseAttack = (amount) => {
            this.attackPoints += amount;
        }
    

    }
}