import Author from "../daos/chat/authors.js";
import GenericQueries from './genericQueries.js';

export default class AuthorService extends GenericQueries {
    constructor(dao) {
        super(dao, Author.model);
    }
    async findByAlias(alias) {
        return this.dao.findOne({alias}, Author.model);
    }
}