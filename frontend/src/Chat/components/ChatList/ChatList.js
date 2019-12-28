import React, { useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './ChatList.css';
import Button from "@material-ui/core/Button";


const list = [
  {
    id: 'a',
    name: 'Robin',
    lastname: 'Wieruch',
    year: 1988,
  },
  {
    id: 'b',
    name: 'Dave',
    lastname: 'Davidds',
    year: 1990,
  },
];
// const nestedLists = [list, list];
const chatsList = list;
const ChatList = (props) => (
  <div class="table-wrapper">
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
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <td>chat name</td>
        </tr>
      </thead>
      <tbody>
            {chatsList.map(item => (
              <tr>
                <td>{item.name}</td>
                <td><button type="submit" onClick={()=> props.history.push("/")}>Enter Chat</button></td>
                <td><button type="submit" onClick={()=> props.history.push("/")}>Leave Chat</button></td>
              </tr>
            ))}
        </tbody>
    </table>
  </div>
);
  
export default withRouter(connect()(ChatList));
