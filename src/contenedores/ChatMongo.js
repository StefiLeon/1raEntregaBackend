import mongoose from 'mongoose';
import config from '../config.js';
import Author from '../daos/chat/authors.js';
import Message from '../daos/chat/messages.js';

export default class Chat {
    constructor() {
        mongoose.connect(config.mongoDB.baseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            process.exit();
        })
        
        const timestamp = {timestamps:{createdAt:'created_at', updatedAt:'updated_at'}};
        const AuthorSchema = mongoose.Schema(Author.schema, timestamp);

        const MessageSchema = mongoose.Schema(Message.schema, timestamp);
        MessageSchema.pre('find', function(){
            this.populate('author');
        })

        this.models = {
            [Author.model]: mongoose.model(Author.model, AuthorSchema),
            [Message.model]: mongoose.model(Message.model, MessageSchema)
        }
    }

    async get(params, entity) {
        if(!this.models[entity]) throw new Error(`Entidad ${entity} no encontrada.`);
        return this.models[entity.findOne(params)];
    }

    async getAll(params, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        let results = await this.models[entity].find(params);
        return results.map(i => i);
    }

    async findOne(params, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        let result = await this.models[entity].findOne(params);
        return result ? result.toObject() : null;
    }

    async findAll(params, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        let results = await this.models[entity].find(params);
        return results.map(i => i.toObject());
    }

    async insert(params, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        try {
            let instance = new this.models[entity](params);
            let result = await instance.save();
            return result ? result.toObject() : null;
        } catch(err){
            console.log(err);
            return null;
        }
    }

    async delete(id, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        let result = await this.models[entity].findByIdAndDelete(id);
        return result ? result.toObject() : null;
    }

    async exists (params, entity) {
        if(!this.models[entity]) throw new Error (`Entidad ${entity} no encontrada.`);
        return this.models[entity].exists(params);5
    }
}