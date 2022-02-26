import mongoose from 'mongoose';
import config from '../config.js';


mongoose.connect(config.mongoDB.baseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

export default class MongoContainer {
    constructor(collection, schema, timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamps))
    }

    //Guardar producto/carrito
    save = async(object) => {
        try {
            let result = await this.collection.create(object);
            return {status:"success", message: `Objeto agregado con exito.`, payload: result}
        } catch(err) {
            return {status: "error", message: "No se pudo agregar la informacion" + " "+ err}
        }
    }

    //Obtener productos y carritos por ID
    getByID = async(id) => {
        try {
            let object = await this.collection.find({_id: id}).populate({
                path: 'products',
                strictPopulate: false
            });
            if(object){
                return {status:"success", payload: object}
            } else {
                return {status: "error", message: "No existe el objeto solicitado."}
            }
        } catch(err) {
            return {status: "error", message: "No se pudo obtener la informacion" + " "+ err}
        }
    }

    //Obtener todos los productos y carritos
    getAll = async() => {
        try{
            let docs = await this.collection.find().populate({
                path: 'products',
                strictPopulate: false
            });
            return {status:"success", lista:docs}
        }catch(err){
            return {status: "error", error: "No se pudo obtener la informacion" + " "+ err}
        }
    }

    //Incorporar producto al carrito
    addProduct = async(cartID, productID) => {
        try {
            //Evitar duplicados
            let count = await this.collection.count({$and:[{_id:cartID},{products:productID}]});
            if(count === 1) {
                return {status: "error", message: "El producto ya esta en el carrito."}
            } else{
                let result = await this.collection.updateOne({_id:cartID}, {$addToSet:{products:productID}})
                return {status: "success", message: "Producto agregado con exito", payload: result}
            }
        } catch(err) {
            return {status: "error", message: "No se pudo agregar la informacion" + " "+ err}
        }
    }

    //Borrar producto de un carrito por id de ambos
    deleteProduct = async(cartID, productID) => {
        try {
            let count = await this.collection.count({$and:[{_id:cartID},{products:productID}]});
            if(count === 1) {
                let result = await this.collection.updateOne({_id: cartID}, {$pullAll: {products:[{_id: productID}]}})
                return {status: "success", message: "Producto eliminado con exito", payload: result}
            } else {
                return {status: "error", message: "El ID especificado no existe."}
            }
        } catch (err) {
            return {status: "error", message: "No se pudo borrar el producto del carrito." + " " + err}
        }
    }

    //Borrar producto/carrito por ID
    deleteById = async(id) => {
        try{
            let result = await this.collection.deleteOne({_id:id});
            return {status: "success", message: "Producto eliminado con exito", payload: result}
        } catch(err) {
            return {status: "error", message: "No se pudo borrar la informacion" + " "+ err}
        }
    }

    //Vaciar carrito
    deleteAll = async(id) => {
        try {
            let result = await this.collection.updateMany({_id:id},{$set:{products:[]}});
            return {status: "success", payload: result}
        } catch(err) {
            return {status: "error", message: "No se pudieron borrar los articulos" + " "+ err}
        }
    }

    //Actualizar producto por ID
    updateById = async(id, body) => {
        try {
            if(body.name){
                let result = await this.collection.updateOne({_id:id}, {name:body.name});
                return {status: "success", payload: result}
            } else if(body.description){
                let result = await this.collection.updateOne({_id:id}, {description:body.description});
                return {status: "success", payload: result}
            } else if(body.code){
                let result = await this.collection.updateOne({_id:id}, {code:body.code});
                return {status: "success", payload: result}
            } else if(body.price){
                let result = await this.collection.updateOne({_id:id}, {price:body.price});
                return {status: "success", payload: result}
            } else if(body.stock){
                let result = await this.collection.updateOne({_id:id}, {stock:body.stock});
                return {status: "success", payload: result}
            } else {
                console.log("error")
            }
        } catch(err) {
            return {status: "error", message: "No se pudo actualizar el objeto" + " "+ err}
        }
    }
}

// export class ChatContainer {
//     constructor(collection, schema, timestamps) {
//         this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamps))
//     }

//     addChat = async(object) => {
//         try {
//             let result = await this.collection.create(object);
//             return {status:"success", message: `Mensaje agregado con exito.`, payload: result}
//         } catch(err) {
//             return {status: "error", message: "No se pudo agregar la informacion" + " "+ err}
//         }
//     }

//     getAllChats = async() => {
//         try {
//             let messages = await this.collection.find();
//             return {status: "success", lista: messages}
//         } catch(err) {
//             return {status: "error", error: `no se pudo obtener la informacion por ${err}`}
//         }
//     }
// }