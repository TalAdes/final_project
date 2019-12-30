import React, { useState ,useEffect} from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './ShowChatMemberList.css';
import Button from "@material-ui/core/Button";
import Api from "../../../Api";
import Auth from "../../../Auth";



function deleteUser(props,userName,chatID) {
  
  Auth.deleteUser(userName,chatID, chat => {
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


const ShowChatMemberList = (props) => {
  const [membersList, setMemberList] = useState([]);
  const [chat, setChat] = useState({name:""});
  const [forceReload, setForceReload] = useState([]);


  useEffect(() => {
    Api.showChatMemberList(props.match.params.id).then(data =>{
      setMemberList(data.data)
    })
    Api.getChatByID(props.match.params.id).then(data =>{
      setChat(data.data[0])
    })
  },[props.match.params.id,forceReload])


return(
  <div>

  {
    membersList.length === 0 && chat !== undefined?
    (<h1> this chat is empty </h1>) :
  
    (<div>

      <div className="table-wrapper">
        <div className="product-list-header">
          <div className="online-shop-title" style={{ flexGrow: 1 }}>
          {chat.name}
          </div>
          <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              onClick={() => {
              props.history.push("/new_open_chat_requests");
              }}
            >
              back
          </Button>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr key='first table tile'>
              <td><span style={{ fontWeight: 'bold' }}> members </span></td>
            </tr>
          </thead>
          <tbody>
                {membersList.map(item => (
                  <tr key={item.id} >
                    <td>{item.name}</td>
                    
                    <td><button type="submit" onClick={()=> { deleteUser(props,item.name,chat.id); setForceReload(Date.now())}}>Delete</button></td>
                  </tr>
                ))}
            </tbody>
        </table>
      </div>

      
    </div>
    )
  
  }
  </div>

)};
  
export default withRouter(connect()(ShowChatMemberList));
