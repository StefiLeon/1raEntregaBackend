import FirebaseContainer from "../../contenedores/FirebaseContainer.js";

export default class ProductsFirebase extends FirebaseContainer {
    constructor() {
        super('products');
    }
}