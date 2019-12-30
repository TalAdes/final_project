import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './ChatList.css';
import Button from "@material-ui/core/Button";
import Api from "../../../Api";
import Auth from "../../../Auth";


const mapStateToProps = state => {
  return {
    numberOfItemsInCart: state.cartItems.length,
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};

function leaveChat(props,id) {
  
  Auth.leaveChat(id , chat => {
    chat = chat.data
    if (chat.isLeavedSuccesfully) {
        alert(chat.message)
        props.history.push("/chat");
    } 
    else {
      alert(chat.message)
    }
  });

}

function joinChat(props,id) {
  
  Auth.joinChat(id , chat => {
    chat = chat.data
    if (chat.isJoinedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

function joinToCloseChat(props,id,token) {
  
  Auth.joinToCloseChat(id , token, chat => {
    chat = chat.data
    if (chat.isJoinedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

function sendRequestToJoinChat(props,id) {
  
  Auth.joinChat(id , chat => {
    chat = chat.data
    if (chat.isJoinedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

const ChatList = (props) => {
  const [chatsList, setChatsList] = useState([]);
  const [availableChatsList, setAvailableChatsList] = useState([]);
  const [availableChatsWithPasswordList, setAvailableChatsWithPasswordList] = useState([]);
  const [forceReload, setForceReload] = useState([]);
  const [token, setToken] = useState("");
  
  useEffect(() => {
    if(props.loggedInUserRole === 'admin'){
      props.history.push("/new_open_chat_requests");
    }
    else{
      Api.chatsList().then(data =>{
        setChatsList(data.data)
      })
      Api.otherChatsList().then(data =>{
        setAvailableChatsList(data.data)
      })
      Api.otherChatsWithPasswordList().then(data =>{
        setAvailableChatsWithPasswordList(data.data)
      })
    }
  },[props.history,props.loggedInUserRole,forceReload])



  return (
    <div>

    {
      chatsList.length === 0 && availableChatsList.length === 0  && availableChatsWithPasswordList.length === 0 ?
      (<div>
        <div className="table-wrapper">
          <div className="product-list-header">
            <div className="online-shop-title" style={{ flexGrow: 1 }}>
              There are no chats at all
            </div>
            <Button
                style={{ marginLeft: 20 }}
                variant="outlined"
                onClick={() => {
                props.history.push("/CreateNewChat");
                }}
              >
                Create New Chat
            </Button>
          </div>
        </div>
      </div>) :

      (
      <div>
        <div className="table-wrapper">
          <div className="product-list-header">
            <div className="online-shop-title" style={{ flexGrow: 1 }}>
              chats list
            </div>
            <Button
                style={{ marginLeft: 20 }}
                variant="outlined"
                onClick={() => {
                props.history.push("/CreateNewChat");
                }}
              >
                Create New Chat
            </Button>
          </div>
          <table className="table table-striped table-hover">
          {
            chatsList.length === 0 ?
            (<p> you are not signed to any chat yet... </p>):
            (<div>
              <thead>
                <tr>
                  <td>chat name</td>
                </tr>
              </thead>
              <tbody>
              {chatsList.map(item => (
                <tr key={item.id} >
                  <td>{item.name}</td>
                  <td><button type="submit" onClick={()=> props.history.push("/")}>Enter Chat</button></td>
                  <td><button type="submit" onClick={()=>{ leaveChat(props,item.id); setForceReload(Date.now())}}>Leave Chat</button></td>
                </tr>
              ))}
            </tbody>
            </div>)
          }
        </table>
        </div>
        
        <div className="table-wrapper">
          <div className="product-list-header">
            <div className="online-shop-title" style={{ flexGrow: 1 }}>
              available chats list
            </div>
          </div>
          <table className="table table-striped table-hover">
        {
          availableChatsList.length === 0 ?
          (<p> there is no any chat available </p>):
          (<div>
            <thead>
              <tr>
                <td>chat name</td>
              </tr>
            </thead>
            <tbody>
              {availableChatsList.map(item => 
                (<tr key={item.id} >
                <td>{item.name}</td>
                <td><button type="submit" onClick={()=>{ joinChat(props,item.id); setForceReload(Date.now())}}>Join Chat</button></td>
                </tr>)
              )}
            </tbody>
          </div>)
        }
        </table>
        </div>
      
        <div className="table-wrapper">
          <div className="product-list-header">
            <div className="online-shop-title" style={{ flexGrow: 1 }}>
              chats with password list
            </div>
          </div>
          <table className="table table-striped table-hover">
        {
          availableChatsWithPasswordList.length === 0 ?
          (<p> there is no any chat available </p>):
          (<div>
            <thead>
              <tr>
                <td>chat name</td>
              </tr>
            </thead>
            <tbody>
            {availableChatsWithPasswordList.map(item => 
              (<tr key={item.id} >
              <td>{item.name}</td>
                <div>
                  <td>
                    <button type="submit" onClick={()=>{ joinToCloseChat(props,item.id,token); setForceReload(Date.now())}}>Join Chat</button>
                    <input type="text" placeholder='if you have token write it here' onChange={e => setToken(e.target.value)} />
                  </td>
                  <td><button type="submit" onClick={()=>{ sendRequestToJoinChat(props,item.id)}}>Send Request To Chat Admin</button></td>
                </div>
              </tr>)
            )}
          </tbody>
          </div>)
        }
        </table>
        </div>
      
      </div>
      )
    }
  </div>

)};
  
export default withRouter(connect(mapStateToProps)(ChatList));
