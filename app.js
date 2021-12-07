const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

class MessageService {
    constructor() {
        this.messages = []
    }
    
    async find() {
        return this.messages;
    }
    
    async create(data) {
        const message = {
            id: this.messages.length,
            text: data.text
        };
        this.messages.push(message);
        return message;
    }
}

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname));

app.configure(express.rest)
app.configure(socketio)

app.use('messages', new MessageService());

app.service('messages').on('created', (message) => {
    console.log('A new message has been created', message)
})

const main = async () => {
    await app.service('messages').create({
        text: 'Hello Feathers'
    });

    await app.service('messages').create({
        text: 'Hello Again'
    });

    const messages = await app.service('messages').find();
    console.log('All Messages', messages);
}

main();


