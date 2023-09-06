`use strict`;

const $ = (id) => document.getElementById(id);
const $$ = (query) => document.querySelector(query);
const $$$ = (jquery) => document.querySelectorAll(jquery);

  /* CHAT */

  class Chatroom {
    constructor(room, username){
      this.room = room;
      this.username = username;
      this.chats = db.collection('chats');
      this.unsub;
    }
    async addChat(message){
      // format a chat object
      const now = new Date();
      const chat = {
        message: message,
        username: this.username,
        room: this.room,
        created_at: firebase.firestore.Timestamp.fromDate(now)
      };
      // save the chat document
      const response = await this.chats.add(chat);
      return response;
    }
    getChats(callback){
      this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if(change.type === 'added'){
              callback(change.doc.data());
            }
          });
      });
    }
    updateName(username){
      this.username = username;
      localStorage.username = username;
    }
    updateRoom(room){
      this.room = room;
      console.log('room updated');
      if(this.unsub){
        this.unsub();
      }
    }
  }

  /* UI */

  class ChatUI {
    constructor(list){
      this.list = list;
    }
    clear(){
      this.list.innerHTML = '';
    }
    render(data){
      const when = dateFns.distanceInWordsToNow(
        data.created_at.toDate(),
        { addSuffix:true }
      );
      const html = `
        <li class="list-group-item">
          <span class="username">${data.username}</span>
          <span class="message">${data.message}</span>
          <div class="time">${when}</span>
        </li>
      `;
      this.list.innerHTML += html;
    }
  }

  /* APP */

// dom queries
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');

// add a new chat
newChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = newChatForm.message.value.trim();
  chatroom.addChat(message)
    .then(() => newChatForm.reset())
    .catch(err => console.log(err));
});

// update the username
newNameForm.addEventListener('submit', e => {
  e.preventDefault();
  // update name via chatroom
  const newName = newNameForm.name.value.trim();
  chatroom.updateName(newName);
  // reset the form
  newNameForm.reset();
  // show then hide the update message
  updateMssg.innerText = `Your name was updated to ${newName}`;
  setTimeout(() => updateMssg.innerText = '', 3000);
});

// update the chat room
rooms.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON'){
    chatUI.clear();
    chatroom.updateRoom(e.target.getAttribute('id'));
    chatroom.getChats(chat => chatUI.render(chat));
  }
});

// check local storage for name
const username = localStorage.username ? localStorage.username : 'anon';

// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('gaming', username);

// get chats & render
chatroom.getChats(data => chatUI.render(data));