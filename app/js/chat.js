const { ipcRenderer } = require('electron');
let socket;
let btnSend = document.querySelector(".btn[type='submit']");
let targetMessage = document.querySelector("input[name='message']");
let listOfMessages = document.getElementsByClassName("list-of-messages")[0];

const sendMessage = (event)=>{
    event.preventDefault();
    if(!getText()) return false;
    createElementHTML(myNickname, "align-row-right", moment().format("HH:mm"));
    toPositionFinishScroll();
    socket.emit("new-message", getText());
    targetMessage.value = "";
}

const toPositionFinishScroll = ()=>{
    listOfMessages.scrollTop = listOfMessages.scrollHeight;
}

btnSend.addEventListener("click", (event)=>{
    sendMessage(event);
});

targetMessage.addEventListener("keyup", (event)=>{
    if((event.which || event.keyCode) === 13) sendMessage(event);
});

const isToPositionFinishScroll = ()=>{
    return listOfMessages.scrollTop >= (listOfMessages.scrollHeight - 1000);
}

const getText = ()=>{
    return targetMessage.value;
}

const createElementHTML = (author, classList, time = timeCurrent, text = getText())=>{

    let div = document.createElement('div');

    div.classList.add(classList);

    div.innerHTML = `
        <div class="message ${classList==='align-row-right' ? 'my-message' : 'outher-message'}">
            <p class="author">${author}</p>
            <div class="text-message">
                ${text}
            </div>
            <p class="time">${time}</p>
        </div>
    `;

    document.querySelector(".list-of-messages").appendChild(div);

}

new Promise((resolve)=>{
    ipcRenderer.send('get-nickname');
    ipcRenderer.on('get-nickname', (event, nickname)=>resolve(nickname));
})
    .then(myNickname=>{
        socket = io('https://sala-de-bate-papo.herokuapp.com', {query: `nickname=${myNickname}`});
        socket.emit("get-messages", data=>{
            data.forEach(message=>createElementHTML(message.nickname, message.nickname === myNickname ? "align-row-right" : "align-row-left", moment(message.createdAt).format("HH:mm"), message.message));
            toPositionFinishScroll();
        });

        socket.on("new-message", data=>{

            createElementHTML(data.nickname, "align-row-left", moment(data.createdAt).format("HH:mm"), data.message);
            
            if(isToPositionFinishScroll()) toPositionFinishScroll();
        });

        socket.on("new-participant", data=>{
            let h4 = document.createElement('h4');

            new Notification('Sala de Bate-Papo',{
                body: `${data.nickname} entrou na sala!`
            });

            h4.classList.add("title");

            h4.innerHTML = `${data.nickname} entrou na sala`;

            document.querySelector(".list-of-messages").appendChild(h4);

            if(isToPositionFinishScroll()) toPositionFinishScroll();

        });

        socket.on("participant-exited", data=>{
            let h4 = document.createElement('h4');

            new Notification('Sala de Bate-Papo',{
                body: `${data.nickname} saiu da sala!`
            });

            h4.classList.add("title");

            h4.innerHTML = `${data.nickname} saiu da sala`;

            document.querySelector(".list-of-messages").appendChild(h4);

            if(isToPositionFinishScroll()) toPositionFinishScroll();

        });

    });

        

        