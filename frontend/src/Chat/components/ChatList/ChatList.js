import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './ChatList.css';
import Button from "@material-ui/core/Button";
import Api from "../../../Api";
import Auth from "../../../Auth";
import { setRoomID } from "../../../Redux/Actions";
import CircularProgress from "@material-ui/core/CircularProgress";


const mapStateToProps = state => {
  return {
    numberOfItemsInCart: state.cartItems.length,
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};

function leaveChat(props,id) {
  
  return Auth.leaveChat(id , chat => {
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

async function joinChat(props,id) {
  
  return Auth.joinChat(id , chat => {
    chat = chat.data
    if (chat.isJoinedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

async function joinToCloseChat(props,id,token) {
  
  return Auth.joinToCloseChat(id , token, chat => {
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
  
  return Auth.sendRequestToJoinChat(id , chat => {
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
  const [chatsList, setChatsList] = useState(null);
  const [availableChatsList, setAvailableChatsList] = useState(null);
  const [availableChatsWithPasswordList, setAvailableChatsWithPasswordList] = useState(null);
  const [forceReload, setForceReload] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [initialLoad, setInitialLoad] = useState(0);
  const [token, setToken] = useState("");
  
  useEffect(() => {
      console.log(`initial load: ${initialLoad}`);
    Api.chatsList().then(data =>{
      setChatsList(data.data)
      setInitialLoad(ps => ps+1)
    })
    Api.otherChatsList().then(data =>{
      setAvailableChatsList(data.data)
      setInitialLoad(ps => ps+1)
    })
    Api.otherChatsWithPasswordList().then(data =>{
      setAvailableChatsWithPasswordList(data.data)
      setInitialLoad(ps => ps+1)
    })
  },[props.history,props.loggedInUserRole,forceReload])

  useEffect(()=>{
    setInitialLoad(0)
  },[refresh])


  return (
    <div>

    {
      // (initialLoad === 0 || initialLoad % 3 !== 0) ?
      initialLoad !== 3 ?
      (
        <CircularProgress className="circular" />
      )
      :
      (
        chatsList.length === 0 && availableChatsList.length === 0  && availableChatsWithPasswordList.length === 0 ?
        (
        <div>
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
        </div>
        ) 
        :
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
                    <td><button type="submit" onClick={()=> {
                      props.dispatch(setRoomID( item.id ));
                      props.history.push("/chat/chat");
                      }}>Enter Chat</button></td>
                    <td><button type="submit" onClick={()=>{ leaveChat(props,item.id)
                        .then(()=>{
                          setInitialLoad(0)
                          setForceReload(Date.now())
                        })}}>Leave Chat</button></td>
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
                  <td><button type="submit" onClick={()=>{ joinChat(props,item.id)
                        .then(()=>{
                          setInitialLoad(0)
                          setForceReload(Date.now())
                        })}}>Join Chat</button></td>
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
                      <button type="submit" onClick={()=>{ joinToCloseChat(props,item.id,token)
                        .then(()=>{
                          setInitialLoad(0)
                          setForceReload(Date.now())
                        })}}>Join Chat</button>
                      <input type="text" placeholder='if you have token write it' onChange={e => setToken(e.target.value)} />
                    </td>
                    <td><button type="submit" onClick={()=>{ setRefresh(Date.now());sendRequestToJoinChat(props,item.id)
                        .then(()=>{
                          setInitialLoad(0)
                          setForceReload(Date.now())
                        })}}>Send Request To Chat Admin</button></td>
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
      )
    }
  </div>

)};
  
export default withRouter(connect(mapStateToProps)(ChatList));
