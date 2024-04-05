let __userId = '';
const __baseUrl = '';
const __images = ['jpg', 'jpeg', 'png', 'PNG', 'JPEG'];
const __videos = ['mp4'];
const __timeOptions = ['en-US', {second: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false}];

export const __labels = {
    ['button-disable-file']: 'Attach disable',
    ['button-enable-file']: 'Attach enable',
};

export class Create{
    static setWidget(userId, baseUrl){
        __userId = userId
    }

    static window(){
        const window = document.createElement('div');
        window.classList.add('chat-window');
        window.classList.add('chat-window');

        return window;
    }

    static widgetName(){
        const div = document.createElement('div');
        div.style.marginLeft = '5px';
        div.style.marginTop = '12px';

        return div;
    }

    static endButton(){
        const span = document.createElement('span');
        span.classList.add('chat-end');
        span.innerHTML = '&#x2715;';
        span.dataset.name = 'chat-end';

        return span;
    }

    static agent(_id, name){
        const div = document.createElement('div');
        div.innerText = name;
        div.dataset.name = 'internal';
        div.dataset.id = _id;
        div._id = _id; //todo kareli a jnjel
        div.style.border = '1px solid';
        div.style.cursor = 'pointer';

        const status = document.createElement('span');
        status.classList.add('status');

        div.append(status);

        return div;
    }

    static controller(){
        const div = document.createElement('div');
        div.style.width = '566px';
        div.style.height = '165px';
        div.style.backgroundColor = 'burlywood';
        div.style.float = 'left';
        div.style.border = '5px outset';

        return div;
    }

    static messagingWindow(){
        const div = document.createElement('div');
        div.style.float = 'left';
        div.style.padding = '15px';
        div.style.height = '135px';
        div.style.backgroundColor = 'burlywood';
        div.style.border = '5px outset';
        div.style.width = '334px';

        return div;
    }

    static statusLoader(){
        const status = document.createElement('span');
        status.classList.add('name-loader');

        return status;
    }

    static unread(){
        const span = document.createElement('span');
        span.style.backgroundColor = 'green';
        span.style.borderRadius = '50%';
        span.style.width = '25px';
        span.style.height = '25px';
        span.style.textAlign = 'center';
        span.style.margin = '10px';

        return span;
    }

    static time(){
        const div = document.createElement('div');

        div.style.width = '55px';
        div.style.textAlign = 'center';
        div.style.padding = '3px';
        div.style.border = '1px solid';

        return div;
    }

    static transfer(){
        const button = document.createElement('button');
        button.dataset.name = 'transfer';
        button.innerText = 'Transfer';

        return button;
    }

    static permissionsFile(){
        const button = document.createElement('button');
        button.innerText = 'permissions-file';
        button.dataset.name = 'permissions-file';

        return button;
    }

    static body(){
        const body = document.createElement('div');
        body.classList.add('chat-body');

        return body;
    }

    static fileInput(){
        const input = document.createElement('input');
        input.type = 'file';

        return input;
    }

    static header(){
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.backgroundColor = 'burlywood';
        header.style.border = '5px outset';
        header.style.height = '50px';

        header.dataset.name = 'open';

        return header;
    }

    static status(){
        const status = document.createElement('span');
        status.classList.add('status');

        return status;
    }

    static send(){
        const send = document.createElement('button');
        send.innerText = 'Send';
        send.style.display = 'block';
        send.dataset.name = 'message';

        return send;
    }

    static loader(){
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message');

        const loadingImg = document.createElement('img');
        loadingImg.src = 'http://localhost:9026/chat-loading.gif';
        loadingImg.style.width = '100px';
        loadingImg.style.position = 'relative';
        loadingImg.style.left = '105px';

        loadingMessage.append(loadingImg);

        return loadingMessage;
    }

    static textArea(){
        const textArea = document.createElement('textarea');
        textArea.cols = 40;
        textArea.rows = 4;
        textArea.style.resize = 'none';
        textArea.style.width = '327px';

        return textArea;
    }

    static file(file){
        let src;
        let type;
        let fileType;
        const fileBlock = document.createElement('div');

        if(typeof file === 'object'){
            src = URL.createObjectURL(file);
            [,type] = file.type.split('/');
        }else{
            const split = file.split('.');
            type = split[split.length-1];
            src = file;
        }

        if(__images.includes(type)){
            fileType = document.createElement('img');
        }else if(__videos.includes(type)){
            fileType = document.createElement('video');
            fileType.controls = 'controls';
        }else{
            return '';
        }

        fileType.style.width = '150px';
        fileType.src = src;

        fileBlock.append(fileType);

        return fileBlock;
    }

    static message(message, chatMessage, unread, logUsers) {
        const block = document.createElement('div');
        block.classList.add('message');
        block.id = `i${message[0]}`;

        if (unread) block.classList.add('unread');
        if (!message[1]){
            const [id, action] = message[2].split('_');
            message[2] = id === __userId ? `You ${action}`: logUsers[id] + ' ' + action;

            block.style.alignItems = 'center';
        }
        else block.style.alignItems = chatMessage ? 'end' : 'start';

        const div = document.createElement('div');
        div.classList.add('message-content');

        const span = document.createElement('span');
        span.innerText = message[2];

        div.append(span);

        const time = document.createElement('div');
        time.innerText = new Date(message[4]).toLocaleTimeString(...__timeOptions);
        time.classList.add('message-time');

        if (message[1]){
            const arrow = document.createElement('span');
            arrow.classList.add('message-content-arrow');
            arrow.style[!chatMessage ? 'left' : 'right'] = '-10px';

            div.append(span, arrow);
        }

        block.append(div, time);

        if(message[3]) div.append(Create.file(message[3]));

        return block;
    }

    static messages(){
        const messages = document.createElement('div');
        messages.classList.add('messages');
        messages.dataset.name = 'scroll';

        return messages;
    }
}