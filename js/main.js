import {io} from './client.js';
import MouseState from './MouseState.js';
import App from './App.js';

const baseUrl = 'localhost:9026';
// const baseUrl = '52.148.200.159:3000';
const userId = location.search.split('=')[1] || '6602966c26886becd70462f8';
const socket = io(`ws://${baseUrl}/658941de12cd6a8a644d5066`, {
    auth: {
        name: 'agent 1',
        role: 'agents',
        userId: userId,
    }
});

const mouseState = new MouseState();
const app = new App(socket, userId, baseUrl);

document.querySelector('#status-list').addEventListener('change', (e) => {
    socket.emit('agents.update.status', e.target.value);
});
mouseState.addMapping('logout', () => {
    socket.emit('logout');
});
mouseState.addMapping('internal', (target) => {
    socket.emit('chats.internal.set', target._id);
});
mouseState.addMapping('chats-get', () => {
    app.getChat();
});
socket.on('disconnect',() => {
    for (const i in app.chats) app.chats[i].connected = 0;

    app.chatRequests.clear();
});
socket.on('user.update', ([agent, agents, partnerFile]) => {
    app.userUpdate(agent, agents, partnerFile);
});
socket.on('agents.update.status', ([userId, status, name]) => {
    app.agentsStatus(userId, status, name);
});
socket.on('chats.manual.set', chatId => {
    app.setChatRequest(chatId);
});
socket.on('chats.manual.delete', (chatId) => {
    app.deleteChatRequest(chatId);
});
socket.on('chats.recover', (args) => {
    app.create(args);
});
socket.on('chats.end', ([chatId, date]) => {
    app.endChat(chatId, date);
});
socket.on('chats.delete', (chatId) => {
    app.deleteChat(chatId);
});
socket.on('message.new.log', ([chatId, message, userId, name]) => {
    app.newLog(chatId, message, userId, name);
});
socket.on('chats.status', ([name, userId, chatId, companionCreated]) => {
    app.chats[chatId].setStatus(name, userId, companionCreated);
});
socket.on('message.read', ([userId, chatId]) => {
    app.chats[chatId].setRead(userId);
});
socket.on('message.page', ([messages, ended, chatId]) => {
    app.chats[chatId].page(messages, ended);
});
socket.on('message.new', ([message, hasId, chatId]) => {
    app.new(message, hasId, chatId);
});
socket.on('permission.file', ([status, chatId]) => {
    app.chats[chatId].messaging.setFile(status);
});

mouseState.buttonsListenTo(document.querySelector('#window'));
