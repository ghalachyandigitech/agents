import {Create} from "./Create.js";
import MouseState from "./MouseState.js";
import Chat from "./Chat.js";

export default class App{
    constructor(io, userId, baseUrl){
        this.io = io;
        this.chats = {};
        this.userId = userId;
        this.messageFlag = 0;
        this.requestFlag = 0;
        this.usersChats = {};
        this.getChatId = '';
        this.partnerFile = 0;
        this.chatRequests = new Set();
        this.statusList = document.querySelector('#status-list');
        this.agentsList = document.querySelector('#agents-list');
        this.requestsCount = document.querySelector('#chats_get');
        this.chatsWindow = document.querySelector('#chats');
        this.status = {2: 'grey', 3: 'brown', 4: 'green'};
        this.messageNotification = null;

        Create.setWidget(userId, baseUrl);
    }

    userUpdate(agent, agents, partnerFile){
        this.partnerFile = partnerFile;
        this.messageFlag = agent.messageFlag;
        this.requestFlag = agent.requestFlag;

        this.statusList.querySelector(`option[value="${agent.status}"]`).selected = true;


        console.log(agents);

        this.agentsList.innerHTML = '';
        agents.forEach(agent => this.agentsStatus(agent._id, agent.status, agent.name));

        agent.requests.forEach(chatId => this.chatRequests.add(chatId));
        this.updateRequestsCount();
    }

    updateRequestsCount(){
        this.requestsCount.innerHTML = this.chatRequests.size ? this.chatRequests.size: '';
    }

    newLog(chatId, message, userId, name){
        if(!this.chats[chatId]) return;

        this.chats[chatId].setLogUser(userId, name);
        this.new(message, '', chatId);
    }

    new(message, hasId, chatId){
        if(this.chats[chatId].new(message, hasId) && document.hidden && this.messageFlag){
            if(!this.messageNotification || this.messageNotification.timestamp + 20000 < Date.now())
                this.messageNotification = new Notification('New message');
        }
    }

    endChat(chatId, date){
        if(!this.chats[chatId]) return;

        if(this.chats[chatId].internal) return this.deleteChat(chatId);

        this.chats[chatId].messaging.setFile(this.partnerFile === 2);

        this.chats[chatId].ending(date);
    }

    agentsStatus(userId, status, name){
        if(userId !== this.userId){
            let agent = this.agentsList.querySelector(`[data-id="${userId}"]`);

            if(agent && status < 2) return agent.remove();

            if(!agent) agent = Create.agent(userId, name);
            agent.querySelector(`span`).style.backgroundColor = this.status[status];

            this.agentsList.append(agent);
        }
    }

    getChat(){
        if(this.getChatId) return;

        this.getChatId = this.chatRequests.keys().next().value;
        this.io.emit('chats.get', this.getChatId)
    }

    setChatRequest(chatId){
        this.chatRequests.add(chatId);
        this.updateRequestsCount();

        if(document.hidden && this.requestFlag) new Notification('New incoming');
    }

    deleteChatRequest(chatId){
        if(this.getChatId === chatId) this.getChatId = '';

        this.chatRequests.delete(chatId);
        this.updateRequestsCount();
    }

    create(args){
        const [chat] = args;
        if(this.getChatId === chat._id){
            this.getChatId = '';
            this.chatRequests.delete(chat._id);
            this.updateRequestsCount();
        }

        if(!this.chats[chat._id]){
            const userChat = this.chats[this.usersChats[chat.companion._id]];
            if(userChat) this.chats[chat._id] = userChat;
            else this.chats[chat._id] = this.createChat(chat._id, chat.companion._id, chat.status);
        }

        this.usersChats[chat.companion._id] = chat._id;
        this.chats[chat._id].recover(...args);
    }

    deleteChat(chatId){
        clearInterval(this.chats[chatId].timeInterval);
        this.chats[chatId].window.remove();

        delete this.usersChats[this.chats[chatId].companionUserId];
        delete this.chats[chatId];
    }

    createChat(chatId, companionUserId, status){
        const mouseState = new MouseState();
        const chat = new Chat(this.io, this.userId, status === 4, companionUserId, this.partnerFile);

        mouseState.addMapping('scroll', () => {
            chat.scroll();
        });
        mouseState.addMapping('message', () => {
            chat.message();
        });
        mouseState.addMapping('open', () => {
            chat.open();
        });
        mouseState.addMapping('permissions-file', () => {
            this.io.emit('permission.file', chat._id);
        });
        mouseState.addMapping('transfer', () => {
            chat.transferSet();
        });
        mouseState.addMapping('chat-end', () => {
            this.deleteChat(chat._id);
            chat.end();
        });

        mouseState.buttonsListenTo(chat.window);
        mouseState.scrollListenTo(chat.messages);

        this.chatsWindow.append(chat.window);

        return chat;
    }
}