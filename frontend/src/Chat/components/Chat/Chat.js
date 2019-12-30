import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = (props) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const ENDPOINT = 'https://project-chat-application.herokuapp.com/';
  const ENDPOINT = '/';

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search);

    socket = io(ENDPOINT);

      // socket = io(ENDPOINT,{
      //   transports: ['websocket']
      //   });
  

    setRoom(room);
    setName(name)
    if(name && room){
      socket.emit('join', { name, room }, (error) => {
        if(error) {
          alert(error);
        }
      });
    }else {
      props.history.push("/");
    }


  }, [ENDPOINT, props.location.search,props.history]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })
    
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          {/* <InfoBar props = {props} room={room} /> */}
          <InfoBar props = {props} room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

// export default Chat;
export default withRouter(connect()(Chat));
