class sheep{
    constructor(size, rotation) {
        this.sheepSize = size;
        this.direction = rotation;
    }

    getRotation(){
        return this.direction;
    }

    setRotation(rotation){
        this.direction = rotation;
    }

    getSize(){
        return this.sheepSize;
    }
}