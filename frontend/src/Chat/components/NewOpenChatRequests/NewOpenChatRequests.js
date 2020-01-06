import React, { useState ,useEffect} from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './NewOpenChatRequests.css';
import Auth from "../../../Auth";
import Api from "../../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";


function accept(id) {

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

function deny(id) {
  
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

function deleteChat(id) {
  
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
  const [chatsList, setChatsList] = useState(null);
  const [existingChatsList, setExistingChatsList] = useState([]);
  const [initialLoad, setInitialLoad] = useState(0);
  const [forceReload, setForceReload] = useState([]);


  useEffect(() => {
    Api.newOpenChatRequestsList().then(data =>{
      setInitialLoad(ps => ps+1)
      setChatsList(data.data)
    })
    Api.existingChatRoomsList().then(data =>{
      setInitialLoad(ps => ps+1)
      setExistingChatsList(data.data)
    })
  },[forceReload])


return(
 <div>

  { 
  initialLoad !== 2 ?
      (
        <CircularProgress className="circular" />
      ) 
  :
 ( <div>

    <div className="table-wrapper">
      <div className="product-list-header">
        <div className="online-shop-title" style={{ flexGrow: 1 }}>
        New Open Chat Requests
        </div>
      </div>
      <table className="table table-striped table-hover">
        {chatsList.length === 0 ?
        (
          <p> there are not any new chat requests yet... </p>
        )
        :
        (<div>
          <thead>
            <tr key='first table tile'>
              <td><span style={{ fontWeight: 'bold' }}> chat name </span></td>
            </tr>
          </thead>
          <tbody>
              {chatsList.map(item => (
                <tr key={item.id} >
                  <td>{item.name}</td>
                  <td><button type="submit" onClick={()=> { accept(item.id); setInitialLoad(0);setForceReload(Date.now())}}>Accept</button></td>
                  <td><button type="submit" onClick={()=> { deny(item.id); setInitialLoad(0); setForceReload(Date.now())}}>Deny</button></td>
                </tr>
              ))}
          </tbody>
        </div>)}
      </table>
    </div>

    <div className="table-wrapper">
      <div className="product-list-header">
        <div className="online-shop-title" style={{ flexGrow: 1 }}>
        Existing chats
        </div>
      </div>
      <table className="table table-striped table-hover">
        
        {
          existingChatsList.length === 0?
          (
            <p> there are not chats yet... </p>
          )
          :
        (
        <div>
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
                  <td><button type="submit" onClick={()=> { deleteChat(item.id); setInitialLoad(0);setForceReload(Date.now())}}>Delete</button></td>
                </tr>
              ))}
          </tbody>
        </div>
        )
      }
      </table>
    </div>

  </div>)
}
</div>

)};
  
export default withRouter(connect()(NewOpenChatRequests));
