import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './InfoBar.css';

const InfoBar = (props) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{props.room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a onClick={()=>props.history.push("/chat")}><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);
export default withRouter(connect()(InfoBar));
