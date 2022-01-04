import Schema from "mongoose";
import MongoContainer from "../../contenedores/MongoDBContainer.js";

export default class CarritoMongoDB extends MongoContainer {
    constructor(){
        super(
            'carritos',
            {
                email:{type:String, required:true, unique:true},
                products:{
                    type: [{
                        type: Schema.Types.ObjectId,
                        ref: 'products'
                    }],
                    default: []
                }
            }, {timestamps: true}
        )
    }
}