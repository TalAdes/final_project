import './Message.css';
import React from "react";
// import like from '../../../icons/like.png';
// import thumbdown from '../../../icons/thumb-down.png';

import ReactEmoji from 'react-emoji';

const Message = ({message: { text, user }, userName}) => {
  // console.log('********************************i am in message');
  
  // console.log('message');
  // console.log(message);
  
  // console.log('sender');
  // console.log(sender);
  
  // console.log('userName');
  // console.log(userName);
  
  let isSentByCurrentUser = false;

  if(user === userName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{userName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>

        </div>
        )
        :
        (
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
  const [likeCounter, setlikeCounter] = useState(0);
  const [unlikeCounter, setunlikeCounter] = useState(0);

  <div onClick={() => setunlikeCounter(unlikeCounter + 1)} key={name} className="activeItem">
    {unlikeCounter}
    <img alt="Online Icon" src={like}/>
  </div>
  <div onClick={() => setlikeCounter(likeCounter + 1)} key={name} className="activeItem">
    {likeCounter}
    <img alt="Online Icon" src={thumbdown}/>
  </div>
*/}
