import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const admin = require ('firebase-admin');
const serviceAccount = require ('../../ecommerce-leon-firebase-adminsdk-jfw0l-e7db2e6138.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-leon.firebaseio.com"
})

const db = admin.firestore();

export default class FirebaseContainer {
    constructor(coll){
        this.collection = db.collection(`${coll}`);
    }

    //Guardar producto/carrito
    save = async(object) => {
        try {
            let doc = this.collection.doc();
            //Campos requeridos de producto
            if(object.name && object.description && object.code && object.price && object.stock) {
                await doc.set({id: doc.id, name: object.name, description: object.description, code: object.code, price:object.price, stock:object.stock, thumbnail:object.thumbnail});
                return {status:"success", message: `Producto registrado con ID ${doc.id}`}
            } else if(object.email) { //Campos requeridos de carrito
                await doc.set({email: object.email, productos: []});
                return {status:"success", message: `Carrito registrado con ID ${doc.id}`}
            } else {
                return {status: "error", message: "Body incorrecto."}
            }
        } catch(err) {
            return {status: "error", message: "No se pudo agregar la informacion" + " "+ err}
        }
    }

    //Obtener todos los productos y carritos
    getAll = async() => {
        try {
            const data = await this.collection.get();
            const processedData = data.docs;
            const objetos = processedData.map(docs => docs.data())
            return {status: "success", lista:objetos}
        } catch(err) {
            return {status:"error", message:"No llega la informacion"+err}
        }
    }
    
    //Obtener productos y carritos por ID
    getByID = async(id) => {
        try {
            const doc = this.collection.doc(id);
            const object = await doc.get();
            if(object.data() !== undefined) {
                return {status: "success", message: object.data()}
            } else {
                return {status: "error", message: "No hay objeto con ese ID."}
            }
        } catch(err) {
            return {status: "error", message: "No se pudo obtener la informacion" + " "+ err}
        }
    }

    //Incorporar producto al carrito
    addProduct = async(cartID, productID) => {
        try {
            const doc = this.collection.doc(cartID);
            const object = await doc.get();
            const processedData = object.data();
            let products = processedData.productos;
            //Evitar duplicados
            if(products.find(i => i === productID)){
                return {status: "error", message: "El producto ya existe en el carrito."}
            } else {
                products.push(productID);
                let result = await doc.update({productos: products});
                return {status:"success", message: "Carrito actualizado."}
            }
        } catch(err) {
            return {status: "error", message: "No se actualizo el carrito." + " " + err}
        }
    }

    //Borrar producto de un carrito por ID de ambos
    deleteProduct = async(cartID, productID) => {
        try {
            const doc = this.collection.doc(cartID);
            const object = await doc.get();
            const processedData = object.data();
            let products = processedData.productos;
            if(products.find(i => i === productID)) {
                let newArray = products.filter(i => i !== productID)
                let result = await doc.update({productos: newArray});
                return {status:"success", message: "Carrito actualizado."}
            } else {
                return {status: "Error", message: "No existe el producto en el carrito"}
            }
        } catch (err) {
            return {status: "error", message: "No se pudo borrar el producto del carrito." + " " + err}
        }
    }

    //Borrar producto por ID
    deleteById = async(id) => {
        try {
            const doc = this.collection.doc(id);
            await doc.delete();
            return {status: "success", message: "Elemento borrado."}
        } catch(err) {
            return {status: "error", message: "No se puede leer el archivo para borrar el producto."}
        }
    }

    //Borrar todo
    deleteAll = async() => {
        try {
            const data = await this.collection.get();
            let newArray = [];
            const result = await this.collection.set(newArray);
            return {status: "success", message: result}
        } catch(err) {
            return {status: "error", message:"No se pudieron borrar los elementos." + " " + err}
        }
    }

    //Actualizar producto por ID
    updateById = async(id, body) => {
        try {
            let doc = this.collection.doc(id);
            let result = await doc.set({name:body.name, description:body.description, code:body.code, price:body.price, stock:body.stock});
            return {status: "success", message: `Producto actualizado con id ${doc.id}`}
        } catch(err) {
            return {status: "error", message: "No se pudo actualizar el objeto" + " "+ err}
        }
    }
}