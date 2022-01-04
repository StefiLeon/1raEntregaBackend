import { Router } from "express";
import { carts } from "../daos/index.js";
const router = Router();

//GETS
//Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    let id = req.params.cid;
    let order = await carts.getByID(id);
    res.send(order);
})

//Obtener todos los carritos
router.get('/', async (req, res) => {
    let data = await carts.getAll();
    res.send(data);
})

//POSTS
//Crear carrito
router.post('/', (req, res) => {
    let order = req.body;
    carts.save(order).then(result => {
        res.send(result);
    })
})

//Incorporar productos al carrito por id
router.post('/:cid/:pid', (req, res) => {
    let objeto = req.body;
    let cid = req.params.cid;
    let pid = req.params.pid;
    carts.addProduct(cid, pid, objeto).then(result => {
        res.send(result);
    })
})

//DELETES
//Borrar carrito por id
router.delete('/:cid', (req, res) => {
    let id = req.params.cid;
    carts.deleteById(id).then(result => {
        res.send(result);
    })
})

//Vaciar carrito por id
router.delete('/:cid/empty', (req, res) => {
    let id = req.params.cid;
    carts.deleteAll(id).then(result => {
        res.send(result);
    })
})

//Borrar producto de un carrito por id de ambos
router.delete('/:cid/:pid', (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    carts.deleteProduct(cid, pid).then(result => {
        res.send(result);
    })
})
export default router;