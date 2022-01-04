import fs from 'fs';
import config from '../config.js';

export default class FileContainer {
    constructor(file_endpoint){
        this.url = `${config.fileSystem.baseURL}${file_endpoint}`
    }

    //Guardar producto o carrito
    save = async(objeto) => {
        let fyh = Date(Date.now());
        let timestamp = fyh.toString();
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            let id = processedData[processedData.length-1].id+1;
            //Campos requeridos de producto
            if(objeto.nombre && objeto.descripcion && objeto.codigo && objeto.price && objeto.stock && objeto.thumbnail){          
                objeto = Object.assign({id:id}, {timestamp:`Added at ${timestamp}`}, {nombre:objeto.nombre}, {descripcion:objeto.descripcion}, {codigo:objeto.codigo}, {price:objeto.price},{stock:objeto.stock},{thumbnail:objeto.thumbnail});
                processedData.push(objeto);
                console.log(objeto.id);
                try {
                    await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                    return {status:"success", message:`Producto registrado con ID ${objeto.id}`}
                } catch(err) {
                    return {status:"Error", message: `No se creo el producto, ${err}`}
                }
            //Campo requerido de carrito
            } else if(objeto.email) {
                objeto = Object.assign({id:id}, {timestamp:`Added at ${timestamp}`}, {email:objeto.email}, {productos: []});
                processedData.push(objeto);
                console.log(objeto.id);
                try {
                    await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                    return {status:"success", message:`Carrito registrado con ID ${objeto.id}`}
                } catch(err) {
                    return {status:"Error", message: `No se creo el carrito, ${err}`}
                }
            } else {
                return {status: "Error", message: "Faltan datos en el body."}
            }
        } catch(err) {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            if(objeto.nombre && objeto.descripcion && objeto.codigo && objeto.price && objeto.stock && objeto.thumbnail) {
                objeto = Object.assign({id:1}, {timestamp:`Added at ${timestamp}`}, {nombre:objeto.nombre}, {descripcion:objeto.descripcion}, {codigo:objeto.codigo}, {price:objeto.price},{stock:objeto.stock},{thumbnail:objeto.thumbnail});
                try {
                    await fs.promises.writeFile(this.url, JSON.stringify([objeto], null, 2));
                    return {status: "success", message: "Producto creado con exito."}
                } catch(err) {
                    console.log("No se pudo crear el producto.");
                return {status: "error", message: `No se pudo crear, ${err}`}
                }
            } else if (objeto.email) {
                objeto = Object.assign({id:1}, {timestamp:`Added at ${timestamp}`}, {email:objeto.email}, {productos: []});
                processedData.push(objeto);
                console.log(objeto.id);
                try {
                    await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                    return {status:"success", message:`Carrito registrado con ID ${objeto.id}`}
                } catch(err) {
                    return {status:"Error", message: `No se creo el carrito, ${err}`}
                }
            } else {
                return {status: "Error", message: "No se creo el objeto"}
            }
        }
    }

    //Obtener todos los productos y carritos
    getAll = async() => {
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            if(processedData){
                return {status: "success", lista: processedData}
            } else {
                return {status:"error", message: "No se pudo procesar la informacion."}
            }
        } catch(err) {
            return {status: "error", error: "No se pudo obtener la informacion" + " "+ err}
        }
    }

    //Obtener productos y carritos por ID
    getByID = async(id) => {
        let newID = parseInt(id);
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            let object = processedData.find(i => i.id===newID)
            if(object){
                return {status: "success", payload:object}
            } else {
                return {status: "error", message:"El objeto buscado no existe."}
            }
        } catch(err) {
            return {status: "error", error: "No se pudo obtener la informacion" + " "+ err}
        }
    }

    //Incorporar producto al carrito
    addProduct = async(cid, pid, objeto) => {
        let cartID = parseInt(cid);
        let productID = parseInt(pid);
        let fyh = Date(Date.now());
        let timestamp = fyh.toString();
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            let carrito = processedData.find(i=>i.id==cartID);
            if(carrito) {
                let lista = carrito.productos;
                lista.push(`ID de producto: ${productID}`);
                try {
                    await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                    return {status:"success", message:"Carrito actualizado", carrito: carrito}
                } catch (err) {
                    return {status:"Error", message: "No hay carrito creado."}
                }
            } else {
                try {
                    //Crear carrito si no existe
                    let data = await fs.promises.readFile(this.url, 'utf-8');
                    let processedData = JSON.parse(data);
                    let id = processedData[processedData.length-1].id+1;
                    let newCart = Object.assign({id:id}, {timestamp:`Added at ${timestamp}`}, {email:objeto.email}, {productos: [`ID de producto: ${productID}`]});
                    processedData.push(newCart);
                    console.log(newCart.id);
                    try {
                        await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                        return {status:"success",message:"Carrito guardado.", carrito: carrito}
                    } catch(err) { 
                        return {status:"Error", message: "No se guardó el carrito1."}
                    }
                } catch(err) {
                    return {status:"Error", message: `No se guardó el carrito2 ${err}`}
                }
            }
        } catch(err){
            return {status:"Error", message: `No se guardo el carrito ${err}`}
        }
    }

    //Borrar producto de un carrito por ID de ambos
    deleteProduct = async(cid, pid) => {
        let cartID = parseInt(cid);
        let productID = parseInt(pid);
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            let carrito = processedData.find(i=>i.id==cartID);
            let lista = carrito.productos;
            if(carrito) {
                let newArray = lista.filter(i => i !== `ID de producto: ${productID}`);
                lista = newArray;
                carrito.productos = newArray;
                console.log(newArray);
                await fs.promises.writeFile(this.url, JSON.stringify(processedData, null, 2));
                return {status: "success", message:"Producto eliminado."}
            } else {
                return {status:"error", message: "No existe el carrito seleccionado."}
            }
        } catch(err) {
            return {status:"error", message:"No se borró el producto." + err}
        }
    }

    //Borrar producto por ID
    deleteById = async(id) => {
        let newID = parseInt(id);
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            let object = processedData.find(i => i.id===newID)
            if(object){
                let newArray = processedData.filter(i => i.id !== newID);
                await fs.promises.writeFile(this.url, JSON.stringify(newArray, null, 2));
                return {status: "success", message:"Objeto eliminado."}
            } else {
                return {status: "error", message: "No existe objeto con ese ID"}
            }
        } catch(err) {
            return {status: "error", message: "No se puede leer el archivo para borrar el producto"}
        }
    }

    //Borrar todo
    deleteAll = async() => {
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let newArray = [];
            await fs.promises.writeFile(this.url, newArray, null, 2)
        } catch(err) {
            console.log("No anda");
            return {status: "error", message:"No se pudieron borrar los elementos."}
        }
    }

    //Actualizar producto por ID
    updateById = async(id, body) => {
        let productID = parseInt(id);
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let processedData = JSON.parse(data);
            if (!processedData.some(producto => producto.id === productID)) return {status:"Error", message:"No hay producto con ese ID."}
            let result = processedData.map(producto => {
                if(producto.id === productID){
                    body = Object.assign({id:productID},{nombre:body.nombre},{descripcion:body.descripcion},{codigo:body.codigo},{price:body.price},{stock:body.stock}, {thumbnail:body.thumbnail}, {timestamp:producto.timestamp});
                    return body;
                } else {
                    return producto;
                }
            })
            try {
                await fs.promises.writeFile(this.url, JSON.stringify(result, null, 2));
                return {status: "success", message:"Producto actualizado."}
            } catch(err) {
                return {status: `error ${err}`, message: "No se pudo actualizar"}
            }
        } catch(err){
            return {status:"Error", message:"Fallo al actualizar el producto" + " " + err}
        }
    }
}