import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './ChatManagement.css';
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





function deleteChat(props,id) {
  
  Auth.deleteChat(id , chat => {
    chat = chat.data
    if (chat.isDeletedSuccesfully) {
        alert(chat.message)
        props.history.push("/chat");
    } 
    else {
      alert(chat.message)
    }
  });

}


const ChatList = (props) => {
  const [chatsList, setChatsList] = useState([]);
  const [forceReload] = useState("");
  
  useEffect(() => {
    if(props.loggedInUserRole === 'admin'){
      props.history.push("/new_open_chat_requests");
    }
    else{
      Api.managedChatsList().then(data =>{
        setChatsList(data.data)
      })
    }
  },[props.history,props.loggedInUserRole,forceReload])



  return (
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
            (<p> you are not manager of any chat yet... </p>):
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
                  <td><button type="submit" onClick={()=> props.history.push("/ShowChatMemberList/"+ item.id)}>Show members</button></td>
                  <td><button type="submit" onClick={()=> deleteChat(props,item.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
            </div>)
          }
        </table>
        </div>
)};
  
export default withRouter(connect(mapStateToProps)(ChatList));
