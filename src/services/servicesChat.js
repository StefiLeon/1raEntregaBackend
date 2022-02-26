import Chat from '../contenedores/ChatMongo.js';
import AuthorService from './authorServices.js';
import MessageService from './messageServices.js';

const dao = new Chat();

export const authorService = new AuthorService(dao);
export const messageService = new MessageService(dao);