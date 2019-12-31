import React, { useState ,useEffect} from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './NewOpenChatRequests.css';
import Button from "@material-ui/core/Button";
import Auth from "../../../Auth";
import Api from "../../../Api";


function accept(props,id) {

  Auth.acceptChat(id , chat => {
    chat = chat.data
    if (chat.isConfirmedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

function deny(props,id) {
  
  Auth.denyChat(id , chat => {
    chat = chat.data
    if (chat.isDenyedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

function deleteChat(props,id) {
  
  Auth.deleteChat(id , chat => {
    chat = chat.data
    if (chat.isDeletedSuccesfully) {
        alert(chat.message)
    } 
    else {
      alert(chat.message)
    }
  });

}

const NewOpenChatRequests = (props) => {
  const [chatsList, setChatsList] = useState([]);
  const [existingChatsList, setExistingChatsList] = useState([]);
  const [forceReload, setForceReload] = useState([]);


  useEffect(() => {
    Api.newOpenChatRequestsList().then(data =>{
      setChatsList(data.data)
    })
    Api.existingChatRoomsList().then(data =>{
      setExistingChatsList(data.data)
    })
  },[forceReload])


return(
  <div>

    <div className="table-wrapper">
      <div className="product-list-header">
        <div className="online-shop-title" style={{ flexGrow: 1 }}>
        New Open Chat Requests
        </div>
        <Button
            style={{ marginLeft: 20 }}
            variant="outlined"
            // onClick={() => {
            // props.history.push("/CreateNewChat");
            // }}
          >
            כפתור שלא עושה כלום
        </Button>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr key='first table tile'>
            <td><span style={{ fontWeight: 'bold' }}> chat name </span></td>
          </tr>
        </thead>
        <tbody>
              {chatsList.map(item => (
                <tr key={item.id} >
                  <td>{item.name}</td>
                  <td><button type="submit" onClick={()=> { accept(props,item.id); setForceReload(Date.now())}}>Accept</button></td>
                  <td><button type="submit" onClick={()=> { deny(props,item.id); setForceReload(Date.now())}}>Deny</button></td>
                </tr>
              ))}
          </tbody>
      </table>
    </div>

    <div className="table-wrapper">
      <div className="product-list-header">
        <div className="online-shop-title" style={{ flexGrow: 1 }}>
        Existing chats
        </div>
        <Button
            style={{ marginLeft: 20 }}
            variant="outlined"
            // onClick={() => {
            // props.history.push("/CreateNewChat");
            // }}
          >
            כפתור שלא עושה כלום
        </Button>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr key='second table tile'>
            <td><span style={{ fontWeight: 'bold' }}> chat name </span></td>
          </tr>
        </thead>
        <tbody>
              {existingChatsList.map(item => (
                <tr key={item.id} >
                  <td>{item.name}</td>
                  <td><button type="submit" onClick={()=> props.history.push("/ShowChatMemberList/"+ item.id)}>Show members</button></td>
                  <td><button type="submit" onClick={()=> { deleteChat(props,item.id); setForceReload(Date.now())}}>Delete</button></td>
                </tr>
              ))}
          </tbody>
      </table>
    </div>

  </div>

)};
  
export default withRouter(connect()(NewOpenChatRequests));
