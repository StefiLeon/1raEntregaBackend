//IMPORTS
import express from 'express';
import cors from 'cors';
import productosRouter from './routes/productos.js';
import carritoRouter from './routes/carrito.js';
import upload from './services/uploader.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname, { normalizedMessages } from './utils.js';
import { messageService, authorService } from './services/servicesChat.js';
import { products } from './daos/index.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';

//EXPRESS
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
})
server.on('error', (error) => console.log(`Error en el servidor: ${error}`));

//ADMIN
const admin = true;

//SESSION
const baseSession = (session({
    store:MongoStore.create({mongoUrl:'mongodb+srv://StefiLeon:Laion160191@ecommerce.uxagm.mongodb.net/sessions?retryWrites=true&w=majority'}),
    resave: false,
    saveUninitialized: false,
    secret: '$73f!'
}))

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
app.use(baseSession);
export const io = new Server(server);
io.use(ios(baseSession));

//ROUTER
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);

//ENGINE
app.engine('handlebars', engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//WEBSOCKET

io.on('connection', async socket => {
    console.log(`El socket ${socket.id} se ha conectado.`);
    let productos = await products.getAll();
    socket.emit('updateProducts', productos);
})

io.on('connection', async socket => {
    socket.broadcast.emit('thirdConnection', `Alguien se ha unido al chat.`)
    socket.on('message', async data => {
        const author = await authorService.findByAlias(socket.handshake.session.author.alias)
        let message = {
            author: author._id,
            text: data.message
        }
        await messageService.save(message);
        const messages = await messageService.getAll();
        const objectToNormalize = await messageService.normalizeData();
        const normalizedData = normalizedMessages(objectToNormalize);
        console.log(JSON.stringify(normalizedData, null, 2))
        io.emit('log', normalizedData);
    })
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

//Ver usuario actual
app.get('/usuarioActual', (req, res) => {
    res.send(req.session.user);
} )

//Registro de usuario/autor
app.post('/pages/register.html', async (req, res) => {
    let author = req.body;
    let result = await authorService.save(author);
    res.send({message:'Usuario creado.', author: result})
})

//Login de usuario/autor
app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    if(!email||!password) return res.status(400).send({error:"Campos incompleto.s"});
    const author = await authorService.getBy({email:email});
    if(!author) return res.status(404).send({error:"Usuario no encontrado."});
    req.session.author = {
        alias: author.alias,
        email: author.email
    }
    res.send({status: "Logueado."})
})