//IMPORTS
import express from 'express';
import cors from 'cors';
import productosRouter from './routes/productos.js';
import carritoRouter from './routes/carrito.js';
import upload from './services/uploader.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { authMiddleware } from './services/auth.js';
import __dirname from './utils.js';
import { products } from './daos/index.js';

//EXPRESS
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
})
server.on('error', (error) => console.log(`Error en el servidor: ${error}`));

//ADMIN
const admin = true;

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use(upload.single('thumbnail'));
app.use((req, res, next) => {
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})

//ROUTER
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);

//ENGINE
app.engine('handlebars', engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//WEBSOCKET
export const io = new Server(server);

io.on('connection', async socket => {
    console.log(`El socket ${socket.id} se ha conectado.`);
    let productos = await products.getAll();
    socket.emit('updateProducts', productos);
})

//RUTAS
app.get('/', (req, res) => {
    res.send(`<h1 style="color:green;font-family:Georgia, serif">Bienvenidos al servidor express de Stefi</h1>`);
})

app.get('/views/productos', (req, res) => {
    products.getAll().then(result => {
        let info = result.lista;
        let prepObj = {
            productos: info
        }
        res.render('productos', prepObj)
    })
})