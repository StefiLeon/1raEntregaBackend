import Schema from "mongoose";
import MongoContainer from "../../contenedores/MongoDBContainer.js";

export default class ProductsMongo extends MongoContainer{
    constructor() {
        super('products',
            {
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                code: {
                    type: Number,
                    required: true,
                    unique: true
                }, 
                price: {
                    type: Number,
                    required: true
                },
                stock: {
                    type: Number,
                    required: true
                },
                thumbnail: {
                    type: String,
                    required: true
                },
                cart: {
                    type:Schema.Types.ObjectId,
                    ref:'carritos',
                    default: null
                }
            }, {timestamps: true}
        )
    }
}