import './Message.css';
import React, { useState} from "react";
import like from '../../../icons/like.png';
import thumbdown from '../../../icons/thumb-down.png';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  const [likeCounter, setlikeCounter] = useState(0);
  const [unlikeCounter, setunlikeCounter] = useState(0);
  let isSentByCurrentUser = false;
  
  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
          
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

export default Message;


{/* 
  <div onClick={() => setunlikeCounter(unlikeCounter + 1)} key={name} className="activeItem">
    {unlikeCounter}
    <img alt="Online Icon" src={like}/>
  </div>
  <div onClick={() => setlikeCounter(likeCounter + 1)} key={name} className="activeItem">
    {likeCounter}
    <img alt="Online Icon" src={thumbdown}/>
  </div> 
*/}
          