import FileContainer from "../../contenedores/FileContainer.js";

export default class CarritoFileSystem extends FileContainer{
    constructor(){
        super('carrito.txt');
    }
}