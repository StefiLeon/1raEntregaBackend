const socket = io();

//NORMALIZR
const authors = new normalizr.schema.Entity('authors', {}, {idAttribute:'_id'});
const messages = new normalizr.schema.Entity('messages',  {
    author: authors
}, {idAttribute:'_id'});
const parentObject = new normalizr.schema.Entity('parent', {
    messages: [messages]
})

//Recuperar usuario
let author;
fetch('/usuarioActual').then(i => i.json()).then(json => {
    author = json;
    console.log(author);
})

//Evento de input
let input = document.getElementById('message');
input.addEventListener('keyup', (e) => {
    if(e.key === "Enter") {
        if(e.target.value) {
            socket.emit('message', {message:e.target.value})
            e.target.value = "";
        }
    }
})

socket.on('message', data => {
    let p = document.getElementById('chatLog');
    let denormalizedData = normalizr.denormalize(data.result, parentObject, data.entities);
    console.log(denormalizedData);
    let messages = denormalizedData.messages.map(message => {
        return `<p><span>${message.author.alias} dice ${message.text}</span></p>`
    }).join(' ');
    p.innerHTML = messages;
})