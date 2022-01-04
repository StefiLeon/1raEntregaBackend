import __dirname from "./utils.js";

export default{
    fileSystem:{
        baseURL: __dirname+'/files/'
    },
    mongoDB: {
        baseURL: "mongodb+srv://StefiLeon:Laion160191@ecommerce.uxagm.mongodb.net/ecommerce?retryWrites=true&w=majority"
    },
    firebase: {
        baseURL: "https://ecommerce-leon.firebaseio.com"
    }
}