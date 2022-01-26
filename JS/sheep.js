class sheep{
    constructor(size, rotation) {
        this.sheepSize = size;
        this.direction = rotation;
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

    // setPosition(place, rotation, row, col){
    //     this.position[place] = [row, col];
    //     for (let i = 1; i < this.sheepSize; i++) {
    //         if (rotate === "row") this.setCase(row, Number(col) + i, value);
    //         else this.setCase(Number(row) + i, col, value);
    //     }
    // }
}