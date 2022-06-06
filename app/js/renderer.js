const { ipcRenderer } = require('electron');
let btnSubmit = document.getElementById('btn-submit');
let nickname = document.querySelector('input[name="nickname"]');

btnSubmit.addEventListener('click', event=>{
    if(nickname.value) ipcRenderer.send('change-page', nickname.value);
});