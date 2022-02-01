class sheep{
    constructor(size, rotation, position) {
        this.sheepSize = size;
        this.direction = rotation;
        this.firstPosition = position;
        // this.position = [];

        // for (let i = 0; i < this.sheepSize; i++) {
        //     this.position[i] = undefined;
        // }
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

    // setPosition(place, rotation, row, col){
    //     this.position[place] = [row, col];
    //     for (let i = 1; i < this.sheepSize; i++) {
    //         if (rotate === "row") this.setCase(row, Number(col) + i, value);
    //         else this.setCase(Number(row) + i, col, value);
    //     }
    // }
}