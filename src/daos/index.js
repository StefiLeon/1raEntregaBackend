let products;
let carts;
let authors;
let messages;
let persistence = 'mongoDB';

switch(persistence) {
    case "fileSystem":
        const {default: ProductsFileSystem} = await import('./productos/productosFileSystem.js');
        const {default: CarritoFileSystem} = await import('./carritos/carritosFileSystem.js');

        products = new ProductsFileSystem();
        carts = new CarritoFileSystem();
        break;
    case 'mongoDB':
        const {default:ProductsMongo} = await import('./productos/productosMongoDB.js');
        const {default:CarritoMongoDB} = await import('./carritos/carritosMongoDB.js');
        const {default:AuthorsMongoDB} = await import('./chat/authors.js');
        const {default:MessagesMongoDB} = await import('./chat/messages.js');

        products = new ProductsMongo();
        carts = new CarritoMongoDB();
        authors = new AuthorsMongoDB();
        messages = new MessagesMongoDB();
        break;
    case 'firebase':
        const {default:ProductsFirebase} = await import ('./productos/productosFirebase.js');
        const {default:CarritoFirebase} = await import ('./carritos/carritosFirebase.js');

        products = new ProductsFirebase();
        carts = new CarritoFirebase();
    default:
}

export {carts, products}