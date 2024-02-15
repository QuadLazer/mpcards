import Card from './card';
export default class Resource extends Card {
    value = Math.floor(Math.random()*3)+1;
    constructor(scene) {
         super(scene);
    }

        


}