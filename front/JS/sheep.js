class sheep{
    constructor(size, rotation, position) {
        this.sheepSize = size;
        this.direction = rotation;
        this.firstPosition = position;
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

    getFirstPosition(){
        return this.firstPosition;
    }

    setFirstPosition(position){
        this.firstPosition = position;
    }
}