"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var $ = function (id) { return document.getElementById(id); };
var $$ = function (query) { return document.querySelector(query); };
var $$$ = function (jquery) { return document.querySelectorAll(jquery); };
/* CHAT */
var Chatroom = /** @class */ (function () {
    function Chatroom(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    Chatroom.prototype.addChat = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var now, chat, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        chat = {
                            message: message,
                            username: this.username,
                            room: this.room,
                            created_at: firebase.firestore.Timestamp.fromDate(now)
                        };
                        return [4 /*yield*/, this.chats.add(chat)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Chatroom.prototype.getChats = function (callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    callback(change.doc.data());
                }
            });
        });
    };
    Chatroom.prototype.updateName = function (username) {
        this.username = username;
        localStorage.username = username;
    };
    Chatroom.prototype.updateRoom = function (room) {
        this.room = room;
        console.log('room updated');
        if (this.unsub) {
            this.unsub();
        }
    };
    return Chatroom;
}());
/* UI */
var ChatUI = /** @class */ (function () {
    function ChatUI(list) {
        this.list = list;
    }
    ChatUI.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    ChatUI.prototype.render = function (data) {
        var when = dateFns.distanceInWordsToNow(data.created_at.toDate(), { addSuffix: true });
        var html = "\n        <li class=\"list-group-item\">\n          <span class=\"username\">".concat(data.username, "</span>\n          <span class=\"message\">").concat(data.message, "</span>\n          <div class=\"time\">").concat(when, "</span>\n        </li>\n      ");
        this.list.innerHTML += html;
    };
    return ChatUI;
}());
/* APP */
// dom queries
var chatList = document.querySelector('.chat-list');
var newChatForm = document.querySelector('.new-chat');
var newNameForm = document.querySelector('.new-name');
var updateMssg = document.querySelector('.update-mssg');
var rooms = document.querySelector('.chat-rooms');
// add a new chat
newChatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var message = newChatForm.message.value.trim();
    chatroom.addChat(message)
        .then(function () { return newChatForm.reset(); })
        .catch(function (err) { return console.log(err); });
});
// update the username
newNameForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // update name via chatroom
    var newName = newNameForm.name.value.trim();
    chatroom.updateName(newName);
    // reset the form
    newNameForm.reset();
    // show then hide the update message
    updateMssg.innerText = "Your name was updated to ".concat(newName);
    setTimeout(function () { return updateMssg.innerText = ''; }, 3000);
});
// update the chat room
rooms.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        chatUI.clear();
        chatroom.updateRoom(e.target.getAttribute('id'));
        chatroom.getChats(function (chat) { return chatUI.render(chat); });
    }
});
// check local storage for name
var username = localStorage.username ? localStorage.username : 'anon';
// class instances
var chatUI = new ChatUI(chatList);
var chatroom = new Chatroom('gaming', username);
// get chats & render
chatroom.getChats(function (data) { return chatUI.render(data); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLElBQU0sQ0FBQyxHQUFHLFVBQUMsRUFBRSxJQUFLLE9BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztBQUM5QyxJQUFNLEVBQUUsR0FBRyxVQUFDLEtBQUssSUFBSyxPQUFBLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQTdCLENBQTZCLENBQUM7QUFDcEQsSUFBTSxHQUFHLEdBQUcsVUFBQyxNQUFNLElBQUssT0FBQSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQWpDLENBQWlDLENBQUM7QUFFeEQsVUFBVTtBQUVWO0lBQ0Usa0JBQVksSUFBSSxFQUFFLFFBQVE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDYixDQUFDO0lBQ0ssMEJBQU8sR0FBYixVQUFjLE9BQU87Ozs7Ozt3QkFFYixHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3QkFDakIsSUFBSSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7NEJBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTs0QkFDZixVQUFVLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQzt5QkFDdkQsQ0FBQzt3QkFFZSxxQkFBTSxJQUFJLENBQUMsS0FBSyxDQUFD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