//jshint esversion: 6
import React, { Component } from "react";
import Chatkit from "@pusher/chatkit-client";
import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";


import { tokenUrl, instanceLocator, userId } from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    const tokenProvider = new Chatkit.TokenProvider({
      url: tokenUrl
    });
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: userId,
      tokenProvider: tokenProvider
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(err => {
        console.error("error on connecting: ", err);
      });
  }

  getRooms() {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        });
      })
      .catch(err => console.log("error on joinableRooms: ", err));
  }

  subscribeToRoom(roomId) {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoomMultipart({
        roomId: roomId,
        hooks: {
          onMessage: message => {
            console.log("Received message:", message.parts[0].payload.content);
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });
        this.getRooms();
      })
      .catch(err => console.log("error on sbscribing to a room: ", err));
  }
  sendMessage(text) {
    this.currentUser.sendSimpleMessage({
      text: text,
      roomId: this.state.roomId
    });
  }
  createRoom(name){
    console.log("Room name: ", name)
    this.currentUser.createRoom({
      name: name

    })
    .then(room =>this.subscribeToRoom(room.id))
    .catch(err => console.log("Error on subscribing to a new room: ", err))
  }
  render() {
    console.log("This.state.messages: ", this.state.messages);
    return (
      <div className="app">
        <RoomList
          roomId={this.state.roomId}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          subscribeToRoom={this.subscribeToRoom}
        />
        <MessageList roomId ={this.state.roomId} messages={this.state.messages} />
        <SendMessageForm disabled={!this.state.roomId} sendMessage={this.sendMessage} />
        <NewRoomForm createRoom = {this.createRoom}/>
      </div>
    );
  }
}
export default App;
