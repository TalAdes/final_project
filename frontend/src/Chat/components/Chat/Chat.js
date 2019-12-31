import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Auth from "../../../Auth";

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
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const ENDPOINT = 'https://project-chat-application.herokuapp.com/';
  const ENDPOINT = '/';



  //this function verify if you have permission to enter this chat or not
  useEffect(() => {
    Auth.amIHaveRoomPermissions(props.roomID , permission => {
      permission = permission.data
      if (!permission.havePermission) {
        alert(permission.message)
        props.history.push("/chat");
      }
    });

    //at this moment this user is in thr chat, noe i need to show all the beuty

    socket = io(ENDPOINT);

    //emitting to server that this guy enter to chat room
    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, props.location.search,props.history,name,room,props.roomID]);

  useEffect(() => {
//message hs this structure: message = {text,sender}
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })
// i think that we dont need <[messages]> beacause this is the only place which messages can be changed
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>socket<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
      console.log(socket.id);
    }
  }

  
  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar props = {props} room={room}/>
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

// export default Chat;
export default withRouter(connect(mapStateToProps)(Chat));
