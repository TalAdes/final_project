import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Auth from "../../../Auth";
import Api from "../../../Api";

import './Chat.css';

let socket;


const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    roomID: state.roomID
  };
};

const Chat = (props) => {
  const [name] = useState(props.loggedInUser);
  const [room] = useState(props.roomID);
  const [chat, setChat] = useState({name:""});
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [counter, setCounter] = useState(1);
  // const ENDPOINT = 'https://project-chat-application.herokuapp.com/';
  const ENDPOINT = '/';



  //this function verify if you have permission to enter this chat or not
  useEffect(() => {
    console.log('amIHaveRoomPermissions is called');
    Auth.amIHaveRoomPermissions(props.roomID , permission => {
      permission = permission.data
      if (!permission.havePermission) {
        alert(permission.message)
        props.history.push("/chat");
      }
    });

    Api.getChatByID(props.roomID).then(data =>{
      setChat(data.data[0])
    })

    //at this moment this user is in thr chat, noe i need to show all the beuty

    socket = io(ENDPOINT);

    //emitting to server that this guy enter to chat room
    socket.emit('join', { name, room }, (error) => {
    console.log('join was emitted');

      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, props.location.search,props.history,name,room,props.roomID]);


  useEffect(() => {
//message hs this structure: message = {text,sender}
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
      console.log(`client - got message event
      \nmessage :${message.text}`);
    });


    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

    socket.on('reset', () => {
      setMessages([]);
    })


    return () => {
      socket.emit('disconnect');

      socket.off();
    }

// i think that we dont need <[messages]> beacause this is the only place which messages can be changed
  },[messages])

  const _sendMessage = (event) => {
    event.preventDefault();
    console.log('_sendMessage');
    if(message) {
      console.log('_sendMessage for real');
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }


  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar props = {props} room={chat.name}/>
          <Messages socket={socket} counter={counter} setCounter={setCounter} messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={_sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

// export default Chat;
export default withRouter(connect(mapStateToProps)(Chat));
