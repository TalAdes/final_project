import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import loadMore from '../../icons/load more.png';
import Message from './Message/Message';
import './Messages.css';

const Messages = ({ socket, counter, setCounter, messages, name }) => (
  <ScrollToBottom className="messages">
  {/* message has this structure: message = {text,sender}
  Array.map(itme,i,j) has this struucture: 'item' is the item which we iterate on, 'i' is the index, 'j' is all the array */}
    {
    messages.map((message,i) => {
      if (i === 0) {
        return <div key={i}>
          <label>
            <img src={loadMore} title="load more messages" alt='' color='#3B5998' size='10x' 
            onClick= {() => socket.emit('i want more',{counter : counter+1},()=>setCounter(ps=>ps+1))}/>
          </label>
          <Message message={message} userName={name}/>
        </div>
      } else {
        return <div key={i}><Message message={message} userName={name}/></div>
      }
    })}
  </ScrollToBottom>
);

export default Messages;
