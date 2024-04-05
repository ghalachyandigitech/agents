import {Create} from './Create.js';

export default class Messaging{
    constructor(userId, companionUserId, file, logUsers){
        this.userId = userId;
        this.fileStatus = file;
        this.companionUserId = companionUserId;
        this.companionUnread = new Set();
        this.logUsers = logUsers;


        console.log(logUsers);

        this.window = Create.messagingWindow();
        this.send = Create.send();
        this.textArea = Create.textArea();
        this.file = Create.fileInput();

        this.textArea.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && !e.shiftKey){e.preventDefault(); this.send.click();}
        });

        this.window.append(this.textArea, this.send);
        if(file) this.window.append(this.file);
    }

    has(){
        return this.textArea.value.length || (this.fileStatus && this.file.files[0]);
    }

    create(message){
        return Create.message(
            message,
            this.companionUserId !== message[1],
            this.companionUnread.has(message[0]),
            this.logUsers
        );
    }

    get(){
        const message = [
            this.userId,
            this.textArea.value,
            this.getFileInput()
        ];

        this.file.value = '';
        this.textArea.value = '';

        return message;
    }

    getFileInput(){
        if(!this.fileStatus || !this.file.files[0])
            return ['', ''];

        return [this.file.files[0].type, this.file.files[0]];
    }

    setFile(file){
        this.fileStatus = file;
        if(file) return this.window.append(this.file);

        this.file.value = '';
        this.file.remove();
    }
}