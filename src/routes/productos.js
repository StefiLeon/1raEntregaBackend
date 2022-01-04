import { Router } from 'express';
import { io } from '../server.js';
import { authMiddleware } from '../services/auth.js';
import { products } from '../daos/index.js';
const router = Router();

//GETS
//Obtener todos los productos
router.get('/', async (req, res) => {
    let productos = await products.getAll();
    res.send(productos);
})

//Obtener producto por id
router.get('/:pid', (req, res) => {
    let id = req.params.pid;
    products.getByID(id).then(result => {
        res.send(result);
    })
})

//POSTS
//Agregar producto
router.post('/', authMiddleware, (req, res) => {
    let file = req.file;
    let producto = req.body;
    console.log(producto);
    producto.thumbnail = `${req.protocol}://${req.hostname}:8080/images/${file.filename}`;
    products.save(producto).then(result => {
        res.send(result);
        if(result.status==="success") {
            products.getAll().then(result => {
                io.emit('updateProducts', result);
                console.log(producto.id)
            })
        }
    })
})

//PUTS
//Actualizar producto por id
router.put('/:pid', authMiddleware, (req, res) => {
    let body = req.body;
    let id = req.params.pid;
    if(authMiddleware) {
        products.updateById(id,body).then(result => {
        res.send(result);
        })
    } else {
        res.send({error:-1, descripcion:"ruta /:pid del metodo delete no autorizada"})
    }
})

//DELETES
//Borrar producto por id
router.delete('/:pid', authMiddleware, (req, res) => {
    let id = req.params.pid;
    if (authMiddleware) {
    products.deleteById(id).then(result => {
        res.send(result)
        }
    )} else {
        res.send({error:-1, message:"ruta /:pid del metodo delete no autorizada"})
    }
})


export default router;