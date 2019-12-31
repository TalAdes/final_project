import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name }) => (
  <ScrollToBottom className="messages">
  {/* message has this structure: message = {text,sender}
  Array.map(itme,i,j) has this struucture: 'item' is the item which we iterate on, 'i' is the index, 'j' is all the array */}
    {messages.map((message,i) => {
      console.log('i am in messages*****************************************');
      console.log('message');
      console.log(message);
      console.log('name');
      console.log(name);
    return <div key={i}><Message message={message.text} sender={message.user} userName={name}/></div>})}
  </ScrollToBottom>
);

export default Messages;
